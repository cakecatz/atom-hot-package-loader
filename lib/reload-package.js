"use babel";

function log(obj) {
  if ( atom.config.get('atom-hot-package-loader.outputLog') ) {
    console.log(obj);
  }
}

function unloadPackage(packageName) {
  return new Promise((resolve) => {
    let disposable = atom.packages.onDidUnloadPackage((pack) => {
      if (packageName === pack.name) {

        Object.keys(require.cache).map((item) => {
          if (item.indexOf(pack.path) >= 0) {
            delete require.cache[item];
          }
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

function loadPackage(packageName) {
  return new Promise((resolve, reject) => {
    let disposable = atom.packages.onDidLoadPackage((pack) => {
      if (packageName === pack.name) {
        if (atom.packages.enablePackage(packageName)) {
          resolve();
        } else {
          log(`Can't loading ${packageName}`);
        }
        disposable.dispose();
      }
    });
    atom.packages.loadPackage(packageName);
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

export default async function reloadPackage(packageName) {

	if (packageName === null) return;

  await deactivatePackage(packageName);

  if (!atom.packages.isPackageDisabled(packageName)) {
    atom.packages.disablePackage(packageName);
  }

  if (atom.packages.loadedPackages[packageName]) {
    await unloadPackage(packageName);
  }

	await loadPackage(packageName).then(() => {
    log(`Reload ${packageName}.`);
  }).catch(() => {
    log(`Can't loading ${packageName}`);
  });
}
