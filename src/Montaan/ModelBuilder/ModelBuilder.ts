import * as Comlink from 'comlink';
import { ModelBuilderResult } from './ModelBuilder.worker';
import { FileTree } from '../MainApp';
import { NavCamera } from '../MainView/main';
import { FSEntry } from '../Filesystems';
import * as THREE from 'three';

/* eslint-disable import/no-webpack-loader-syntax */
import ModelBuilderWorker from 'worker-loader!./ModelBuilder.worker';

import ModelBuilderWorkerLocal from './ModelBuilder.worker';

export default class ModelBuilder {
	workers: any[] = [];
	workerIndex: number = 0;
	fontInitialized: boolean = false;
    builder: ModelBuilderWorkerLocal;

	constructor(workerCount: number = 1) {
		for (let i = 0; i < workerCount; i++) {
			this.workers.push(Comlink.wrap(new ModelBuilderWorker()));
		}
        this.builder = new ModelBuilderWorkerLocal();
	}

	getWorker() {
		const worker = this.workers[this.workerIndex++];
		if (this.workerIndex >= this.workers.length) {
			this.workerIndex = 0;
		}
		return worker;
	}

	async buildModel(
		tree: FileTree,
		camera: NavCamera,
		mesh: THREE.Mesh,
		forceLoads: Set<FSEntry>
	): Promise<ModelBuilderResult> {
        // Pass camera matrices
        // Maintain tree as ArrayBuffer
        // Pass mesh matrices
        // forceLoads as indices to tree
		const result = this.builder.buildModel(tree, camera, mesh, forceLoads);
		return result;
	}
}
