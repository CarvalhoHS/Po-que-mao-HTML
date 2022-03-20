// Constante com o Elementos Canvas para usá-lo com JavaScript
const canvas = document.querySelector("canvas");

// Adicionando contexto ao canvas
const c = canvas.getContext('2d')

// Definindo tamanho do Canvas
canvas.width= 1024
canvas.height= 576

const playerx = 192
const playery = 68

const colissionsmap = []
for (let i = 0; i < colissions.length ;i += 70){
colissionsmap.push(colissions.slice(i,70 + i))
}

const ZonasdeBatalha = []
for (let i = 0; i < batalhasdt.length ;i += 70){
ZonasdeBatalha.push(batalhasdt.slice(i,70 + i))
}


class limite {
    static width = 48
    static height = 48
constructor({position}) {
    this.position = position
    this.width = 48
    this.height = 48
    }
desenho(){
    c.fillStyle= 'rgba(256,0,0,0)'
    c.fillRect(this.position.x,this.position.y,this.width,this.height)
}
}

const limites = []

const fora = {
    x: -1100,
    y: -350
}

colissionsmap.forEach((row , i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1025)
        limites.push(
            new limite({
                position:{
            x: j * limite.width + fora.x,
            y: i * limite.height  + fora.y
        }
        })
    )
    })
})

const batalhas = []

ZonasdeBatalha.forEach((row , i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1025)
        batalhas.push(
            new limite({
                position:{
            x: j * limite.width + fora.x,
            y: i * limite.height  + fora.y
        }
        })
    )
    })
})

const image = new Image()
image.src= "./Asset/map.png"

const PlayerImage = new Image()
PlayerImage.src="./Char/playerDown.png"

const PlayerUp = new Image()
PlayerUp.src="./Char/playerUp.png"

const PlayerLeft = new Image()
PlayerLeft.src="./Char/playerLeft.png"

const PlayerRight = new Image()
PlayerRight.src="./Char/playerRight.png"

class Sprite {
    constructor({position, velocity , image, width,
         frames = {max:1}, sprites = {},animate = false}) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () =>{
        this.width = this.image.width / this.frames.max
        this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
    }

    desenho() {
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width /this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width /this.frames.max,
            this.image.height
        )
        if(this.moving){
            if(this.frames.max > 1) {
                this.frames.elapsed++
            } }
        if(this.frames.elapsed % 10 === 0){
        if(this.frames.val < this.frames.max - 1) this.frames.val++
        else this.frames.val = 0
    }
    }
}

class SpriteBixin {
    constructor({position, image, width,
         frames = {max:1}, sprites = {}, inimigo = false, rotation = 0,nome, ataques}) {
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val: 0, elapsed: 0}

        this.image.onload = () =>{
        this.width = this.image.width / this.frames.max
        this.height = this.image.height
        }
        this.image.src = image.src
        this.moving = false
        this.sprites = sprites
        this.opacity = 1
        this.vida = 100
        this.inimigo = inimigo
        this.rotation = rotation
        this.nome = nome
        this.ataques = ataques
    }

    f(){
        document.querySelector('#dialogo').innerHTML =
        this.nome + ' MAMOU! '
        gsap.to(this.position,{
            y:this.position.y + 20
        })
        gsap.to(this,{
            opacity: 0
        })
    }

    desenho() {
        c.save()
        c.globalAlpha = this.opacity
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width /this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width /this.frames.max,
            this.image.height
        )
        c.restore()
        if(this.moving)  return 
            if(this.frames.max > 1) {
                this.frames.elapsed++
            } 
        if(this.frames.elapsed % 10 === 0){
        if(this.frames.val < this.frames.max - 1) this.frames.val++
        else this.frames.val = 0
    }
    }
    ataque({ataque,recipient,SpritesRenderizados}){

        document.querySelector('#dialogo').style.display = 'block'
        document.querySelector('#dialogo').innerHTML =
         this.nome + ' usou ' + ataque.nome

        recipient.vida -= ataque.dano
        let barradevida = '#vidadraggle'
            if (this.inimigo) barradevida = "#vidaemby"

            
    switch(ataque.nome){
        case "Fireball":
        const imgFireball = new Image()
        imgFireball.src = './Asset/fireball.png'
        const Fireball = new Sprite({
             position:{
                 x: this.position.x,
                 y: this.position.y
             },
             image: imgFireball,
             frames: {
                 max: 4
             }
            })
            SpritesRenderizados.splice(1, 0, Fireball)
            gsap.to(Fireball.position, {
                x: recipient.position.x,
                y: recipient.position.y,
                onComplete: () => {
                    gsap.to(barradevida,{
                        width: recipient.vida + '%'
                    })
        
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08,
                    })
        
                    gsap.to(recipient,{
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    })
                    SpritesRenderizados.splice(1,1)
                }
            })

        break
        case 'Batida':
            const tl = gsap.timeline()
        
            let movimento = 20
            if(this.inimigo) movimento = -20
        
            tl.to(this.position, {
                x: this.position.x - movimento
            }).to(this.position, {
                x: this.position.x + movimento * 2,
                duration: 0.1,
                onComplete: () => {
                    gsap.to(barradevida,{
                        width: recipient.vida + '%'
                    })
        
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08,
                    })
        
                    gsap.to(recipient,{
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    })
                }
            }).to(this.position, {
                x: this.position.x
            })
        break
    }
    }
}
const player = new Sprite({
position: {
    x:canvas.width / 2 - playerx / 4 / 2,
    y:canvas.height / 2 - playery / 2
},
image: PlayerImage,
frames: {
    max: 4
},
sprites: {
    up: PlayerUp,
    down: PlayerImage,
    right: PlayerRight,
    Left: PlayerLeft
}
})

const background = new Sprite({
    position: {
    x: fora.x,
    y: fora.y
},
image: image
})

const keys = {
    w: {
    pressed: false
    },
    a: {
    pressed: false
    },
    s: {
    pressed: false
    },
    d: {
    pressed: false
    }
}
/* Load das imagens do mapa e PLayer com os 4 primeiros argumentos
do draw Player sendo o CROP da imagem e os 4 ultimos a posição no mapa */

const moviveis = [
    background, ...limites , ...batalhas
]

function rectagularcolissions({rectangle1,rectangle2}){
return(
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width && 
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const briga = {
    initiated: false,
}

function animate(){
   const animatiionId = window.requestAnimationFrame(animate)
    background.desenho()
    limites.forEach(limite => {
        limite.desenho()
    })
    batalhas.forEach(batalha => {
        batalha.desenho()
    })
    player.desenho()

    let moving = true
    player.moving = false

if(briga.initiated) return
// ativando batalha
if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed ){
    for(let i = 0;i < batalhas.length; i++){
        const batalha = batalhas[i]
       /* const Lap = 
        (Math.min(
            player.position.x + player.width, 
            batalha.position.x + batalha.width
        )-
        Math.max(player.position.x, batalha.position.x)) + 
        (Math.min
            (player.position.y + player.height,
             batalha.position.y + batalha.height)
        - Math.max(player.position.y, batalha.position.y))*/
        if(
            rectagularcolissions({
            rectangle1: player,
            rectangle2: batalha
            })
           // && Lap > (player.width * player.height) / 2
        ) {
        if( Math.random() < 0.01 ){
            console.log("deu treta na batalha")
            window.cancelAnimationFrame(animatiionId)
            briga.initiated = true
            gsap.to('#LapDiv',{
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: 0.5,
                onComplete(){
                gsap.to('#LapDiv',{   
                    opacity:1,
                    duration:0.4,
                    onComplete(){
                        //começa a batalha
                        iniciabatalha()
                        animatebatalha()
                        gsap.to('#LapDiv',{   
                            opacity:0,
                            duration:0.4
                          })
            }
            })
            }
        })
            break
        }
    }
 } 
}

 
if(keys.w.pressed && UltimaTecla === "w") {
    player.moving = true
    player.image = player.sprites.up
    for(let i = 0;i < limites.length; i++){
        const limite = limites[i]
        if(
            rectagularcolissions({
            rectangle1: player,
            rectangle2: {
                ...limite,
                position: {
                x:limite.position.x,
                y:limite.position.y + 3
            }
            }
            })
        ) {
            console.log("deu treta")
            moving = false
            break
        }
        }
    if (moving)
    moviveis.forEach((movel) => {
        movel.position.y += 3
    })
    }

if(keys.s.pressed && UltimaTecla === "s"){
    player.moving = true
    player.image = player.sprites.down
    for(let i = 0;i < limites.length; i++){
        const limite = limites[i]
        if(
            rectagularcolissions({
            rectangle1: player,
            rectangle2: {
                ...limite,
                position: {
                x:limite.position.x,
                y:limite.position.y - 3
            }
            }
            })
        ) {
            console.log("deu treta")
            moving = false
            break
        }
        }
    if (moving)
    moviveis.forEach((movel) => {
        movel.position.y -= 3
    })
}


if(keys.a.pressed && UltimaTecla === "a"){
    player.moving = true
    player.image = player.sprites.Left
    for(let i = 0;i < limites.length; i++){
        const limite = limites[i]
        if(
            rectagularcolissions({
            rectangle1: player,
            rectangle2: {
                ...limite,
                position: {
                x:limite.position.x + 3,
                y:limite.position.y
            }
            }
            })
        ) {
            console.log("deu treta")
            moving = false
            break
        }
        }
    if (moving)
    moviveis.forEach((movel) => {
        movel.position.x += 3
    })
}

if(keys.d.pressed && UltimaTecla === "d"){
    player.moving = true
    player.image = player.sprites.right
    for(let i = 0;i < limites.length; i++){
        const limite = limites[i]
        if(
            rectagularcolissions({
            rectangle1: player,
            rectangle2: {
                ...limite,
                position: {
                x:limite.position.x - 3,
                y:limite.position.y
            }
            }
            })
        ) {
            console.log("deu treta")
            moving = false
            break
        }
        }
    if (moving)
    moviveis.forEach((movel) => {
        movel.position.x -= 3
    })
}

}
//animate()

let UltimaTecla = ""
window.addEventListener("keydown", (e) => {
    switch(e.key) {
        case "w":
            keys.w.pressed = true
            UltimaTecla = "w"
            break
        case "a":
            keys.a.pressed = true
            UltimaTecla = "a"
            break
        case "s":
            keys.s.pressed = true
            UltimaTecla = "s"
            break
        case "d":
            keys.d.pressed = true
            UltimaTecla = "d"
            break
    }
})

window.addEventListener("keyup", (e) => {
    switch(e.key) {
        case "w":
            keys.w.pressed = false
            break
        case "a":
            keys.a.pressed = false
            break
        case "s":
            keys.s.pressed = false
            break
        case "d":
            keys.d.pressed = false
            break
    }
})
console.log(keys)