"use babel";
import AtomHotPackageLoader from './atom-hot-package-loader';

let atomHotPackageLoader = null;

export function activate(state) {
  atomHotPackageLoader = new AtomHotPackageLoader();
  atomHotPackageLoader.activate(state);
}

export function deactivate() {
  atomHotPackageLoader.deactivate();
}

export function consumeStatusBar(statusBar) {
	atomHotPackageLoader.consumeStatusBar(statusBar);
}
