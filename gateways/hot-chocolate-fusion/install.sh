#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT="$SCRIPT_DIR/HotChocolate.Fusion.AuditGateway.csproj"
TOOLS_DIR="$SCRIPT_DIR/.tools"
NITRO="$TOOLS_DIR/nitro"
NITRO_VERSION="16.5.0-p.18"

mkdir -p "$TOOLS_DIR"

if [ -x "$NITRO" ]; then
    dotnet tool update ChilliCream.Nitro.CommandLine \
        --tool-path "$TOOLS_DIR" \
        --version "$NITRO_VERSION"
else
    dotnet tool install ChilliCream.Nitro.CommandLine \
        --tool-path "$TOOLS_DIR" \
        --version "$NITRO_VERSION"
fi

dotnet build "$PROJECT" --configuration Release --framework net10.0 --nologo
