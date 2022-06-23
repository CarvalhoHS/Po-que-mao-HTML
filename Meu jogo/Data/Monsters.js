const imgemby = new Image()
imgemby.src='./Asset/embySprite.png'

const imgdraggle = new Image()
imgdraggle.src='./Asset/draggleSprite.png'

const Monster = {
   emby: {
    position:{
        x:280,
        y:325
        },
        image: {
            src:'./Asset/embySprite.png'
        },
        frames:{
            max: 4
        },
        nome: "Emby",
        ataques: [ataques.Batida,ataques.Fireball]
},
    draggle: {
        position:{
            x:800,
            y:100
            },
            image:{
                src: './Asset/draggleSprite.png'
            },
            frames:{
                max:4
            },
            inimigo: true,
            nome: 'Draggle',
            ataques: [ataques.Batida,ataques.Fireball]
    }
}
