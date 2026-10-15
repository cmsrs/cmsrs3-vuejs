import trans from "./trans.js";

describe("trans", () => {
  describe("getStrByKey", () => {
    it("getStrByKey get test str", () => {
      const t1 = trans.ttt("success_page_edit");
      expect(t1).not.toBe("");
    });
    it("getStrByKey get empty", () => {
      const fakeKey = "success_page_edit_23434";
      const t1 = trans.ttt(fakeKey);
      expect(t1).toBe(fakeKey);
    });
  });
});
