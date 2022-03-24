const imgbackgroundbatalha = new Image()
imgbackgroundbatalha.src='./Asset/battleBackground.png'
const battleBackground = new Sprite({
    position:{
        x:0,
        y:0
    },
    image:imgbackgroundbatalha
})

let queue
let draggle
let emby
let SpritesRenderizados
let battleanimationID

function iniciabatalha(){
document.querySelector('#tudo').style.display = 'block'
document.querySelector('#barradeataque').style.display = 'block'
document.querySelector('#dialogo').style.display = 'none'
document.querySelector('#vidadraggle').style.width = '100%'
document.querySelector('#vidaemby').style.display = '100%'
document.querySelector('#boxataques').replaceChildren()

draggle = new SpriteBixin(Monster.draggle)
emby= new SpriteBixin(Monster.emby)
SpritesRenderizados = [draggle, emby]
queue = []

emby.ataques.forEach((ataque) => {
    const button = document.createElement('button')
    button.innerHTML = ataque.nome
    document.querySelector('#boxataques').append(button)
    })

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const ataqueselecionado = ataques[e.currentTarget.innerHTML]
          emby.ataque({
            ataque: ataqueselecionado,
            recipient: draggle,
            SpritesRenderizados
            }) 
    
            if (draggle.vida <= 0){
                queue.push(() =>{
                    draggle.f()
                })
                queue.push(() =>{
                    gsap.to('#LapDiv',{
                        opacity:1,
                        onComplete: () =>{
                        cancelAnimationFrame(battleanimationID)
                        animate()
                        document.querySelector('#tudo').style.display = 'none'
                        document.querySelector('#barradeataque').style.display = 'none'
                        gsap.to('#LapDiv', {
                            opacity: 0
                        })
                        briga.initiated = false
                        }
                    })
                })
            }
    // ataque do inimigo
        const random = 
        draggle.ataques[Math.floor(Math.random() * draggle.ataques.length)]
    
        queue.push(() =>{
            draggle.ataque({
                ataque: random,
                recipient: emby,
                SpritesRenderizados
                }) 
    
                if (emby.vida <= 0){
                    queue.push(() =>{
                        emby.f()
                    })
                    queue.push(() =>{
                        gsap.to('#LapDiv',{
                            opacity:1,
                            onComplete: () =>{
                            cancelAnimationFrame(battleanimationID)
                            animate()
                            document.querySelector('#tudo').style.display = 'none'
                            document.querySelector('#barradeataque').style.display = 'none'
                            gsap.to('#LapDiv', {
                                opacity: 0
                })
                briga.initiated = false
        }
        })
})
}
})
})

button.addEventListener('mouseenter', (e) => {
    const ataqueselecionado = ataques[e.currentTarget.innerHTML]
    document.querySelector('#tipodeataque').innerHTML = ataqueselecionado.tipo
    document.querySelector('#tipodeataque').style.color = ataqueselecionado.color
})
})
}

function animatebatalha() {
   battleanimationID = window.requestAnimationFrame(animatebatalha)
    battleBackground.desenho()

    SpritesRenderizados.forEach(Sprite =>{
        Sprite.desenho()
    })
}

animate()

//iniciabatalha()
//animatebatalha()

document.querySelector('#dialogo').addEventListener('click', (e) => {
    if(queue.length > 0){
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none' 
})