import { serve } from "../../supergraph.js";
import card from "./card.subgraph.js";
import product from "./product.subgraph.js";
import test from "./test.js";

export default serve("union-overfetching", [card, product], test);
