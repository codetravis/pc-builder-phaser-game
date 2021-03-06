import { ComputerPart } from '../game-objects/computer-part';

export class MainBuildScene extends Phaser.Scene {
   
   constructor () {
      super({ key: 'MainBuildScene' });
   }

   init(props) {
      this.currentLevel = (props) ? props.level : 0;
   }

   preload () {
      this.currentLevel = 0;
      this.load.image('desktop_oldwhite', 'assets/desktop_oldwhite.png');
      this.load.image('desktop_newblack', 'assets/desktop_newblack.png');
      this.load.image('laptop_generic', 'assets/laptop_generic.png');
      this.load.image('laptop_fruit', 'assets/laptop_fruit.png');
      this.load.image('ram', 'assets/ram.png');
      this.load.image('soundcard', 'assets/soundcard.png');
      this.load.image('monitor_crt', 'assets/monitor_crt.png');
      this.load.image('monitor_lcdstandard', 'assets/monitor_lcdstandard.png');
      this.load.image('monitor_lcdwide', 'assets/monitor_lcdwide.png');
      this.load.image('keyboard_oldwhite', 'assets/keyboard_oldwhite.png');
      this.load.image('keyboard_newblack', 'assets/keyboard_newblack.png');
      this.load.image('mouse_oldwhite', 'assets/mouse_oldwhite.png');
      this.load.image('mouse_newblack', 'assets/mouse_newblack.png');
      this.load.image('graphicscard_standard', 'assets/graphicscard_standard.png');
      this.load.image('graphicscard_gaming', 'assets/graphicscard_gaming.png');

      this.load.image('button_basicblue', 'assets/buttonLong_blue.png');
      this.load.image('arrowBlue_right', 'assets/arrowBlue_right.png');
      this.load.image('arrowBlue_left', 'assets/arrowBlue_left.png');
      this.load.json('menuItems', 'assets/computer-parts.json');
      this.load.json('levelData', 'assets/level-' + this.currentLevel + '.json');
   }
   
   create () {
      this.levelData = this.cache.json.get('levelData');
      console.log(this.levelData);
      this.levelComplete = false;

      if(this.levelData.prebuilt) {
         this.computerObject = this.levelData.prebuilt;
      } else {
         this.computerObject = {
            monitor: null,
            computer: null,
            keyboard: null,
            mouse: null,
            graphicscard: null,
            soundcard: null,
            controller: null,
            internal: null
         };
      }

      this.computerBuild = [];
      this.computerStats = {
         processing: 0,
			graphics: 0,
			sound: 0,
			ergonomics: 0,
			memory: 0
      };

      this.computerCost = 0;
      this.menuParts = [];
      this.visibleMenu = [];
      this.menuStartIndex = 0;
      this.isMenuShowing = false;
	  
	   let menuData = this.cache.json.get('menuItems');
      this.fillMenuWithParts(menuData);
	  
      this.purchaseMenuButton = this.add.image(100, 100, 'button_basicblue');
      this.purchaseMenuButton.setInteractive();
      this.purchaseMenuButton.on('pointerdown', () => {
         if(this.isMenuShowing) {
            this.closeMenu(false);
         } else {
            this.showPurchaseMenu();
         }
      });


      var textConfig = { fontSize: '20px', color: '#FFFFFF', fontFamily: 'Arial' };
      this.add.text(20, 90, "Purchase Menu", textConfig);
      this.computerValue = this.add.text(20, 50, "Computer Value: 0", textConfig);
      this.computerStatDisplay = this.add.text(500, 20, "");
   }

   update () {
      this.computerValue.text = "Computer Value: $" + this.computerCost;

      let statString = "Level Complete: ";
      statString += (this.levelComplete) ? "True\n" : "False\n";
      Object.keys(this.computerStats).forEach( (stat) => {
         statString += stat + ": " + this.computerStats[stat] + "\n";
      });
      this.computerStatDisplay.text = statString;
      this.checkLevelRequirements();
   }
   
   fillMenuWithParts (data) {
	  Object.keys(data).forEach( (key) => {
		  this.menuParts.push(data[key]);
	  });
   }

   showPurchaseMenu () {
      this.hideComputerBuild();

      let spaceMultiplier = 0;
      for( let i = this.menuStartIndex; i < this.menuParts.length && spaceMultiplier < 3 ; i++) {
         let display_item = new ComputerPart(this, 100 + (spaceMultiplier * 200), 200, 
                                             this.menuParts[i].imageName, this.onPartClicked, 
                                             this.menuParts[i]);
         this.add.existing(display_item);
         this.visibleMenu.push(display_item);
         spaceMultiplier++;
      }

      this.menuButton_left = this.add.image(20, 200, 'arrowBlue_left');
      this.menuButton_left.setInteractive();
      this.menuButton_left.on('pointerdown', () => {
         this.menuStartIndex = Math.max(0, this.menuStartIndex - 3);
         this.refreshMenu();
      });
      this.menuButton_right = this.add.image(660, 200, 'arrowBlue_right');
      this.menuButton_right.setInteractive();
      this.menuButton_right.on('pointerdown', () => {
         this.menuStartIndex = Math.min(this.menuParts.length - 3, this.menuStartIndex + 3);
         this.refreshMenu();
      });
      this.isMenuShowing = true;
   }

   closeMenu (isRefresh) {
      this.visibleMenu.forEach( (image) => image.destroy() );
      this.menuButton_left.destroy();
      this.menuButton_right.destroy();
      this.isMenuShowing = false;

      if(!isRefresh) {
         this.drawComputerBuild();
      }
   }

   refreshMenu () {
      this.closeMenu(true);
      this.showPurchaseMenu();
   }

   onPartClicked(self, part) {
      if(self.computerObject[part.partType] && self.computerObject[part.partType].imageName === part.imageName) {
         self.computerObject[part.partType] = null;
      } else {
         self.computerObject[part.partType] = part;
      }
      self.computerCost = self.calculateComputerCost(self.computerObject);
      self.computerStats = self.calculateComputerStats(self.computerObject);
   }

   calculateComputerCost (computer) {
      let cost = 0;
      let parts = Object.keys(computer);
      parts.forEach( function(partName) {
         let part = computer[partName];
         if(part) {
            cost = cost + part.cost;
         }
      });

      return cost;
   }

   calculateComputerStats (computer) {
      let stats = {};
      let parts = Object.keys(computer);

      parts.forEach( function(partName) {
         let part = computer[partName];
         if(part) {
            let partStats = Object.keys(part["stats"]);
            partStats.forEach( function(stat) {
               if(stats[stat]) {
                  stats[stat] += part.stats[stat];
               } else {
                  stats[stat] = part.stats[stat];
               }
            });
         }
      });
      
      return stats;
   }

   hideComputerBuild() {
      this.computerBuild.forEach( (item) => item.destroy() );
   }

   drawComputerBuild () {
      this.hideComputerBuild();

      if(this.computerObject.monitor) {
         this.computerBuild.push(this.add.image(390, 220, this.computerObject.monitor.imageName));
      }
      if(this.computerObject.computer) {
         this.computerBuild.push(this.add.image(220, 350, this.computerObject.computer.imageName));
      }
      if(this.computerObject.mouse) {
         this.computerBuild.push(this.add.image(460, 350, this.computerObject.mouse.imageName));
      }
      if(this.computerObject.keyboard) {
         this.computerBuild.push(this.add.image(360, 340, this.computerObject.keyboard.imageName));
      }
      if(this.computerObject.soundcard) {
         this.computerBuild.push(this.add.image(100, 200, this.computerObject.soundcard.imageName));
      }
      if(this.computerObject.graphicscard) {
         this.computerBuild.push(this.add.image(100, 320, this.computerObject.graphicscard.imageName));
      }
      if(this.computerObject.internal) {
         this.computerBuild.push(this.add.image(100, 400, this.computerObject.internal.imageName));
      }
   }

   checkLevelRequirements () {
      this.levelComplete = true;

      let stats = Object.keys(this.computerStats);
      stats.forEach( (stat) => {
         if(this.computerStats[stat] < this.levelData.targetStats[stat]) {
            this.levelComplete = false;
         }
      });

      if(this.computerCost > this.levelData.targetCost) {
         this.levelComplete = false;
      }

      let parts = Object.keys(this.computerObject);
      parts.forEach( (part) => {
         if(!this.computerObject[part] && this.levelData.requiredParts[part]) {
            this.levelComplete = false;
         }
      });

   }


}
