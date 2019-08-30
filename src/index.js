import 'phaser';
import { MainBuildScene } from './scenes/main-build-scene';

const gameConfig = {
   width: 680,
   height: 400,
   scene: MainBuildScene
};

new Phaser.Game(gameConfig);
