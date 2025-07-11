import { serve } from "../../supergraph.js";
import author from "./author.subgraph.js";
import media from "./media.subgraph.js";
import playlist from "./playlist.subgraph.js";
import test from "./test.js";

export default serve(
  "interface-object-indirect-extension",
  [author, media, playlist],
  test,
);
