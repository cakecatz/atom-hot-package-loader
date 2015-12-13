"use babel";

export default class StatusBarManager {
	constructor() {
		this.element = document.createElement('div');
		this.element.id = 'hot-package-loader-status';

		this.container = document.createElement('div');
		this.container.className = 'inline-block';
		this.container.appendChild(this.element);
	}

	initialize(statusBar) {
		this.statusBar = statusBar;
	}

	update(status, target) {
		this.element.textContent = `[${status}] ${target}`;
	}

	hide() {
		this.element.className = 'hidden';
	}

	attach() {
		this.tile = this.statusBar.addLeftTile({
			item: this.container,
			priority: 20,
		});
	}

	detach() {
		this.tile.destroy();
	}
}
