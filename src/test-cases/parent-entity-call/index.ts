import { serve } from "../../supergraph";
import a from "./a.subgraph";
import b from "./b.subgraph";
import c from "./c.subgraph";
import test from "./test";

export default serve("parent-entity-call", [a, b, c], test);
