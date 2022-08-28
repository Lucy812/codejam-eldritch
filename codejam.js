import ancientsData from './data/ancients.js';
import {cardsData as cardsDataGreen} from './data/mythicCards/green/index.js';
import {cardsData as cardsDataBrown} from './data/mythicCards/brown/index.js';
import {cardsData as cardsDataBlue} from './data/mythicCards/blue/index.js';

const ancientContainer = document.querySelector('.ancient-container');
const difficultyContainer = document.querySelector('.difficulty-container');
const shuffleButton = document.querySelector('.shuffle-button');
const deckBack = document.querySelector('.deck');
const lastCard = document.querySelector('.last-card');

let ancientNum;
let greenDeck, brownDeck, blueDeck;
let restDeckGreen, restDeckBrown, restDeckBlue; 
let newArr = [];

ancientContainer.addEventListener('click', getAncient);
difficultyContainer.addEventListener('click', getDifficulty);
shuffleButton.addEventListener('click', getStages);

function getAncient(e) {
    if (e.target.classList.contains('ancient-card')) {
        const nodeList = document.querySelectorAll('.ancient-card');
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].style.border = 'none';
        };
        newArr = [];
        let ancient = e.target.classList.item(1);
        e.target.style.border = '2px solid red';
        difficultyContainer.style.visibility = 'visible';
        getAncientDeck(ancient);
    }
}

function getDifficulty(e){
    if (e.target.classList.contains('difficulty')) {
        deckBack.style.visibility = 'hidden';
        lastCard.style.visibility = 'hidden';
        const nodeList = document.querySelectorAll('.difficulty');
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].style.borderColor = 'black';
        };
        let difficulty = e.target.classList.item(1);
        greenDeck = getFurther(cardsDataGreen, difficulty, 'greenCards');
        brownDeck = getFurther(cardsDataBrown, difficulty, 'brownCards');
        blueDeck = getFurther(cardsDataBlue, difficulty, 'blueCards');
        restDeckGreen = shuffleArray(greenDeck);
        restDeckBrown = shuffleArray(brownDeck);
        restDeckBlue = shuffleArray(blueDeck); 
        e.target.style.border = '1px solid red';
        shuffleButton.style.visibility = 'visible';
        return restDeckGreen, restDeckBrown, restDeckBlue;
    }
}

function getAncientDeck (ancient) {
    ancientsData.forEach(element => {
        if(element.id == ancient){
            ancientNum = ancientsData.indexOf(ancientsData.find(item => item.id == ancient));
            return ancientNum;
        }
    });
}

function getFurther(cardsData, difficulty, cardType){
    let cardDeckData = [];
    let cardCheck = ancientsData[ancientNum].firstStage[`${cardType}`] + ancientsData[ancientNum].secondStage[`${cardType}`] + ancientsData[ancientNum].thirdStage[`${cardType}`];
    let normalCards = cardsData.filter(item => item.difficulty == 'normal');
    switch(difficulty) {
        case 'super-easy':
            cardDeckData = cardsData.filter(item => item.difficulty == 'easy');
            while((cardCheck - cardDeckData.length) > 0) {
                cardDeckData.push(normalCards[getRandom(0,normalCards.length)]);
            }
        break;
        case 'easy':
            cardDeckData = cardsData.filter(item => item.difficulty != 'hard');
        break;
        case 'normal':
            cardDeckData = cardsData;
        break;
        case 'hard':
            cardDeckData = cardsData.filter(item => item.difficulty != 'easy');
        break;
        case 'super-hard':
            cardDeckData = cardsData.filter(item => item.difficulty == 'hard');
            while((cardCheck - cardDeckData.length) > 0) {
                cardDeckData.push(normalCards[getRandom(0,normalCards.length)]);
            }
        break;
    }
    return cardDeckData;
}

function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getStages(){
    deckBack.addEventListener('click', getCard);
    deckBack.style.visibility = 'visible';
    deckBack.style.backgroundImage = 'url("assets/mythicCardBackground.png")';
    getAnyStage('firstStage', newArr, restDeckGreen, restDeckBrown, restDeckBlue);
    getAnyStage('secondStage', newArr, restDeckGreen, restDeckBrown, restDeckBlue);
    getAnyStage('thirdStage', newArr, restDeckGreen, restDeckBrown, restDeckBlue);
}

function getAnyStage(stage, newArr, restDeckGreen, restDeckBrown, restDeckBlue){
    let greenMark = ancientsData[ancientNum][`${stage}`].greenCards;
    let brownMark = ancientsData[ancientNum][`${stage}`].brownCards;
    let blueMark = ancientsData[ancientNum][`${stage}`].blueCards;
    document.querySelector(`.${stage} .green`).innerHTML = greenMark;
    document.querySelector(`.${stage} .brown`).innerHTML = brownMark;
    document.querySelector(`.${stage} .blue`).innerHTML = blueMark;
    let card;
    while(greenMark){
        card = restDeckGreen.pop();
        newArr.push(card);
        greenMark--;
    }
    while(brownMark){
        card = restDeckBrown.pop();
        newArr.push(card);
        brownMark--;
    }
    while(blueMark){
        card = restDeckBlue.pop();
        newArr.push(card);
        blueMark--;
    }
    console.log(newArr);
    return newArr, restDeckGreen, restDeckBrown, restDeckBlue;
}

function getCard(){
    lastCard.style.visibility = 'visible';
    let card = newArr.shift();
    console.log(card);
    if(newArr.length == 0){
        deckBack.style.backgroundImage = 'none';
        deckBack.removeEventListener('click', getCard);
    };
    if(card){
        lastCard.style.backgroundImage = `url('${card.cardFace}')`;  
    };
}

function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let k = array[i];
        array[i] = array[j];
        array[j] = k;
    } 
    return array;
}