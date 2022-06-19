import { setBalanceField } from './functions.js'

let cfData = [1.1, 1.3, 1.5, 2, 2.2, 2.6, 3, 4, 5, 10]

for (let i = 0; i < 10; i++) {
    let ballCont = document.createElement('div')
    ballCont.classList.add('cf_cont', 'block')

    let cf = document.createElement('div')
    cf.innerHTML = 'x' + cfData[i]

    let ballPic = document.createElement('img')
    ballPic.src = '../png/ball_nav.png'
    ballPic.classList.add('ball_pic')

    let fireballPic = document.createElement('img')
    fireballPic.src = '../png/fireball.png'
    fireballPic.classList.add('fireball', 'hidden')

    ballCont.append(cf, ballPic, fireballPic)
    document.querySelector('.ball_cont').appendChild(ballCont)
}

setBalanceField()