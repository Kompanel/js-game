let game

const width = 1024
const height = 540

window.onload = function () {

    const config = {
        type: Phaser.AUTO,
        width: width,
        height: height,
        parent: 'phaser-game',
        backgroundColor: "#90ee90",
        physics: {
            default: 'arcade',
        },
        scene: [SceneMain]
    };

    game = new Phaser.Game(config)
}