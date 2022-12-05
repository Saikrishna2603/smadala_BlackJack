// Blackjack

let blackjackGame = {
    'you' : {'scoreSpan': '#your-blackjack-result', 'div':'#your-box', 'score':0},
    'dealer' : {'scoreSpan': '#dealer-blackjack-result', 'div':'#dealer-box', 'score':0},
    'cards': ['2C','3C','4C','5C','6C','7C','8C','9C','10C','KC','QC','JC','AC','2D','3D','4D','5D','6D','7D','8D','9D','10D','KD','QD','JD','AD','2H','3H','4H','5H','6H','7H','8H','9H','10H','KH','QH','JH','AH','2S','3S','4S','5S','6S','7S','8S','9S','10S','KS','QS','JS','AS'],
    
    'cardsMap': {'2C':2,'3C':3,'4C':4,'5C':5,'6C':6,'7C':7,'8C':8,'9C':9,'10C':10,'KC':10,'QC':10,'JC':10,'AC':[1, 11],'2D':2,'3D':3,'4D':4,'5D':5,'6D':6,'7D':7,'8D':8,'9D':9,'10D':10,'KD':10,'QD':10,'JD':10,'AD':[1, 11],'2H':2,'3H':3,'4H':4,'5H':5,'6H':6,'7H':7,'8H':8,'9H':9,'10H':10,'KH':10,'QH':10,'JH':10,'AH':[1, 11],'2S':2,'3S':3,'4S':4,'5S':5,'6S':6,'7S':7,'8S':8,'9S':9,'10S':10,'KS':10,'QS':10,'JS':10,'AS':[1, 11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand': false,
    'turnsOver': false,
}; 

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
let startGame = true
let message, messageColor;
let isGameCompleted = false 

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');
const DrewSound=new Audio('static/sounds/Drew.WAV')

document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);   
document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackDeal);   
document.querySelector('#blackjack-stand-button').addEventListener('click',stand);   

function blackjackHit() {
    if (blackjackGame['isStand'] === false){
        // let card = randomCard();
        const randomNumber = Math.floor(Math.random() * (blackjackGame['cards'].length));
        const currentCard = blackjackGame['cards'].splice(randomNumber, 1);
        showCard(currentCard, YOU);
        updateScore(currentCard, YOU);
        showScore(YOU);
        if(startGame){
            const randomNumber2 = Math.floor(Math.random() * (blackjackGame['cards'].length));
            const currentCard2 = blackjackGame['cards'].splice(randomNumber2, 1);
            showCard(currentCard2, YOU);
            updateScore(currentCard2, YOU);
            showScore(YOU);
            dealerLogic()
            let hideCardImage = document.createElement('img');
            hideCardImage.src = `static/images/hide.png`;
            document.querySelector('#dealer-box').appendChild(hideCardImage);
            startGame = false
        }
    } 
}

function randomCard() {
    return blackjackGame['cards'][Math.floor(Math.random() * 13)];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    } else {}
}

function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true){
        blackjackGame['isStand'] = false;
        
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    
        for (i=0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        
        for (i=0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }
    
        YOU['score'] = 0;
        DEALER['score'] = 0;
    
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
    
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
        
        document.querySelector('#blackjack-result').textContent = "Let's Play!";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackDeal['turnsOver'] = true;
        startGame = true 
        message = ""
        isGameCompleted = false
    }else if(YOU['score'] > 1){
        alert("Please click on Stand!")
    }else{
        alert("Please hit cards!.")
    }
}

function updateScore(card, activePlayer) {
    if (card == 'AC' || card == 'AD' || card == 'AH' || card == 'AS') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
  
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if(activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else { 
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    if(YOU['score'] != 0 || YOU['score'] < 0){
        blackjackGame['isStand'] = true;
    }else{
        alert("Please hit some cards.")
    }

    if (DEALER['score'] < 16 && blackjackGame['isStand'] === true && message != 'You won!' && !isGameCompleted) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        blackjackGame['isStand'] = false;
        // await sleep(1000);
    }

    if(!startGame){
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');        
        dealerImages[1].remove();
        showResult(computeWinner());
        blackjackGame['isStand'] = true;
        startGame = true
    }
}

async function stand() {
    if(YOU['score'] != 0 || YOU['score'] < 0){
        blackjackGame['isStand'] = true;
    }else{
        alert("Please hit some cards.")
    }

    if(!startGame){
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');        
        dealerImages[1].remove();
    }

    while (DEALER['score'] < 17 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(500);
    }

    if(!startGame){
        blackjackGame['turnsOver'] = true;
        showResult(computeWinner());
        blackjackGame['isStand'] = true;
        startGame = true
    }
}

function computeWinner() {
    let winner;

    if (YOU['score'] <= 21){
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            winner = YOU;
        
        } else if (YOU['score'] < DEALER['score']){
            winner = DEALER;
        
        } else if (YOU['score'] === DEALER['score']){
        
        }
    
    } else if (YOU['score'] > 21) {
        if (DEALER['score'] <= 21){
            winner = DEALER;
        
        } else if (DEALER['score'] > 21) {

        }
    }

    return winner;

}

function showResult(winner) {
    if (blackjackGame['turnsOver'] === true) {
        if (winner === YOU) {
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
            blackjackGame['isStand'] === true
        } else if (winner === DEALER) {
            message = 'You lost!';
            messageColor = 'red';
            lossSound.play();
            blackjackGame['isStand'] === true
        } else {
            message = 'You drew!'; 
            messageColor = 'blue';
            DrewSound.play();
            blackjackGame['isStand'] === true            
        }
    
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
        isGameCompleted = true
        blackjackGame['turnsOver'] === false
    }

}
