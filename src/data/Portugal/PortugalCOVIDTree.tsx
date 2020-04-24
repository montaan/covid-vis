import React from "react";
import {
  FSDirEntry,
  getOrCreateDir,
  createDir,
  FSEntry
} from "../../Montaan/Filesystems";
import { PortugalCOVIDCases } from "./PortugalCOVIDCases";
import { getNUTSName } from "./NUTS";
import { TreeLink } from "../../Montaan/MainApp";
import utils from "../../Montaan/Utils/utils";
import { PortugalConcelhos } from "./PortugalConcelhos";
import PeopleFilesystem from "../PeopleFilesystem";
import CasesFilesystem from "../CasesFilesystem";

const PortugalMultiplier = 820 / 22353 / 0.013;
export const PortugalCOVIDCaseLinks: TreeLink[] = [];

class PortugalCasesFilesystem extends CasesFilesystem {
  constructor(mountPoint: FSEntry) {
    super(
      mountPoint,
      PortugalCOVIDCases,
      new Map(),
      PortugalCOVIDCaseLinks,
      PortugalMultiplier
    );
  }

  getDayTree(date: string) {
    const tree = new FSDirEntry("");
    const dayCases = new Map<string, number>(
      PortugalCOVIDCases.get(date).entries()
    );
    const caseList: string[] = [];
    let populationCounter = 0;
    const populationBlockSize = 1000;
    PortugalConcelhos.forEach(
      ([nuts, lau, lauName, lauNameLatin, change, populationString]) => {
        const population = parseInt(populationString);
        const nuts1Entry = getOrCreateDir(tree, getNUTSName(nuts, 1));
        const nuts2Entry = getOrCreateDir(nuts1Entry, getNUTSName(nuts, 2));
        let covidCount = dayCases.get(lauName) ?? 0;
        if (covidCount > population) {
          throw new Error("More cases than people");
        }
        if (covidCount > 0) {
          dayCases.delete(lauName);
        }
        const nuts3Entry = getOrCreateDir(nuts2Entry, getNUTSName(nuts, 3));
        const lauEntry = createDir(nuts3Entry, lauName.replace(/\//g, "|"));
        if (lauEntry.lastIndex < 0) lauEntry.lastIndex = 0;
        if (nuts3Entry.lastIndex < 0) nuts3Entry.lastIndex = 0;
        if (nuts2Entry.lastIndex < 0) nuts2Entry.lastIndex = 0;
        if (nuts1Entry.lastIndex < 0) nuts1Entry.lastIndex = 0;
        lauEntry.lastIndex += covidCount;
        nuts3Entry.lastIndex += covidCount;
        nuts2Entry.lastIndex += covidCount;
        nuts1Entry.lastIndex += covidCount;
        lauEntry.color = [
          (lauEntry.lastIndex > 0 ? 0.1 : 0) +
            Math.min(0.4, (100 * lauEntry.lastIndex) / population),
          lauEntry.lastIndex <= 0
            ? 0.2
            : 0 +
              Math.max(
                0,
                Math.min(0.1, 1 - (100 * lauEntry.lastIndex) / population)
              ),
          0.0
        ];
        (nuts3Entry as any).population =
          ((nuts3Entry as any).population || 0) + population;
        nuts3Entry.color = [
          (nuts3Entry.lastIndex > 0 ? 0.1 : 0) +
            Math.min(
              0.4,
              (100 * nuts3Entry.lastIndex) / (nuts3Entry as any).population
            ),
          nuts3Entry.lastIndex <= 0
            ? 0.2
            : 0 +
              Math.max(
                0,
                Math.min(
                  0.1,
                  1 -
                    (100 * nuts3Entry.lastIndex) /
                      (nuts3Entry as any).population
                )
              ),
          0
        ];
        nuts3Entry.title = `${nuts3Entry.name} ${Math.floor(
          nuts3Entry.lastIndex
        )}/${(nuts3Entry as any).population} ${Math.floor(
          (10000 * nuts3Entry.lastIndex) / (nuts3Entry as any).population
        ) / 100}%`;
        lauEntry.title = `${lauEntry.name} ${Math.floor(
          lauEntry.lastIndex
        )}/${population} ${Math.floor(
          (10000 * lauEntry.lastIndex) / population
        ) / 100}%`;
        for (let i = 0; i < population; i += populationBlockSize) {
          const populationEntry = createDir(lauEntry, i.toString());
          populationEntry.color = [
            (covidCount > 0 ? 0.2 : 0) +
              0.5 * Math.min(populationBlockSize, covidCount) * 0.01,
            0.0,
            0.0
          ];
          populationEntry.filesystem = new PeopleFilesystem(
            populationCounter,
            Math.min(populationBlockSize, population - i),
            covidCount,
            PortugalMultiplier
          );
          populationEntry.filesystem.mountPoint = populationEntry;
          covidCount -= populationBlockSize;
          covidCount = Math.max(0, covidCount);

          populationCounter += Math.min(populationBlockSize, population - i);
        }
      }
    );
    utils.traverseFSEntry(
      tree,
      fsEntry => (fsEntry.fetched = fsEntry.filesystem === undefined),
      ""
    );
    return tree;
  }
}

const tree = new FSDirEntry("Portugal");
tree.filesystem = new PortugalCasesFilesystem(tree);
tree.fetched = true;
export const PortugalCOVIDTree = tree;
