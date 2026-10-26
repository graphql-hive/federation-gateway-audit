#!/bin/sh
# Builds the Apollo Router from the head of the dev-v3.x branch, which is ahead
# of the latest v3 release. Shared by the apollo-router-v3* gateways, and copies
# the binary to ./router in the calling gateway's directory.
# https://github.com/apollographql/router/tree/dev-v3.x
set -e

ROUTER_REF=f40a636bc52de88f2176b170198a5e8285b847d2
PROTOC_VERSION=36.2

BUILD_DIR="$(cd "$(dirname "$0")" && pwd)/.build"
SRC_DIR="$BUILD_DIR/router-$ROUTER_REF"

# The router's build script compiles protobufs, so it needs protoc
if [ -z "$PROTOC" ] && ! command -v protoc >/dev/null 2>&1; then
  case "$(uname -s)-$(uname -m)" in
    Linux-x86_64) PROTOC_PLATFORM=linux-x86_64 ;;
    Linux-aarch64) PROTOC_PLATFORM=linux-aarch_64 ;;
    Darwin-arm64) PROTOC_PLATFORM=osx-aarch_64 ;;
    Darwin-x86_64) PROTOC_PLATFORM=osx-x86_64 ;;
    *) echo "Unsupported platform for protoc: $(uname -s)-$(uname -m)" >&2; exit 1 ;;
  esac
  PROTOC_DIR="$BUILD_DIR/protoc-$PROTOC_VERSION"
  if [ ! -x "$PROTOC_DIR/bin/protoc" ]; then
    mkdir -p "$PROTOC_DIR"
    curl -sSL -o "$PROTOC_DIR/protoc.zip" "https://github.com/protocolbuffers/protobuf/releases/download/v$PROTOC_VERSION/protoc-$PROTOC_VERSION-$PROTOC_PLATFORM.zip"
    unzip -q -o "$PROTOC_DIR/protoc.zip" -d "$PROTOC_DIR"
  fi
  export PROTOC="$PROTOC_DIR/bin/protoc"
fi

if [ ! -d "$SRC_DIR/.git" ]; then
  mkdir -p "$SRC_DIR"
  git -C "$SRC_DIR" init -q
  git -C "$SRC_DIR" fetch -q --depth 1 https://github.com/apollographql/router.git "$ROUTER_REF"
  git -C "$SRC_DIR" checkout -q FETCH_HEAD
fi

# Install the toolchain pinned in the router's rust-toolchain.toml
RUST_TOOLCHAIN=$(sed -n 's/^channel = "\(.*\)"/\1/p' "$SRC_DIR/rust-toolchain.toml")
rustup toolchain install "$RUST_TOOLCHAIN" --profile minimal

(cd "$SRC_DIR" && cargo +"$RUST_TOOLCHAIN" build --release --locked -p apollo-router --bin router)
cp "$SRC_DIR/target/release/router" ./router
