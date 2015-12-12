"use babel";

import { CompositeDisposable, Disposable } from 'atom';
import path from 'path';
import PackagesListView from './packages-list-view';
import reloadPackage from './reload-package';
import PackageWatcher from './package-wacher';
import StatusBarManager from './status-bar-manager';

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
      this.statusBarManager.update('target', this.targetPackageName);
    });
    this.statusBarManager = new StatusBarManager();

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
          this.statusBarManager.update('wathing', this.targetPackageName);
          this.packageWatcher.watch(this.targetPackageName);
        } else {
          this.showNotificationForSelectPackage();
        }
      },
      'atom-hot-package-loader:unwatch': () => {
        this.packageWatcher.unwatch();
        this.statusBarManager.update('target', this.targetPackageName);
      },
      'atom-hot-package-loader:select-package': () => {
        this.packagesListView.toggle();
      },
    }));
  }

  consumeStatusBar(statusBar) {
    this.statusBarManager.initialize(statusBar);
    this.statusBarManager.attach();
  }

  showNotificationForSelectPackage() {
    atom.notifications.addWarning('Please select package by using `atom-hot-package-loader:select-package`');
  }

  deactivate() {
    this.subscriptions.dispose();
    if (this.statusBarManager) {
      this.statusBarManager.detach();
    }
  }
}
