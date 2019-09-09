export class StartGameScene extends Phaser.Scene {

    constructor () {
        super({ key: 'StartGameScene', active: true });
    }

    preload () {
        this.load.image('button_basicblue', 'assets/buttonLong_blue.png');
    }
    
    create () {
      this.startGameButton = this.add.image(350, 250, 'button_basicblue');
      this.startGameText = this.add.text(285, 240, "Start Game");
      this.startGameButton.setInteractive();
      this.startGameButton.on('pointerdown', () => {
         this.scene.start('MainBuildScene', { level: 0 });
      });
    }

    update () {

    }



}