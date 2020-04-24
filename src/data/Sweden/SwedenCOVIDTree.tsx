import { FSDirEntry } from "../../Montaan/Filesystems";
import { SwedenCOVIDCases, SwedenRegions } from "./SwedenCOVIDCases";

import { TreeLink } from "../../Montaan/MainApp";
import CasesFilesystem from "../CasesFilesystem";

// Normalize case counts to match CFR in well-tested post-epidemic countries (roughly 1.3% CFR)
const SwedenMultiplier = 2021 / 16755 / 0.013;

export const SwedenCOVIDCaseLinks: TreeLink[] = [];
const tree = new FSDirEntry("Sweden");
tree.filesystem = new CasesFilesystem(
  tree,
  SwedenCOVIDCases,
  SwedenRegions,
  SwedenCOVIDCaseLinks,
  SwedenMultiplier
);
tree.fetched = true;
export const SwedenCOVIDTree = tree;
