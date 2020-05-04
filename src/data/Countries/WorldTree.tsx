import React from 'react';
import { FSDirEntry, Filesystem, getOrCreateDir } from '../../Montaan/Filesystems';
import PeopleFilesystem from '../PeopleFilesystem';

import { Countries } from './Countries';
import { CountryCases } from './CountryCases';

import PortugalCOVIDTree from "../Portugal";
import { SwedenCOVIDTree } from "../Sweden";
import { COVIDTree as FinlandCOVIDTree } from "../Finland";
import { COVIDTree as UnitedStatesCOVIDTree } from "../UnitedStates";

// import NUTSTree from "../../data/Europe/NUTSTree";

const countryDetails = {
    Portugal: PortugalCOVIDTree,
    Sweden: SwedenCOVIDTree,
    Finland: FinlandCOVIDTree,
    'United States': UnitedStatesCOVIDTree
};

export class WorldFilesystem extends Filesystem {
    getCountryTitleAndColor(country:string) : {
        title: string;
        color: number[];
        unresolved: number;
        caseMultiplier: number;
        caseCount: number;
        resolved: number;
        deaths: number;
        completionRatio: number;
    } 
    {
        const pop = (Countries as any)[country];
        if (isNaN(pop)) {
            return {title: country, color: [0,0,0], unresolved:0, resolved:0, deaths:0, caseCount:0, completionRatio:0, caseMultiplier:0};
        }
        const cases = (CountryCases as any)[country];
        const caseCount:number = Math.max(0, (cases && cases[0]) || 0);
        const deaths:number = Math.max(0, (cases && cases[1]) || 0);
        const recovered:number = Math.max(0, (cases && cases[2]) || 0);
        const resolved:number = deaths + recovered;
        const unresolved:number = caseCount - resolved;
        const completionRatio:number = resolved / Math.max(1, caseCount);
        const caseMultiplier:number = deaths / Math.max(1, caseCount) / 0.013;
        let completion:string = Math.round(100*completionRatio) + '%';
        return {
            unresolved, caseMultiplier, caseCount, resolved, deaths, completionRatio,
            title: `${country} ${completion}`,
            color : [
                ((completionRatio <= 0 || completionRatio > 0.9) ? 0 : 0.1) +
                Math.min(0.4, (100 * unresolved * caseMultiplier) / pop),
                (completionRatio <= 0 || completionRatio > 0.9)
                ? 0.4
                : 0 +
                    Math.max(
                    0,
                    Math.min(0.1, 1 - (100 * unresolved * caseMultiplier) / pop)
                    ),
                0.5 * completionRatio**2
            ]
        };
    }

    constructor(mountPoint: FSDirEntry) {
        super(undefined);
        this.mountPoint = mountPoint;

        let population = 0;

        Object.keys(Countries).sort().forEach(country => {
            let tree = mountPoint;
            tree = getOrCreateDir(tree, country);
            const pop = (Countries as any)[country];
            if (isNaN(pop)) {
                tree.fetched = true;
                return;
            }
            const {title, color, unresolved, caseMultiplier} = this.getCountryTitleAndColor(country);
            tree.filesystem = new PeopleFilesystem(0, pop, unresolved, caseMultiplier);
            population += pop;
            tree.title = title;
            tree.color = color;
            if (country in countryDetails) {
                tree.fetched = true;
                const countryTree = (countryDetails as any)[country];
                countryTree.title = `${unresolved.toLocaleString()} / ${pop.toLocaleString()}`;
                tree.filesystem.readDir('/0').then(dir => {
                    if (dir) countryTree.color = dir.entries.get('0')?.color;
                });
                tree.entries.set('0', countryTree);
                countryTree.parent = tree;
                countryTree.name = '0';
                return;
            }
         });
        console.log("World population", population);
    }
}

const WorldTree = new FSDirEntry('World');
WorldTree.fetched = true;
WorldTree.filesystem = new WorldFilesystem(WorldTree);

export default WorldTree;
