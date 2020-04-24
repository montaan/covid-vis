import { FSDirEntry } from "../../Montaan/Filesystems";
import { COVIDCases, Regions } from "./COVIDCases";

import { TreeLink } from "../../Montaan/MainApp";
import CasesFilesystem from "../CasesFilesystem";

// Normalize case counts to match CFR in well-tested post-epidemic countries (roughly 1.3% CFR)
const FinlandMultiplier = 172 / 4284 / 0.013;

export const COVIDCaseLinks: TreeLink[] = [];

const tree = new FSDirEntry("Finland");
tree.filesystem = new CasesFilesystem(
  tree,
  COVIDCases,
  Regions,
  COVIDCaseLinks,
  FinlandMultiplier
);
tree.fetched = true;
export const COVIDTree = tree;
