'use babel';

import { CompositeDisposable } from 'atom';
import { getConfig, findPackageAtPath } from './utils';

export default class AtomHotPackageLoader {
  constructor() {
    this.subscriptions = null;
    this.targetPackageName = null;
    this.reloadPackage = null;
    this.packageWatcher = null;
    this.status = null;
  }

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-hot-package-loader:reload': this.reload.bind(this),
      'atom-hot-package-loader:watch': this.watch.bind(this),
      'atom-hot-package-loader:unwatch': this.unwatch.bind(this),
      'atom-hot-package-loader:detect-package': this.detectPackage.bind(this),
      'atom-hot-package-loader:select-package': () => {
        if (!this._packagesListView) {
          this.getPackagesListView().emitter.on('did-confirm', (packageName) => {
            this.setTargetPackage(packageName);
          });
        }

        this.getPackagesListView().toggle();
      },
    }));

    if (getConfig('detectTargetOnStart')) {
      this.detectPackage();
    }
  }

  consumeStatusBar(statusBar) {
    this.getStatusBarManager().initialize(statusBar);
    this.getStatusBarManager().attach();
  }

  setTargetPackage(packageName) {
    if (packageName === this.targetPackageName) return;

    this.targetPackageName = packageName;

    this.unwatch();
    this.status = 'ready';
    this.updateStatusBar();

    if (getConfig('autoWatchTarget')) {
      this.watch();
    }
  }

  reload() {
    if (!this.reloadPackage) {
      this.reloadPackage = require('./reload-package');
    }

    if (this.targetPackageName) {
      this.reloadPackage(this.targetPackageName);
    } else {
      this.showNotificationForSelectPackage();
    }
  }

  watch() {
    if (this.targetPackageName) {
      this.status = 'watching';
      this.updateStatusBar();
      this.getPackageWatcher().watch(this.targetPackageName);
    } else {
      this.showNotificationForSelectPackage();
    }
  }

  unwatch() {
    if (this.packageWatcher) {
      this.getPackageWatcher().unwatch();
      this.status = 'ready';
      this.updateStatusBar();
    }
  }

  updateStatusBar() {
    this.getStatusBarManager().update(this.status, this.targetPackageName);
  }

  detectPackage() {
    let pack = null;

    // Try deducing package based on active text editor path
    const editor = atom.workspace.getActiveTextEditor();
    if (editor && editor.getPath()) {
      const editorPath = editor.getPath();
      pack = findPackageAtPath(editorPath);
    }

    if (!pack) {
      // Try deducing package for any of project root folders
      atom.project.getPaths().find((path) => pack = findPackageAtPath(path));
    }

    if (pack) {
      this.setTargetPackage(pack.name);
    }
  }

  showNotificationForSelectPackage() {
    atom.notifications.addWarning('Please select package by using `atom-hot-package-loader:select-package`');
  }

  getPackageWatcher() {
    if (!this.packageWatcher) {
      const PackageWatcher = require('./package-watcher');
      this.packageWatcher = new PackageWatcher();
    }
    return this.packageWatcher;
  }

  getPackagesListView() {
    if (!this.packagesListView) {
      const PackagesListView = require('./packages-list-view');
      this.packagesListView = new PackagesListView();
    }
    return this.packagesListView;
  }

  getStatusBarManager() {
    if (!this.statusBarManager) {
      const StatusBarManager = require('./status-bar-manager');
      this.statusBarManager = new StatusBarManager();
    }
    return this.statusBarManager;
  }

  deactivate() {
    this.unwatch();

    this.subscriptions.dispose();
    if (this.getStatusBarManager()) {
      this.getStatusBarManager().detach();
    }
  }
}
