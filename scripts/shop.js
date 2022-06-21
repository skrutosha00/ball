import { animateOnce, changeBalance } from "./functions.js"

let button = document.querySelector('div.button')
let balance = document.querySelector('.balance')
let itemNodes = document.querySelectorAll('.item_cont')

let active = localStorage.getItem('pers_ball')

let priceData = {
    1: 3000,
    2: 0,
    3: 5000,
    bonus: 500
}

updateButton()

for (let item of itemNodes) {
    if (item.dataset.pers == active) {
        item.classList.add('active')
    }

    item.onclick = () => {
        for (let i of itemNodes) {
            i.classList.remove('active')
        }

        item.classList.add('active')
        active = item.dataset.pers
        updateButton()
        if (active != 'bonus' && localStorage.getItem(active + '_ball')) {
            localStorage.setItem('pers_ball', active)
        }
    }
}

button.onclick = () => {
    if (button.innerHTML != 'Selected') {
        if (Number(balance.innerHTML) >= priceData[active]) {
            changeBalance(-priceData[active])
            animateOnce('.button_cont > div', 'deal')

            if (active == 'bonus') {
                localStorage.setItem('bonus_ball', Number(localStorage.getItem('bonus_ball')) + 1)
            } else {
                localStorage.setItem(active + '_ball', 1)
                localStorage.setItem('pers_ball', active)
                button.innerHTML = 'Selected'
            }
        } else {
            animateOnce('.balance')
            animateOnce('.button_cont > div', 'not_deal')
        }
    }
}

function updateButton() {
    function setPrice(price) {
        let img = document.createElement('img')
        img.src = '../png/currency.png'

        let priceCont = document.createElement('div')
        priceCont.innerHTML = price

        button.innerHTML = ''
        button.append(img, priceCont)
    }

    if (active == 'bonus') {
        setPrice(priceData[active])
    } else {
        if (localStorage.getItem(active + '_ball')) {
            button.innerHTML = 'Selected'
        } else {
            setPrice(priceData[active])
        }
    }
}