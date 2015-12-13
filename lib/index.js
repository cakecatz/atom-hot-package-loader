"use babel";
import AtomHotPackageLoader from './atom-hot-package-loader';

let atomHotPackageLoader = null;

export const config = {
  outputLog: {
    type: 'boolean',
    default: false,
    description: 'Output log',
  },
};

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
