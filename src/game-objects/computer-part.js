export class ComputerPart extends Phaser.GameObjects.Image {
	constructor(scene, x, y, image, onClickCallback, itemData) {
		super(scene, x, y, image);
		
		this.setInteractive({ useHandCursor: true });
		Object.keys(itemData).forEach( (key) => {
			this[key] = itemData[key];
		});
		
		this.on('pointerdown', () => { onClickCallback(scene, this) });
	}
	
}