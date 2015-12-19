'use babel';

import fs from 'fs';

export function getConfig(name, packName = 'atom-hot-package-loader') {
  return atom.config.get(`${packName}.${name}`);
}

export function findPackageAtPath(packPath) {
  packPath = fs.realpathSync(packPath);
  return atom.packages.getLoadedPackages().find((pack) => {
    const testPath = fs.realpathSync(pack.path);
    return packPath.startsWith(testPath);
  });
}

export function log(...obj) {
  if ( getConfig('outputLog') ) {
    console.log(...obj);
  }
}
