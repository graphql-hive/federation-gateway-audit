#!/bin/sh
# Same router binary as ../apollo-router-v3, only router.yaml differs.
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

"$SCRIPT_DIR/../apollo-router-v3/install.sh"
cp "$SCRIPT_DIR/../apollo-router-v3/router" "$SCRIPT_DIR/router"
