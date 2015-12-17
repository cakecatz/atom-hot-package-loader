# Atom Hot Package Loader

Reload package without `window:reload`.

[![https://gyazo.com/67a86e32e418f99852d3b11b3af1f21b](https://i.gyazo.com/67a86e32e418f99852d3b11b3af1f21b.gif)](https://gyazo.com/67a86e32e418f99852d3b11b3af1f21b)


UI Theme: [nucleus-dark-ui](https://atom.io/themes/nucleus-dark-ui)  
Syntax Theme: [base16-tomorrow-dark](https://github.com/atom/base16-tomorrow-dark-theme) (installed by default)

## Commands

Command                                  | Description
-----------------------------------------|---------------------------------------
`atom-hot-package-loader:select-package` | Select target package
`atom-hot-package-loader:detect-package` | Try guessing target package
`atom-hot-package-loader:reload`         | Reload targeted package
`atom-hot-package-loader:watch`          | Start targeted package's file watching
`atom-hot-package-loader:unwatch`        | Stop watching

## Settings

Setting              | Description
---------------------|-----------------------------------------------------------------------
`autoWatchTarget`    | Start watching the targeted package right after it has been selected
`detectTargetOnStar` | Try guessing target package automatically when activating this package
`outputLog`          | Print debug info to console

## Usage

Select target package by using `atom-hot-package-loader:select-package`. Alternatively you can use `atom-hot-package-loader:detect-package` command which will try to guess target package based on paths of active text editor and project's root directories.

[![https://gyazo.com/900544de8bbf23d4a269288772ffb292](https://i.gyazo.com/900544de8bbf23d4a269288772ffb292.png)](https://gyazo.com/900544de8bbf23d4a269288772ffb292)

After that, use command `reload` or `watch` for hot reloading.

If you want to stop `watch`, you can use command `unwatch`.

## LICENSE
MIT
