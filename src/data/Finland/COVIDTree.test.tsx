import { COVIDTree } from "./COVIDTree";
import { COVIDCases, Regions } from "./COVIDCases";

test("Load Sweden population example", () => {
  const tree = COVIDTree;
  const cases = COVIDCases;
  expect(tree).not.toBeUndefined();
});
