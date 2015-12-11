"use babel";
export default function reloadPackage(packageName, didUnload = false) {
	if (packageName === null) return;

	if (atom.packages.isPackageActive(packageName)) {
    atom.packages.deactivatePackage(packageName)
    atom.packages.disablePackage(packageName);
  }
  
  if (atom.packages.loadedPackages[packageName] && !didUnload) {
    let didUnloadDisposable = atom.packages.onDidUnloadPackage((pack) => {
      if (packageName === pack.name) {

        delete require.cache[pack.mainModulePath];
        delete atom.packages.loadedPackages[packageName];

        reloadPackage(packageName, true);
	      didUnloadDisposable.dispose();
      }
    });
    atom.packages.unloadPackage(packageName);
  } else {
  	let didLoadDisposable = atom.packages.onDidLoadPackage((pack) => {
	    if (packageName === pack.name) {
	      if (atom.packages.enablePackage(packageName)) {
	        console.log(`Reload ${packageName}`);
	      } else {
	        console.log(`Can't loading ${packageName}`);
	      }
		    didLoadDisposable.dispose();
	    }
	  });
  	atom.packages.loadPackage(packageName);
  }
}