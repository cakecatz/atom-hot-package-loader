'use babel';

import { SelectListView, $$ } from 'atom-space-pen-views';

export default class PackagesListView extends SelectListView {
	initialize() {
		super.initialize();
		this.addClass('atom-hot-package-loader');
		this.panel = null;
	}

  getFilterKey() {
  	return 'name';
  }

	getPackages() {
		return atom.packages.getActivePackages();
	}

	activate() {
		// return new PackagesListView();
	}

	toggle() {
		if (this.panel && this.panel.isVisible()) {
			this.close();
		} else {
			this.show();
		}
 	}

 	confirmed(props) {
 		if (props) {
 			console.log(props);
 			this.close();
 		}
 	}

	show(packages) {
		if (this.panel === null) {
			this.panel = atom.workspace.addModalPanel({item: this});
		}

		this.panel.show();

		this.setItems(this.getPackages());
		// this.focusFilterEditor();
	}

	close() {
    if (this.panel) {
      this.panel.emitter.emit('did-destroy');
    }
  }

	cancelled() {
		this.close();
	}

	viewForItem({name, path, metadata}) {
		let icon = 'package';
		return $$(function() {
			this.li({class: 'two-lines'}, () => {
				this.div({class: 'primary-line'}, () => {
					if (metadata.theme) {
						icon = 'paintcan';
					}
					this.div({class: `icon icon-${icon}`}, () => {
						this.span(name);
					});
				});

				this.div({class: 'secondary-line'}, () => {
					this.div({class: 'no-icon'}, path);
				});
			});
		});
	}
}