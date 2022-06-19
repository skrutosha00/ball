import { animateOnce, changeBalance, randInt } from "./functions.js"

let bonusAmount = document.querySelector('.bonus_amount')
let balance = document.querySelector('.balance')
let betAmount = document.querySelector('.bet_amount')
let stake = document.querySelector('.stake span')
let ball = document.querySelector('.ball')

let cfData = [1.1, 1.3, 1.5, 2, 2.2, 2.6, 3, 4, 5, 10]

let activeForBet = true
let activeForShot = true
let ballsLeft = 10
let score = 0
let bonus = false
let autoMode = false

bonusAmount.innerHTML = 'x' + localStorage.getItem('bonus_ball')

let persPic = document.createElement('img')
persPic.src = '../png/pers_' + localStorage.getItem('pers_ball') + '.png'
document.querySelector('.item').appendChild(persPic)

let basketCont = document.querySelector('.basket_cont')
basketCont.style.width = basketCont.offsetHeight * (16 / 27) + 'px'
ball.style.width = ball.style.height = document.querySelector('.basket').offsetWidth * 0.8 + 'px'

document.querySelector('.plus').onclick = () => {
    if (Number(betAmount.innerHTML) + 10 > Number(balance.innerHTML) || !activeForBet) { return }

    stake.innerHTML = betAmount.innerHTML = Number(betAmount.innerHTML) + 50
}

document.querySelector('.minus').onclick = () => {
    if (!activeForBet || Number(betAmount.innerHTML) - 50 < 0) { return }

    stake.innerHTML = betAmount.innerHTML = Number(betAmount.innerHTML) - 50
}

document.querySelector('.shoot').onclick = async () => {
    if (!activeForShot || betAmount.innerHTML == 0 || Number(betAmount.innerHTML) > Number(balance.innerHTML)) { return }

    activeForShot = false
    activeForBet = false

    if (ballsLeft == 10) {
        changeBalance(-Number(betAmount.innerHTML))
    }

    ballsLeft -= 1
    document.querySelector('.left').innerHTML = ballsLeft

    let r = bonus ? 1 : randInt(1, 4)
    let r2 = randInt(1, 2)

    let win = !(r == 4)
    let pathX = win ? 325 : (r2 == 1 ? 475 : 225)
    let extraRotate = win ? 0 : 1

    await moveBall(randInt(50, 200), randInt(300, 450), 1)
    await moveBall(pathX, 200, 2)
    await moveBall(pathX, 0, 2 + extraRotate)
    await moveBall(0, 0)

    if (win) {
        stake.innerHTML = Math.round(Number(betAmount.innerHTML) * cfData[score])

        score += 1
        showScore()
    }

    if (!ballsLeft) {
        gameOver()
    } else {
        activeForShot = true
        bonus = false
    }
}

document.querySelector('.shoot_all').onclick = () => {
    if (!activeForShot || betAmount.innerHTML == 0 || Number(betAmount.innerHTML) > Number(balance.innerHTML) || autoMode) { return }
    autoMode = true

    let autoInterval = setInterval(() => {
        if (document.querySelector('.warning').style.left != '50%') {
            document.querySelector('.shoot').click()
        } else {
            clearInterval(autoInterval)
        }
    }, 1000);
}

document.querySelector('.again').onclick = () => {
    ballsLeft = 10
    document.querySelector('.left').innerHTML = ballsLeft

    stake.innerHTML = betAmount.innerHTML

    activeForShot = true
    activeForBet = true
    score = 0
    autoMode = false

    for (let cfCont of document.querySelectorAll('.cf_cont')) {
        cfCont.querySelector('.fireball').classList.add('hidden')
        cfCont.querySelector('.ball_pic').classList.remove('hidden')
        cfCont.querySelector('div').classList.remove('hidden')
    }

    document.querySelector('.warning').style.left = '-50%'
}

document.querySelector('.bonus_cont').onclick = () => {
    let bonusStorage = Number(localStorage.getItem('bonus_ball'))
    if (!bonusStorage || bonus) { return }

    if (activeForShot && !activeForBet) {
        bonus = true
        localStorage.setItem('bonus_ball', bonusStorage - 1)
        bonusAmount.innerHTML = 'x' + (bonusStorage - 1)
    }
}

function moveBall(x, y, order = 0) {
    let angle = order * 360

    ball.style.transform = 'translate(' + x + '%, -' + y + '%) rotate(' + angle + 'deg)'
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('ok')
        }, 1000);
    })
}

function showScore() {
    let cfCont = document.querySelectorAll('.cf_cont')[score - 1]

    cfCont.querySelector('.fireball').classList.remove('hidden')
    cfCont.querySelector('.ball_pic').classList.add('hidden')
    cfCont.querySelector('div').classList.add('hidden')
}

function gameOver() {
    document.querySelector('.warning_text').innerHTML = 'Congrats!<br>You have won ' + stake.innerHTML
    document.querySelector('.warning').style.left = '50%'

    changeBalance(Number(stake.innerHTML))
    animateOnce('.balance')
}

document.querySelector('.wrapper').classList.remove('hidden')