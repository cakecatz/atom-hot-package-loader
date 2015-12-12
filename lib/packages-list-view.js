'use babel';

import { SelectListView, $$ } from 'atom-space-pen-views';
import { Emitter } from 'atom';

export default class PackagesListView extends SelectListView {
	initialize() {
		super.initialize();
		this.addClass('packages-list-view');
		this.panel = null;
		this.emitter = new Emitter();
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

 	confirmed({name}) {
 		if (name) {
 			this.emitter.emit('did-confirm', name);
 			this.close();
 		}
 	}

	show(packages) {
		if (this.panel === null) {
			this.panel = atom.workspace.addModalPanel({item: this});
		}

		this.panel.show();
		this.setItems(this.getPackages());
		setTimeout(() => {
			this.focusFilterEditor();
		}, 100);
	}

	close() {
    if (this.panel) {
    	this.panel.hide();
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