import { SwedenCOVIDTree } from "./SwedenCOVIDTree";
import { SwedenCOVIDCases } from "./SwedenCOVIDCases";

test("Load Sweden population example", () => {
  const tree = SwedenCOVIDTree;
  const cases = SwedenCOVIDCases;
  expect(tree).not.toBeUndefined();
});
