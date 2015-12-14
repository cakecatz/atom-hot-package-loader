"use babel";

import reloadPackage from './reload-package';
import chokidar from 'chokidar';
import path from 'path';

export default class PackageWacher {
	constructor() {
		this.watcher = null;
	}

	watch(packageName) {
		if (this.watcher) {
			this.unwatch();
		}

		const packagePath = atom.packages.resolvePackagePath(packageName);

    this.watcher = chokidar.watch(packagePath, {
      persistent: true,
      ignoreInitial: true,
    });
    this.watcher.on('change', (filename) => {
      const dir = path.dirname(filename);
      const reloadGrammars = dir === path.join(packagePath, 'grammars');
      reloadPackage(packageName, reloadGrammars);
    });

    atom.notifications.addInfo(`Start watching \`${packageName}\`.`);
	}

	unwatch() {
		if (this.watcher) {
			this.watcher.close();
			atom.notifications.addInfo('Stop watching.');
		}
	}
}
