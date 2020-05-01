import React from 'react';
import { FSDirEntry, Filesystem, getOrCreateDir } from '../../Montaan/Filesystems';
import PeopleFilesystem from '../PeopleFilesystem';

import { Countries } from './Countries';
import { CountryCases } from './CountryCases';

export class WorldFilesystem extends Filesystem {
    constructor(mountPoint: FSDirEntry) {
        super(undefined);
        this.mountPoint = mountPoint;

        let population = 0;

        for (const country in Countries) {
            let tree = this.mountPoint;
            tree = getOrCreateDir(tree, country);
            const pop = (Countries as any)[country];
            if (isNaN(pop)) {
                tree.fetched = true;
                continue;
            }
            const cases = (CountryCases as any)[country];
            const caseCount = Math.max(0, (cases && cases[0]) || 0);
            const deaths = Math.max(0, (cases && cases[1]) || 0);
            const recovered = Math.max(0, (cases && cases[2]) || 0);
            const completion = (deaths + recovered) / Math.max(1, caseCount);
            console.log(country, deaths, caseCount, deaths / Math.max(1, caseCount), deaths / Math.max(1, caseCount) / 0.013, completion);
            tree.filesystem = new PeopleFilesystem(population, pop, caseCount, deaths / Math.max(1, caseCount) / 0.013);
            population += pop;
            tree.color = [
                (caseCount > 0 ? 0.1 : 0) +
                Math.min(0.4, (100 * caseCount) / pop),
                caseCount <= 0
                ? 0.2
                : 0 +
                    Math.max(
                    0,
                    Math.min(0.1, 1 - (100 * caseCount) / pop)
                    ),
                0.0
            ];
            tree.title = `${country} (${caseCount.toLocaleString()} / ${pop.toLocaleString()})`
        }
        console.log("World population", population);
    }
}

const WorldTree = new FSDirEntry('World');
WorldTree.fetched = true;
WorldTree.filesystem = new WorldFilesystem(WorldTree);

export default WorldTree;
