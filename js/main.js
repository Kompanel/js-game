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

function wait (ms) {
    let d = new Date();
    let d2 = null;
    do {
        d2 = new Date();
    }
    while (d2 - d < ms);
}