"use babel";

import { CompositeDisposable } from 'atom';
import path from 'path';
import PackagesListView from './packages-list-view';
import reloadPackage from './reload-package';
import PackageWatcher from './package-wacher';

export default class AtomHotPackageLoader {
  constructor() {
    this.subscriptions = null;
    this.watcher = null;
    this.packagesListView = null;
    this.targetPackageName = null;
  }

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.packageWatcher = new PackageWatcher();
    this.packagesListView = new PackagesListView();
    this.packagesListView.emitter.on('did-confirm', (packageName) => {
      this.targetPackageName = packageName;
    });

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-hot-package-loader:reload': () => {
        if (this.targetPackageName) {
          reloadPackage(this.targetPackageName)
        } else {
          this.showNotificationForSelectPackage();
        }
      },
      'atom-hot-package-loader:watch': () => {
        if (this.targetPackageName) {
          this.packageWatcher.watch(this.targetPackageName);
        } else {
          this.showNotificationForSelectPackage();
        }
      },
      'atom-hot-package-loader:unwatch': this.packageWatcher.unwatch,
      'atom-hot-package-loader:select-package': () => {
        this.packagesListView.toggle();
      },
    }));
  }

  showNotificationForSelectPackage() {
    atom.notifications.addWarning('Please select package by using `atom-hot-package-loader:select-package`');
  }

  deactivate() {
    this.subscriptions.dispose();
  }
}
