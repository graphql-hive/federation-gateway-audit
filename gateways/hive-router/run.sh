npm start supergraph -- --cwd ./gateways/hive-router --test $1

export HIVE_SUPERGRAPH_SOURCE=file
export HIVE_SUPERGRAPH_PATH=./supergraph.graphql
./hive_router
