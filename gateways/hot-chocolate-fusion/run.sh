#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <test-suite-id>" >&2
    exit 1
fi

SUITE_ID=$1
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
AUDIT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
GATEWAY="$SCRIPT_DIR/bin/Release/net10.0/HotChocolate.Fusion.AuditGateway.dll"
NITRO="$SCRIPT_DIR/.tools/nitro"
WORK_DIR="$SCRIPT_DIR/.work"
SOURCES_DIR="$WORK_DIR/sources"
SUBGRAPHS_FILE="$WORK_DIR/subgraphs.json"
ARCHIVE="$WORK_DIR/gateway.far"

if [ ! -f "$GATEWAY" ]; then
    echo "The Fusion audit gateway is not built. Run ./install.sh first." >&2
    exit 1
fi

if [ ! -x "$NITRO" ]; then
    echo "Nitro is not installed. Run ./install.sh first." >&2
    exit 1
fi

rm -rf "$WORK_DIR"
mkdir -p "$SOURCES_DIR"

(
    cd "$AUDIT_DIR"
    npm start subgraphs -- --cwd "$WORK_DIR" --test "$SUITE_ID"
)

if ! jq -e '
    type == "array"
    and length > 0
    and all(.[];
        (.name | type == "string" and length > 0)
        and (.url | type == "string" and length > 0))
' "$SUBGRAPHS_FILE" >/dev/null; then
    echo "Audit suite '$SUITE_ID' did not provide valid source schemas." >&2
    exit 1
fi

is_federation_v1_source() {
    case "$SUITE_ID:$1" in
        abstract-types:users | \
        fed1-external-extends:a | \
        fed1-external-extends:b | \
        fed1-external-extends-resolvable:a | \
        fed1-external-extends-resolvable:b | \
        fed1-external-extension:a | \
        fed1-external-extension:b)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

set -- fusion compose \
    --archive "$ARCHIVE" \
    --environment Production \
    --output json

index=0
tab=$(printf '\t')
jq -r '.[] | [.name, .url] | @tsv' "$SUBGRAPHS_FILE" > "$WORK_DIR/subgraphs.tsv"

while IFS="$tab" read -r name url; do
    if [ -z "$name" ] || [ -z "$url" ]; then
        echo "Audit suite '$SUITE_ID' provided an invalid source schema." >&2
        exit 1
    fi

    source_dir="$SOURCES_DIR/source-$index"
    settings_file="$source_dir/schema-settings.json"
    mkdir -p "$source_dir"

    if is_federation_v1_source "$name"; then
        federation_version="1.0"
    else
        federation_version="2.0"
    fi

    jq -n \
        --arg name "$name" \
        --arg url "$url" \
        --arg federation_version "$federation_version" \
        '{
            name: $name,
            transports: {
                http: {
                    url: $url,
                    capabilities: {
                        batching: {
                            variableBatching: false,
                            requestBatching: false
                        }
                    }
                }
            },
            preprocessor: {
                inferKeysFromLookups: false
            },
            extensions: {
                chillicream: {
                    apolloFederationSupport: {
                        version: $federation_version
                    }
                }
            }
        }' > "$settings_file"

    set -- "$@" \
        --source-schema-url "$url" \
        --source-schema-settings-file "$settings_file"
    index=$((index + 1))
done < "$WORK_DIR/subgraphs.tsv"

case "$SUITE_ID" in
    non-resolvable-interface-object)
        set -- "$@" --allow-non-resolvable-interface-objects
        ;;
    corrupted-supergraph-node-id | union-interface-distributed)
        set -- "$@" \
            --enable-global-object-identification \
            --node-resolution source-schema
        ;;
    partial-union-complex)
        set -- "$@" \
            --shareable-field-runtime-type-routing common-runtime-types
        ;;
esac

"$NITRO" "$@"

exec dotnet "$GATEWAY" "$ARCHIVE"
