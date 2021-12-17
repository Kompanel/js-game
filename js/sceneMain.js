class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
        this.level = 1
        this.pause = false
    }

    preload() {
        this.load.image('pagman', 'images/pagman.png')
        this.load.image('wall', 'images/wall.png')
        this.load.image('coin', 'images/coin.png')
        this.load.image('hole', 'images/hole.png')
        this.load.image('home', 'images/home.png')
        this.load.image('thief', 'images/widehardo.png')
    }

    create() {

        this.player = this.physics.add.sprite(150, 150, 'pagman')
        this.player.body.collideWorldBounds = true

        this.point = this.physics.add.sprite(200, 200, 'coin')
        this.point.body.immovable = true

        this.home = this.physics.add.sprite(50, 70, 'home')
        this.home.body.collideWorldBounds = true
        this.home.body.immovable = true

        this.thief = this.physics.add.sprite(Math.round(Math.random() * (width - 300) + 300),
            Math.round(Math.random() * (height - 300) + 300), 'thief')
        this.thief.body.collideWorldBounds = true


        this.wall = this.physics.add.staticGroup()
        for (let x = 0; x < this.level * 5; x++) {
            let brick = this.wall.create(Math.round(Math.random() * (width - 100) + 100),
                Math.round(Math.random() * (height - 100) + 100), 'wall')

            brick.body.collideWorldBounds = true;
            brick.body.immovable = true
        }

        this.holes = this.physics.add.staticGroup()
        for (let x = 0; x < this.level * 2; x++) {
            let hole = this.holes.create(Math.round(Math.random() * (width - 100) + 100),
                Math.round(Math.random() * (height - 100) + 100), 'hole')

            hole.body.collideWorldBounds = true;
            hole.body.immovable = true
        }

        this.coinsInBag = 0
        this.coinsInHome = 0

        this.cursors = this.input.keyboard.createCursorKeys()

        this.coinsInBagText = this.add.text(width - 150, 5, "Coins in bag: " + this.coinsInBag, {
            font: "20px Arial",
            fill: "#000000"
        })
        this.coinsInHomeText = this.add.text(5, 5, "Coins in home: " + this.coinsInHome, {
            font: "20px Arial",
            fill: "#000000"
        })
        this.add.text(width / 2 - 50, 5, "Level: " + this.level, {
            font: "30px Arial",
            fill: "#000000"
        })
        this.infoText = this.add.text(width / 2 - 120, height / 2 - 100, "", {
            font: "50px Arial",
            fill: "#000000"
        })
    }

    update() {

        this.player.body.velocity.x = 0
        this.player.body.velocity.y = 0

        this.thief.body.velocity.x = 0
        this.thief.body.velocity.y = 0

        if (!this.pause) {
            if (this.thief.x > this.player.x) {

                this.thief.body.velocity.x = -100
    
            } else if (this.thief.x < this.player.x) {
    
                this.thief.body.velocity.x = 100
            }
    
            if (this.thief.y > this.player.y) {
    
                this.thief.body.velocity.y = -100
            } else if (this.thief.y < this.player.y) {
    
                this.thief.body.velocity.y = 100
            }
    
    
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
        }

        

        this.physics.collide(this.player, this.point, () => {

            this.coinsInBag += 1
            this.coinsInBagText.text = "Coins in bag: " + this.coinsInBag

            this.point.x = Math.round(Math.random() * (width - 100) + 100)
            this.point.y = Math.round(Math.random() * (height - 100) + 100)
        })

        this.physics.collide(this.player, this.wall)

        this.physics.collide(this.player, this.home, () => {

            this.coinsInHome += this.coinsInBag
            this.coinsInBag = 0
            this.coinsInBagText.text = "Coins in bag: " + this.coinsInBag
            this.coinsInHomeText.text = "Coins in home: " + this.coinsInHome

            if (this.coinsInHome >= this.level * 10) {

                this.pause = true

                this.infoText.text = "   Level passed\nCoins collected: " + this.coinsInHome + "\n  Loading level: " + (this.level + 1)
                this.coinsInBagText.text = ""
                this.coinsInHomeText.text = ""

                this.time.addEvent({delay: 2000, callback: () => {
                    this.level += 1
                    this.pause = false
                    this.scene.restart()
                }})
            }
        })

        this.physics.collide(this.player, this.thief, () => {

            console.log("KOLIZJA Z WIDEHARDO POLICE")

            this.coinsInBag = 0
            this.coinsInBagText.text = "Coins in bag: " + this.coinsInBag

            this.infoText.text = "     COLLISION\nYou lost your coins"

            this.time.addEvent({delay: 2000, callback: () => {

                this.infoText.text = ""
            }})
        })

        this.physics.collide(this.player, this.holes, () => {

            this.pause = true

            this.infoText.text = "  GAME OVER \n  Your score: " + this.coinsInHome + "\nReloading game"
            this.coinsInBagText.text = ""
            this.coinsInHomeText.text = ""

            this.time.addEvent({delay: 5000, callback: () => {

                this.level = 1
                this.pause = false
                this.scene.restart()
            }})
        })

        this.physics.collide(this.thief, this.wall)
        this.physics.collide(this.thief, this.holes)
    }
}
