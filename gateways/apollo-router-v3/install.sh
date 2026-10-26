#!/bin/sh
# Apollo Router built from the dev-v3.x branch. No release or nightly is
# published for this commit, so it's built from source (needs rustup/cargo).
# https://github.com/apollographql/router/tree/dev-v3.x
set -eu

ROUTER_REF="33a591ca8dd1994f3b5bd981a0473341aacdeb46"

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SRC_DIR="$SCRIPT_DIR/.router-src"
cd "$SCRIPT_DIR"

if [ -x ./router ] && [ "$(cat .router-ref 2>/dev/null)" = "$ROUTER_REF" ]; then
  echo "Apollo Router $ROUTER_REF is already built"
  exit 0
fi

if [ ! -d "$SRC_DIR/.git" ]; then
  git init -q "$SRC_DIR"
  git -C "$SRC_DIR" remote add origin https://github.com/apollographql/router.git
fi
git -C "$SRC_DIR" fetch -q --depth 1 origin "$ROUTER_REF"
git -C "$SRC_DIR" checkout -q --force FETCH_HEAD

# The router's build script needs protoc
if [ -z "${PROTOC:-}" ] && ! command -v protoc >/dev/null 2>&1; then
  PROTOC_VERSION="36.2"
  case "$(uname -s)-$(uname -m)" in
    Linux-x86_64) PROTOC_PLATFORM="linux-x86_64" ;;
    Linux-aarch64 | Linux-arm64) PROTOC_PLATFORM="linux-aarch_64" ;;
    Darwin-arm64) PROTOC_PLATFORM="osx-aarch_64" ;;
    Darwin-x86_64) PROTOC_PLATFORM="osx-x86_64" ;;
    *) echo "Unsupported platform for protoc: $(uname -s)-$(uname -m)" >&2; exit 1 ;;
  esac
  PROTOC_DIR="$SCRIPT_DIR/.protoc"
  if [ ! -x "$PROTOC_DIR/bin/protoc" ]; then
    mkdir -p "$PROTOC_DIR"
    curl -fsSL -o "$PROTOC_DIR/protoc.zip" \
      "https://github.com/protocolbuffers/protobuf/releases/download/v$PROTOC_VERSION/protoc-$PROTOC_VERSION-$PROTOC_PLATFORM.zip"
    unzip -q -o "$PROTOC_DIR/protoc.zip" -d "$PROTOC_DIR"
  fi
  export PROTOC="$PROTOC_DIR/bin/protoc"
fi

(cd "$SRC_DIR" && cargo build --release --locked -p apollo-router --bin router)

cp "$SRC_DIR/target/release/router" ./router
echo "$ROUTER_REF" > .router-ref
