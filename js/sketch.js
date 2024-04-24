/*
   Copyright 2023 barqawiz

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
<script>
    function startGame() {
        let selectedDifficulty = document.getElementById('difficulty').value;
        game.setDifficulty(selectedDifficulty);
        loop(); // Start the p5.js draw loop
    }
</script>
       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
let game;

function preload() {
    game = new Game();
    game.spaceImg = loadImage("./assets/spaceship.png");
    game.enemyImg = loadImage("./assets/alien1.png");
}

function setup() {
    createCanvas(800, 600);
    translate(width / 2, height / 2);
    game.setup();

}


function draw() {
    background(0);
    strokeWeight(1);

    if (game.gameOver) {
        textAlign(CENTER);
        fill(255);
        textSize(32);
        if (game.gameWin)
            text("Winner", width / 2, height / 2);
        else
            text("Game Over", width / 2, height / 2);
        text("Score: " + game.score, width / 2, height / 2 + 40);
        if (!game.retryButtonVisible) {
            game.retryButton.show();
            game.retryButtonVisible = true;
        }
        return;
    }

    game.player.show();
    game.player.move();

    for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].show();
        game.enemies[i].move();
    }

    for (let i = 0; i < game.playerProjectiles.length; i++) {
        game.playerProjectiles[i].show();
        game.playerProjectiles[i].move();
        for (let j = 0; j < game.enemies.length; j++) {
            if (game.playerProjectiles[i].hit(game.enemies[j])) {
                game.killedEnemies++;
                game.score++;
                game.enemies.splice(j, 1);
                game.playerProjectiles.splice(i, 1);
                i--;
                break;
            }
        }
    }

    for (let i = 0; i < game.enemyProjectiles.length; i++) {
        game.enemyProjectiles[i].show();
        game.enemyProjectiles[i].move();
        if (game.enemyProjectiles[i].hit(game.player)) {
            game.gameOver = true;
        }
    }

    if (game.enemies.length === 0) {
        game.gameOver = true;
        game.gameWin = true;
    }
    game.updateKilledText();
    game.drawStars();
}

function keyPressed() {
    if (key === " ") {
        game.playerProjectiles.push(new Projectile(game.player.x, game.player.y, -1));
    }
}

class Game {
    constructor() {
        this.player;
        this.enemies = [];
        this.enemyProjectiles = [];
        this.playerProjectiles = [];
        this.spaceImg;
        this.enemyImg;
        this.gameOver = false;
        this.gameWin = false;
        this.score = 0;
        this.killedEnemies = 0;
        this.retryButtonVisible = false;
        this.enemyMoveSpeed = 1;
        this.enemyShootRate = 2000; // milliseconds
    }

    setup() {
        this.player = new Player();
        for (let i = 0; i < 10; i++) {
            this.enemies.push(new Enemy(i * 80, 0, this.enemyMoveSpeed));
        }
        this.retryButton = createButton('Retry');
        this.retryButton.position(width / 2 - 40, height / 2 + 60);
        this.retryButton.mousePressed(() => location.reload());
        this.retryButton.hide();
    }

    setDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                this.enemyMoveSpeed = 0.5;
                this.enemyShootRate = 3000;
                break;
            case 'advanced':
                this.enemyMoveSpeed = 1;
                this.enemyShootRate = 2000;
                break;
            case 'expert':
                this.enemyMoveSpeed = 1.5;
                this.enemyShootRate = 1000;
                break;
        }
    }

    updateKilledText() {
        fill(255);
        noStroke();
        textSize(16);
        text('Killed: ' + this.killedEnemies, 10, height - 10);
    }

    drawStars() {
        // Star drawing logic
    }
}
