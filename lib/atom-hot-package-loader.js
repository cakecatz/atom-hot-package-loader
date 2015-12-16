"use babel";

import { CompositeDisposable, Disposable } from 'atom';
import fs from 'fs';
import path from 'path';
import PackagesListView from './packages-list-view';
import reloadPackage from './reload-package';
import PackageWatcher from './package-wacher';
import StatusBarManager from './status-bar-manager';

function getConfig(name) {
  return atom.config.get(`atom-hot-package-loader.${name}`);
}

function findPackageAtPath(packPath) {
  packPath = fs.realpathSync(packPath);
  return atom.packages.getLoadedPackages().find(({path}) => {
    path = fs.realpathSync(path);
    return packPath.startsWith(path);
  });
}

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
      this.setTargetPackage(packageName);
    });
    this.statusBarManager = new StatusBarManager();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-hot-package-loader:reload': this.reload.bind(this),
      'atom-hot-package-loader:watch': this.watch.bind(this),
      'atom-hot-package-loader:unwatch': this.unwatch.bind(this),
      'atom-hot-package-loader:detect-package': this.detectPackage.bind(this),
      'atom-hot-package-loader:select-package': () => {
        this.packagesListView.toggle();
      },
    }));

    if (getConfig('detectTargetOnStart')) {
      this.detectPackage();
    }
  }

  consumeStatusBar(statusBar) {
    this.statusBarManager.initialize(statusBar);
    this.statusBarManager.attach();
  }

  setTargetPackage(packageName) {
    if (packageName === this.targetPackageName) return;

    this.targetPackageName = packageName;

    this.unwatch();
    this.statusBarManager.update('target', this.targetPackageName);

    if (getConfig('autoWatchTarget')) {
      this.watch();
    }
  }

  reload() {
    if (this.targetPackageName) {
      reloadPackage(this.targetPackageName);
    } else {
      this.showNotificationForSelectPackage();
    }
  }

  watch() {
    if (this.targetPackageName) {
      this.statusBarManager.update('watching', this.targetPackageName);
      this.packageWatcher.watch(this.targetPackageName);
    } else {
      this.showNotificationForSelectPackage();
    }
  }

  unwatch() {
    this.packageWatcher.unwatch();
    this.statusBarManager.update('target', this.targetPackageName);
  }

  detectPackage() {
    let pack = null;

    // Try deducing package based on active text editor path
    const editor = atom.workspace.getActiveTextEditor();
    if(editor && editor.getPath()) {
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

  deactivate() {
    this.unwatch();

    this.subscriptions.dispose();
    if (this.statusBarManager) {
      this.statusBarManager.detach();
    }
  }
}
