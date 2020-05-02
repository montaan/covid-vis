import { FSDirEntry } from "../../Montaan/Filesystems";
import { COVIDCases, Regions } from "./COVIDCases";

import { TreeLink } from "../../Montaan/MainApp";
import CasesFilesystem from "../CasesFilesystem";

// Normalize case counts to match CFR in well-tested post-epidemic countries (roughly 1.3% CFR)
const CaseMultiplier = 57145 / 1064001 / 0.013;

export const COVIDCaseLinks: TreeLink[] = [];

const tree = new FSDirEntry("United States");
tree.filesystem = new CasesFilesystem(
  tree,
  COVIDCases,
  Regions,
  COVIDCaseLinks,
  CaseMultiplier
);
tree.fetched = true;
export const COVIDTree = tree;
