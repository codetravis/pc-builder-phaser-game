import Phaser from 'phaser';
import MainBuildScene from 'scenes/main_build_scene';

const config = {
   type: Phaser.AUTO,
   parent: "",
   width: 800,
   height: 600,
   scene: MainBuildScene
};

const game = new Phaser.Game(config);
