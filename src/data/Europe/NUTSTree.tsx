import React from 'react';
import { FSDirEntry, Filesystem, getOrCreateDir } from '../../Montaan/Filesystems';
import PeopleFilesystem from '../PeopleFilesystem';

import NUTS from './NUTS.json';
import LAUbyNUTS3 from './LAUbyNUTS3.json';
import NUTSNames from './NUTSNames.json';

export class NUTSFilesystem extends Filesystem {
    constructor(mountPoint: FSDirEntry) {
        super(undefined);
        this.mountPoint = mountPoint;

        let population = 0;

        for (const area in NUTS) {
            if (/^EU|EF/.test(area)) continue;
            let tree = this.mountPoint;
            tree = getOrCreateDir(tree, (NUTSNames as any)[area.slice(0,2)] || area.slice(0,2));
            tree.fetched = true;
            if (area.length < 3) continue;
            tree = getOrCreateDir(tree, (NUTSNames as any)[area.slice(0,3)] || area.slice(0,3));
            tree.fetched = true;
            if (area.length < 4) continue;
            tree = getOrCreateDir(tree, (NUTSNames as any)[area.slice(0,4)] || area.slice(0,4));
            tree.fetched = true;
            if (area.length < 5) continue;
            tree = getOrCreateDir(tree, (NUTSNames as any)[area.slice(0,5)] || area.slice(0,5));
            const laus = (LAUbyNUTS3 as any)[area];
            if (laus) {
                tree.fetched = true;
                for (const lau in laus) {
                    const lauObj = laus[lau];
                    const lauTree = getOrCreateDir(tree, lauObj.latinName);
                    lauTree.filesystem = new PeopleFilesystem(population, parseInt(lauObj.population), 0, 1);
                    population += parseInt(lauObj.population);
                }
            } else {
                const pop = (NUTS as any)[area].population.TOTAL.T.latest;
                if (isNaN(pop)) {
                    tree.fetched = true;
                    continue;
                }
                tree.filesystem = new PeopleFilesystem(population, pop, 0, 1);
                population += pop;
            }
        }
        console.log(population);
    }
}

const NUTSTree = new FSDirEntry('Europe');
NUTSTree.fetched = true;
NUTSTree.filesystem = new NUTSFilesystem(NUTSTree);

export default NUTSTree;