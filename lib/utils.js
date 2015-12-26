'use babel';

import { Directory } from 'atom';
import fs from 'fs';

export function getConfig(name, packName = 'atom-hot-package-loader') {
  return atom.config.get(`${packName}.${name}`);
}

export function getRepositoryForDirectory(dirPath) {
  const dir = new Directory(dirPath);
  return atom.project.repositoryForDirectory(dir);
}

export function findPackageAtPath(testPath) {
  try {
    testPath = fs.realpathSync(testPath);
    return atom.packages.getLoadedPackages().find((pack) => {
      const packPath = fs.realpathSync(pack.path);
      return testPath.startsWith(packPath);
    });
  } catch (error) {
    // Ignore unreachable paths
  }
}

export function log(...obj) {
  if ( getConfig('outputLog') ) {
    console.log(...obj);
  }
}
