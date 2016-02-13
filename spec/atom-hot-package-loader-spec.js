'use babel';

import AtomHotPackageLoader from '../lib/atom-hot-package-loader';

describe('AtomHotPackageLoader', () => {
  let [atomHotPackageLoader] = [];

  beforeEach(() => {
    atomHotPackageLoader = new AtomHotPackageLoader();
  });

  afterEach(() => {
    atomHotPackageLoader = null;
  });

  describe('reload', () => {
    beforeEach(() => {
      atomHotPackageLoader.reloadPackage = jasmine.createSpy('reloadPackage');
    });

    it('reload package if target package is selected.', () => {
      atomHotPackageLoader.targetPackageName = 'target';
      atomHotPackageLoader.reload();

      expect(atomHotPackageLoader.reloadPackage).toHaveBeenCalledWith('target');
    });

    it('show notification if target is not selected.', () => {
      spyOn(atom.notifications, 'addWarning');
      atomHotPackageLoader.reload();

      expect(atomHotPackageLoader.reloadPackage).not.toHaveBeenCalled();
      expect(atom.notifications.addWarning).toHaveBeenCalled();
    });
  });

  describe('watch', () => {
    beforeEach(() => {
      atomHotPackageLoader.packageWatcher = {
        watch: jasmine.createSpy('watch'),
      };
    });
    it('start watch if target package is selected.', () => {
      atomHotPackageLoader.targetPackageName = 'target';
      atomHotPackageLoader.watch();

      expect(atomHotPackageLoader.packageWatcher.watch).toHaveBeenCalled();
    });

    it('update status bar when start wathing.', () => {
      atomHotPackageLoader.statusBarManager = {
        update: jasmine.createSpy('update'),
      };
      atomHotPackageLoader.targetPackageName = 'target';
      atomHotPackageLoader.watch();

      expect(atomHotPackageLoader.statusBarManager.update).toHaveBeenCalledWith('watching', 'target');
    });

    it('show notification if target is not selected.', () => {
      spyOn(atom.notifications, 'addWarning');
      atomHotPackageLoader.watch();

      expect(atomHotPackageLoader.packageWatcher.watch).not.toHaveBeenCalled();
      expect(atom.notifications.addWarning).toHaveBeenCalled();
    });
  });

  describe('updateStatusBar', () => {
    it('update status bar with targetPackageName and status.', () => {
      const updateSpy = jasmine.createSpy('update');
      spyOn(atomHotPackageLoader, 'getStatusBarManager').andReturn({
        update: updateSpy,
      });
      atomHotPackageLoader.status = 'a';
      atomHotPackageLoader.targetPackageName = 'b';
      atomHotPackageLoader.updateStatusBar();

      expect(updateSpy).toHaveBeenCalledWith('a', 'b');
    });
  });
});
