const assert = require("assert");
const util = require("./util");
const { describe, it } = require("mocha");

describe("Acceptance tests for util functions", () => {
  describe("can distribute arrays", () => {
    it("produces a new array with each element from each argument", () => {
      // note this also tests degenerate cases with zero-element arrays
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const arr1 = Array(i).fill(1); // array of 1's
          const arr2 = Array(j).fill(2); // array of 2's

          const out = util.distributeArrays( arr1, arr2 );
          assert.equal(out.length, i + j);
          assert(out.filter(i => i === 1).length == arr1.length);
          assert(out.filter(i => i === 2).length == arr2.length);

          const outRev = util.distributeArrays( arr2, arr1 );
          assert.equal(outRev.length, i + j);
          assert(outRev.filter(i => i === 1).length == arr1.length);
          assert(outRev.filter(i => i === 2).length == arr2.length);
        }
      }
    });
    it("evenly distributes arrays with the same number of elements", () => {
      const arr1 = [0, 1, 2, 3];
      const arr2 = [10, 11, 12, 13];
      const out = util.distributeArrays( arr1, arr2 );
      assert.equal(out.length, 8);

      // check that distance between arr1 elements is always even
      const firstIdx1 = out.indexOf(arr1[0]);
      for (let i = 0; i < arr1.length; ++i) {
        let idx = out.indexOf(arr1[i]);
        const dist = idx - firstIdx1;
        assert((dist % 2) == 0);
      }
    });
  });
});
