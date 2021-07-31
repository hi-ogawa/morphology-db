import "mocha";
import * as assert from "assert/strict";
import { validate, ValidationError } from "./validation";

describe("validation", () => {
  describe("idParam", () => {
    it("case1", () => {
      const params = { id: 1234 };
      validate("idParam", params);
      assert.equal(params.id, 1234);
    });

    it("case2", () => {
      const params = { id: "1234" };
      validate("idParam", params);
      assert.equal(params.id, 1234);
    });

    it("case3", () => {
      const params = { id: "million" };
      assert.throws(
        () => validate("idParam", params),
        (error) => {
          assert(error instanceof ValidationError);
          assert.equal(error.message, "data.id should be number");
          return true;
        }
      );
    });

    it("case4", () => {
      const params = { di: 4321 };
      assert.throws(
        () => validate("idParam", params),
        (error) => {
          assert(error instanceof ValidationError);
          assert.equal(
            error.message,
            "data should have required property 'id'"
          );
          return true;
        }
      );
    });
  });
});
