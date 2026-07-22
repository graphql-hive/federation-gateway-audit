import { serve } from "../../supergraph.js";
import a from "./a.subgraph.js";
import b from "./b.subgraph.js";
import test from "./test.js";

export default serve(
  "executable-directive-definition-default-arguments",
  [a, b],
  test,
);
