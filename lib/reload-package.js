"use babel";
import path from 'path';

function log(obj) {
  if ( atom.config.get('atom-hot-package-loader.outputLog') ) {
    console.log(obj);
  }
}

function unloadPackage(packageName) {
  return new Promise((resolve) => {
    let disposable = atom.packages.onDidUnloadPackage((pack) => {
      if (packageName === pack.name) {

        Object.keys(require.cache)
        .filter((p) => {
          return p.indexOf(pack.path + path.sep) === 0;
        })
        .forEach((p) => {
          delete require.cache[p];
        });
        delete atom.packages.loadedPackages[packageName];

        resolve(packageName);
        log('didunloadPackage');
        disposable.dispose();
      }
    });
    atom.packages.unloadPackage(packageName);
  });
}

function activatePackage(packageName) {
  return new Promise((resolve, reject) => {
    let disposable = atom.packages.onDidActivatePackage((pack) => {
      if (packageName === pack.name) {
        if (atom.packages.enablePackage(packageName)) {
          resolve();
        } else {
          log(`Can't loading ${packageName}`);
        }
        disposable.dispose();
      }
    });
    atom.packages.activatePackage(packageName);
  });
}

function deactivatePackage(packageName) {
  return new Promise((resolve) => {
    let disposable = atom.packages.onDidDeactivatePackage((pack) => {
      if (packageName === pack.name) {
        resolve();
        log('deactivatePackage');
        disposable.dispose();
      }
    });
    atom.packages.deactivatePackage(packageName);
  });
}

function reloadGrammars(pack) {
  const {grammars} = pack;
  atom.workspace.getTextEditors().forEach((editor) => {
    const {packageName, path: grammarPath} = editor.getGrammar();
    if (packageName !== pack.name) return;

    const grammarFilename = path.basename(grammarPath);
    const newGrammar = grammars.find((grammar) => path.basename(grammar.path) === grammarFilename);
    if (newGrammar) {
      editor.setGrammar(newGrammar);
    }
    else {
      editor.reloadGrammar();
    }
  });
}

export default async function reloadPackage(packageName, needReloadGrammars = false) {

	if (packageName === null) return;

  await deactivatePackage(packageName);

  if (!atom.packages.isPackageDisabled(packageName)) {
    atom.packages.disablePackage(packageName);
  }

  if (atom.packages.loadedPackages[packageName]) {
    await unloadPackage(packageName);
  }

	await activatePackage(packageName).then(() => {
    const pack = atom.packages.getActivePackage(packageName);

    if (needReloadGrammars) {
      reloadGrammars(pack);
    }

    log(`Reload ${packageName}.`);
  }).catch(() => {
    log(`Can't loading ${packageName}`);
  });
}
