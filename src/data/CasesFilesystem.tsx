import React from "react";
import PeopleFilesystem from "./PeopleFilesystem";
import {
  Filesystem,
  FSDirEntry,
  FSEntry,
  createDir,
  getFullPath
} from "../Montaan/Filesystems";
import { TreeLink, FSState } from "../Montaan/MainApp";
import utils from "../Montaan/Utils/utils";
import DateSlider from "./DateSlider";

export default class CasesFilesystem extends Filesystem {
  graphVisible: boolean = false;
  currentDate: string;
  dates: string[];
  trees: Map<string, FSDirEntry>;
  COVIDCases: Map<any, any>;
  Regions: Map<string, number>;
  COVIDCaseLinks: TreeLink[];
  caseMultiplier: number = 1;

  constructor(
    mountPoint: FSEntry,
    COVIDCases: Map<any, any>,
    Regions: Map<string, number>,
    COVIDCaseLinks: TreeLink[],
    caseMultiplier = 1
  ) {
    super(undefined);
    this.COVIDCases = COVIDCases;
    this.COVIDCaseLinks = COVIDCaseLinks;
    this.Regions = Regions;
    this.caseMultiplier = caseMultiplier;
    this.mountPoint = mountPoint;
    this.dates = Array.from(COVIDCases.keys());
    this.currentDate = this.dates[this.dates.length - 1];
    this.trees = new Map();
    // this.dates.forEach((d) => this.trees.set(d, this.getDayTree(d)));
    this.useDayTree(this.currentDate);
  }

  async readDir(path: string) {
    return null;
  }

  setLinks = (links: TreeLink[]) => {};
  navigationTarget = "";

  onClick = () => {
    this.graphVisible = !this.graphVisible;
    if (this.graphVisible) {
      this.setLinks(this.COVIDCaseLinks);
    } else {
      this.setLinks([]);
    }
  };

  requestFrame() {}

  getDayTree(date: string) {
    const tree = new FSDirEntry("");
    const cases = this.COVIDCases.get(date);
    if (!cases) return tree;
    const dayCases = new Map<string, { cases: number; deaths: number, recovered: number, hospitalized: number }>(
      cases.entries()
    );
    for (const region of this.Regions.entries()) {
      const lauName = region[0];
      const population = region[1];
      const covidCounts = dayCases.get(lauName);
      const covidCount = Math.max(0, covidCounts ? covidCounts.cases : 0);
      const deaths = Math.max(0, covidCounts ? covidCounts.deaths : 0);
      const regionMultiplier = deaths ? deaths / covidCount / 0.013 : this.caseMultiplier;
      const completionRatio = (deaths + (covidCounts?.recovered || 0)) / covidCount;
      let completion = (covidCounts && covidCounts.recovered && covidCounts.recovered > 0) ? Math.round(100*completionRatio) + '%' : '-';
      if (covidCount > population) {
        throw new Error("More cases than people");
      }
      if (covidCount > 0) {
        dayCases.delete(lauName);
      }
      const lauEntry = createDir(tree, lauName.replace(/\//g, "|"));
      lauEntry.title = `${lauEntry.name} ${completion}`;
      if (lauEntry.lastIndex < 0) lauEntry.lastIndex = 0;
      lauEntry.lastIndex += covidCount;
      lauEntry.color = [
          (covidCount > 0 ? 0.1 : 0) +
          Math.min(0.4, (100 * covidCount * regionMultiplier) / population),
          covidCount <= 0
          ? 0.4
          : 0 +
              Math.max(
              0,
              Math.min(0.1, 1 - (100 * covidCount * regionMultiplier) / population)
              ),
          0.5 * completionRatio**2
      ];
      lauEntry.filesystem = new PeopleFilesystem(
        0,
        population,
        covidCount,
        this.caseMultiplier
      );
      lauEntry.filesystem.mountPoint = lauEntry;
    }
    utils.traverseFSEntry(
      tree,
      fsEntry => (fsEntry.fetched = fsEntry.filesystem === undefined),
      ""
    );
    // COVIDCaseLinks.splice(0);
    // const caseLinks = convertCaseListToLinks(caseList);
    // for (let i = 0; i < caseLinks.length; i++) {
    // 	COVIDCaseLinks.push(caseLinks[i]);
    // }
    return tree;
  }

  useDayTree(date: string) {
    let dayTree = this.trees.get(date);
    if (!dayTree) {
      dayTree = this.getDayTree(date);
      this.trees.set(date, dayTree);
    }
    if (this.mountPoint) {
      this.mountPoint.entries = dayTree.entries;
    }
  }

  setDate = (date: string) => {
    this.currentDate = date;
    this.useDayTree(date);
    this.requestFrame();
  };

  getUIComponents(state: FSState) {
    this.setLinks = state.setLinks;
    this.navigationTarget = state.navigationTarget;
    this.requestFrame = state.requestFrame;
    return (
      <div
        style={{ position: "fixed", top: "80px", left: "10px", zIndex: 10000 }}
        key={this.mountPoint ? getFullPath(this.mountPoint) : "cases"}
      >
        {/* <Button onClick={this.onClick}>Show graph</Button> */}
        <DateSlider
          dates={this.dates}
          currentDate={this.currentDate}
          setDate={this.setDate}
        />
      </div>
    );
  }
}
