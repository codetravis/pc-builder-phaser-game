import { ComputerPart } from '../game-objects/computer-part';

export class MainBuildScene extends Phaser.Scene {
   
   preload () {
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
	  this.load.json('menuItems', 'assets/computer-parts.json');
   }
   
   create () {
      this.computerObject = {
         monitor: null,
         computer: null,
         keyboard: null,
         mouse: null,
         graphicscard: null,
         soundcard: null,
         controller: null
      };
      this.computerCost = 0;
	  this.menuParts = [];
	  
	  let data = this.cache.json.get('menuItems');
	  this.fillMenuWithParts(data);
	  
      this.purchaseMenuButton = this.add.image(100, 100, 'button_basicblue');
      this.purchaseMenuButton.setInteractive();
      this.purchaseMenuButton.on('pointerdown', () => this.showPurchaseMenu());

      var textConfig = { fontSize: '20px', color: '#0000FF', fontFamily: 'Arial' };

      this.computerValue = this.add.text(20, 50, "Computer Value: 0", textConfig);

   }

   update () {
      this.computerValue.text = "Computer Value: " + this.computerCost;
   }
   
   fillMenuWithParts (data) {
	  
   }

   showPurchaseMenu () {

      this.desktop_oldwhite = new ComputerPart(this, 300, 200, 'desktop_oldwhite', this.onPartClicked, { cost: 100, partType: "computer" });
	  this.add.existing(this.desktop_oldwhite);

      this.monitor_crt = new ComputerPart(this, 100, 200, 'monitor_crt', this.onPartClicked, { cost: 50, partType: 'monitor' });
	  this.add.existing(this.monitor_crt);
   }

   onPartClicked(self, part) {

	   self.computerObject[part.partType] = part;
	   self.computerCost = self.calculateComputerCost(self.computerObject);
   }

   calculateComputerCost (computer) {
      var cost = 0;
      var keys = Object.keys(computer);
      keys.forEach( function(key) {
         var part = computer[key];
         if(part) {
            cost = cost + part.cost;
         }
      });

      return cost;
   }
}
