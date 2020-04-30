import React from 'react';
import { FSDirEntry, Filesystem, getOrCreateDir } from '../../Montaan/Filesystems';
import PeopleFilesystem from '../PeopleFilesystem';

import { Countries } from './Countries';

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
            tree.filesystem = new PeopleFilesystem(population, pop, 0, 1);
            population += pop;
        }
        console.log("World population", population);
    }
}

const WorldTree = new FSDirEntry('World');
WorldTree.fetched = true;
WorldTree.filesystem = new WorldFilesystem(WorldTree);

export default WorldTree;
