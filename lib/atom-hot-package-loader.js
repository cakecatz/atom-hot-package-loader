"use babel";

import { CompositeDisposable } from 'atom';
import chokidar from 'chokidar';
import path from 'path';
import PackagesListView from './packages-list-view';
import reloadPackage from './reload-package';

export default class AtomHotPackageLoader {
  constructor() {
    this.subscriptions = null;
    this.watcher = null;
    this.packagesListView = null;
    this.targetPackageName = null;
  }

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-hot-package-loader:reload': () => {
        reloadPackage(this.targetPackageName)
      },
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-hot-package-loader:watch': this._watchPackage.bind(this),
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-hot-package-loader:select-package': this._selectPackage.bind(this),
    }));

    this.registerPackage('test-package');
  }

  registerPackage(packageName) {
    this.targetPackageName = packageName;
  }

  _selectPackage() {
    this.packagesListView = new PackagesListView();
    this.packagesListView.toggle();
  }

  _watchPackage() {
    // this.targetPackagePath = atom.packages.resolvePackagePath(this.targetPackageName);
    // this.watcher = chokidar.watch(this.targetPackagePath, {
    //   persistent: true,
    //   ignoreInitial: true,
    // });
    // this.watcher.on('change', (filename) => {
    //   delete require.cache[filename];
    //   this.reload();
    // });
  }

  deactivate() {
    this.subscriptions.dispose();
  }
}
