'use babel';

import reloadPackage from './reload-package';
import chokidar from 'chokidar';
import path from 'path';
import { log, getConfig, getRepositoryForDirectory } from './utils';

export default class PackageWacher {
  constructor() {
    this.watcher = null;
  }

  async watch(packageName) {
    if (this.watcher) {
      this.unwatch();
    }

    const packagePath = atom.packages.resolvePackagePath(packageName);
    const ignoredMatchers = await this.makeIgnoredMatchers(packagePath);
    this.watcher = chokidar
      .watch(packagePath, {
        persistent: true,
        ignoreInitial: true,
        ignored: ignoredMatchers,
        awaitWriteFinish: {
          stabilityThreshold: getConfig('watchedTargetReloadDelay'),
        },
      })
      .on('change', (filename) => {
        const dir = path.dirname(filename);
        const reloadGrammars = dir === path.join(packagePath, 'grammars');
        reloadPackage(packageName, reloadGrammars);
      })
      .on('error', (error) => {
        log(`Error watching package \'${packageName}\': `, error);
      });

    atom.notifications.addInfo(`Start watching \`${packageName}\`.`);
  }

  unwatch() {
    if (this.watcher) {
      this.watcher.close();
      atom.notifications.addInfo('Stop watching.');
      this.watcher = null;
    }
  }

  async makeIgnoredMatchers(packPath) {
    const packageRepo = await getRepositoryForDirectory(packPath);
    const resourceExtNames = [...Object.keys(require.extensions), '.json', '.cson', '.css', '.less'];
    function isPathIgnored(testPath, stat) {
      if (packageRepo && packageRepo.isPathIgnored(testPath)) return true;

      if (stat && stat.isFile()) {
        const extName = path.extname(testPath);
        return resourceExtNames.indexOf(extName) < 0;
      }

      return false;
    }

    return [...getConfig('ignoredNames', 'core'), isPathIgnored.bind(this)];
  }
}
