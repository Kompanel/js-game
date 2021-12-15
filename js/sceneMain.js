class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }

    preload() {
        this.load.image('pagman', 'images/pagman.png')
        this.load.image('wall', 'images/wall.png')
        this.load.image('coin', 'images/coin.png')
        this.load.image('home', 'images/home.png')
    }

    create() {

        this.player = this.physics.add.sprite(100, 100, 'pagman')
        this.player.body.collideWorldBounds = true

        this.point = this.physics.add.sprite(200, 200, 'coin')
        this.point.body.immovable = true

        this.home = this.physics.add.sprite(50, 70, 'home')
        this.home.body.collideWorldBounds = true
        this.home.body.immovable = true

        this.wall = this.physics.add.staticGroup()
        for (let x = 0; x < 15; x++) {
            let brick = this.wall.create(Math.round(Math.random() * width),
                Math.round(Math.random() * height), 'wall')

            brick.body.collideWorldBounds = true;
            brick.body.immovable = true
        }

        this.coinsInBag = 0
        this.coinsInHome = 0

        this.cursors = this.input.keyboard.createCursorKeys()

        this.coinsInBagText = this.add.text(width / 2, 0, "Coins in bag: " + this.coinsInBag, {font: "30px Arial", fill: "#000000"})
        this.coinsInHomeText = this.add.text(0, 0, "Coins in home: " + this.coinsInHome, {font: "20px Arial", fill: "#000000"})
    }

    update() {

        this.player.body.velocity.x = 0
        this.player.body.velocity.y = 0

        if (this.cursors.left.isDown) {

            this.player.body.velocity.x = -260 + this.coinsInBag * 20
            this.player.angle = 180;
        }
        if (this.cursors.right.isDown) {

            this.player.body.velocity.x = 260 - this.coinsInBag * 20
            this.player.angle = 0;
        }
        if (this.cursors.up.isDown) {

            this.player.body.velocity.y = -260 + this.coinsInBag * 20
            this.player.angle = 270;
        }
        if (this.cursors.down.isDown) {

            this.player.body.velocity.y = 260 - this.coinsInBag * 20
            this.player.angle = 90;
        }

        this.physics.collide(this.player, this.point, () => {
            this.coinsInBag += 1
            this.coinsInBagText.text = "Coins in bag: " + this.coinsInBag

            this.point.x = Math.round(Math.random() * width)
            this.point.y = Math.round(Math.random() * height)
        })

        this.physics.collide(this.player, this.wall)

        this.physics.collide(this.player, this.home, () => {
            this.coinsInHome += this.coinsInBag
            this.coinsInBag = 0

            this.coinsInBagText.text = "Coins in bag: " + this.coinsInBag
            this.coinsInHomeText.text = "Coins in home: " + this.coinsInHome
        })
    }
}