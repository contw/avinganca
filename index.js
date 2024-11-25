const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.4

const background = new Sprite({
    position: {
        x: 0,
        y:0
    },
    imageSrc: './img/fundo.png'
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/carmilla/Idle.png',
    framesMax: 5,
    scale: 1.5,
    offset: {
        x: 50,
        y: 40
    },
    sprites: {
        idle: {
            imageSrc: './img/carmilla/Idle.png',
            framesMax: 5
        },
        run: {
            imageSrc: './img/carmilla/Walk.png',
            framesMax: 6
        },
        jump: {
            imageSrc: './img/carmilla/Jump.png',
            framesMax: 6
        },
        attack: {
            imageSrc: './img/carmilla/Attack.png',
            framesMax: 6
        },
        attackBox: {
            offset: {
                x: 0,
                y: 0
            },
            width: 100,
            height: 50
        }
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/dracula/Idle.png',
    framesMax: 5,
    scale: 1.5,
    offset: {
        x: 50,
        y: 40
    },
    sprites: {
        idle: {
            imageSrc: './img/dracula/Idle.png',
            framesMax: 5
        },
        run: {
            imageSrc: './img/dracula/Walk.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/dracula/Jump.png',
            framesMax: 7
        },
        attack: {
            imageSrc: './img/dracula/Attack.png',
            framesMax: 5
        },
        attackBox: {
            offset: {
                x: 0,
                y: 0
            },
            width: 100,
            height: 50
        }
}})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -3
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.switchSprite('run')
        player.velocity.x = 3
    } else { player.switchSprite('idle') }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -3
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 3
        enemy.switchSprite('run')
    } else { enemy.switchSprite('idle') }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }

    // detect collision 
    if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking) {
            player.isAttacking = false
            enemy.health -= 20
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
        break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
        break
        case 'w':
            player.velocity.y = -15
        break
        case ' ':
            player.attack()
        break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
        break
        case 'ArrowUp':
            enemy.velocity.y = -15
        break
        case 'ArrowDown':
            enemy.attack()
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
        case 'w':
            keys.w.pressed = false
        break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
        break
    }
})