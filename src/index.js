import 'phaser';
import { StartGameScene } from './scenes/start-game-scene';
import { MainBuildScene } from './scenes/main-build-scene';


const gameConfig = {
   width: 680,
   height: 500,
   scene: [StartGameScene, MainBuildScene]
};

let game = new Phaser.Game(gameConfig);