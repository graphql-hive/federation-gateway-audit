#!/bin/sh
# Reuses the router built from dev-v3.x by ../apollo-router-v3 (see its install.sh for the pinned commit).
set -e

(cd ../apollo-router-v3 && ./install.sh)
cp ../apollo-router-v3/router ./router
