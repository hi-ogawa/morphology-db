import "mocha";
import * as assert from "assert";
import { parseAnnotation } from "./conllu";
import { example1 } from "./fixtures";

describe("parseAnnotation", () => {
  it("example1", () => {
    const [raw, annotation] = example1;
    assert.deepStrictEqual(parseAnnotation(raw), annotation);
  });
});
