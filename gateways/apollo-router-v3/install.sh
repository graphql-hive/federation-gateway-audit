#!/bin/sh
# https://github.com/apollographql/router/tree/dev-v3.x
# No binary is published for dev-v3.x yet, so build the router from a pinned commit.
set -e

ROUTER_COMMIT=33a591ca8dd1994f3b5bd981a0473341aacdeb46
PROTOC_VERSION=36.2

if [ -x ./router ] && [ "$(cat .router-commit 2>/dev/null)" = "$ROUTER_COMMIT" ]; then
  echo "Apollo Router $ROUTER_COMMIT already built"
  exit 0
fi

rm -rf .router-src
mkdir .router-src

# The router's build script needs protoc. Download it if it isn't installed.
if [ -z "$PROTOC" ] && ! command -v protoc >/dev/null 2>&1; then
  case "$(uname -s)-$(uname -m)" in
    Linux-x86_64) PROTOC_PLATFORM=linux-x86_64 ;;
    Linux-aarch64) PROTOC_PLATFORM=linux-aarch_64 ;;
    Darwin-arm64) PROTOC_PLATFORM=osx-aarch_64 ;;
    Darwin-x86_64) PROTOC_PLATFORM=osx-x86_64 ;;
    *) echo "Unsupported platform for protoc: $(uname -s)-$(uname -m)" >&2; exit 1 ;;
  esac
  curl -fsSL -o .router-src/protoc.zip "https://github.com/protocolbuffers/protobuf/releases/download/v$PROTOC_VERSION/protoc-$PROTOC_VERSION-$PROTOC_PLATFORM.zip"
  unzip -q .router-src/protoc.zip -d .router-src/protoc
  export PROTOC="$PWD/.router-src/protoc/bin/protoc"
fi

git init -q .router-src/router
git -C .router-src/router fetch -q --depth 1 https://github.com/apollographql/router.git "$ROUTER_COMMIT"
git -C .router-src/router checkout -q FETCH_HEAD
(cd .router-src/router && cargo build --release --locked -p apollo-router --bin router)
cp .router-src/router/target/release/router ./router
echo "$ROUTER_COMMIT" > .router-commit
rm -rf .router-src
