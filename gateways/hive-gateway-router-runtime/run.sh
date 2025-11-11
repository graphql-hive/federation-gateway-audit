# cant use "npm start" because there's a package.json here
node --import tsx ../../src/cli.ts supergraph --cwd . --test $1
./node_modules/.bin/hive-gateway supergraph supergraph.graphql --port 4000
