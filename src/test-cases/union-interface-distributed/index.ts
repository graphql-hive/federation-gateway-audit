import { serve } from "../../supergraph";
import a from "./a.subgraph";
import b from "./b.subgraph";
// import test from './test';

export default serve("union-interface-distributed", [a, b] /* , test */, []);
