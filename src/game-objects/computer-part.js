export class ComputerPart extends Phaser.GameObjects.Image {
	constructor (scene, x, y, imageName, onClickCallback, itemData) {
		super(scene, x, y, imageName);

		this.setInteractive({ useHandCursor: true });
		this.on('pointerdown', () => { onClickCallback(scene, this) });

		Object.keys(itemData).forEach( (key) => {
			this[key] = itemData[key];
		});

		this.costText = scene.add.text(x, y + 75, "$" + this["cost"]);
	}

	destroy () {
		this.costText.destroy();
		super.destroy();
	}
	
}