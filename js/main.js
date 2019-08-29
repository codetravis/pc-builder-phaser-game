let mainScene = new Phaser.Scene('Game');

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: mainScene
};

var game = new Phaser.Game(config);
var computerObject = {
	monitor: null,
	computer: null,
	keyboard: null,
	mouse: null,
	graphicscard: null,
	soundcard: null,
	controller: null
};
var computerCost = 0;

mainScene.preload = function () {
	this.load.image('desktop_oldwhite', 'assets/desktop_oldwhite.png');
	this.load.image('desktop_newblack', 'assets/desktop_newblack.png');
	this.load.image('laptop_generic', 'assets/laptop_generic.png');
	this.load.image('laptop_fruit', 'assets/laptop_fruit.png');
	this.load.image('ram', 'assets/ram.png');
	this.load.image('soundcard', 'assets/soundcard.png');
	this.load.image('monitor_crt', 'assets/monitor_crt.png');
	this.load.image('keyboard_oldwhite', 'assets/keyboard_oldwhite.png');
	this.load.image('mouse_oldwhite', 'assets/mouse_oldwhite.png');
	this.load.image('button_basicblue', 'assets/buttonLong_blue.png');
}

mainScene.create = function () {
	
	this.purchaseMenuButton = this.add.image(100, 100, 'button_basicblue');
	this.purchaseMenuButton.interfaceType = 'menuButton';
	var phaserScene = this;
	this.purchaseMenuButton.setInteractive();
	
	
	var textConfig = { fontSize: '20px', color: '#0000FF', fontFamily: 'Arial' };
	
	this.computerValue = this.add.text(20, 50, "Computer Value: 0", textConfig);
	
	this.input.on('gameobjectdown', onPartClicked);
}

mainScene.update = function () {
	this.computerValue.text = "Computer Value: " + computerCost;
}

function onPartClicked(pointer, part) {

	computerObject[part.partType] = part;
	computerCost = calculateComputerCost();
}

function calculateComputerCost () {
	var cost = 0;
	var keys = Object.keys(computerObject);
	keys.forEach( function(key) {
		var part = computerObject[key];
		if(part) {
			cost = cost + part.cost;
		}
	});
	
	return cost;
}

function createPurchaseMenu (ctx) {

	ctx.desktop_oldwhite = ctx.add.image(300, 200, 'desktop_oldwhite');
	ctx.desktop_oldwhite.setInteractive();
	ctx.desktop_oldwhite.cost = 100;
	ctx.desktop_oldwhite.partType = "computer";
	
	ctx.monitor_crt = ctx.add.image(100, 200, 'monitor_crt');
	ctx.monitor_crt.setInteractive();
	ctx.monitor_crt.cost = 50;
	ctx.monitor_crt.partType = "monitor";
}