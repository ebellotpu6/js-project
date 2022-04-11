import { Game } from "./model/game";

const bastos = document.createElementNS("./src/images/oros.svg", "svg");
const espases = document.createElementNS("./src/images/oros.svg", "svg");
const copes = document.createElementNS("./src/images/oros.svg", "svg");

let game;

const initScreen = document.getElementById("initScreen");
const numPlayers = document.getElementById("numPlayers");
const playerMoney = document.getElementById("playerMoney");
const startGameButton = initScreen.querySelector("#startGameButton");

const scene = document.getElementById("scene");

const modal = document.getElementById("modal");
const modalTitle = modal.querySelector("#modalTitle");
const modalText = modal.querySelector("#modalText");
const modalButton = modal.querySelector("#modalButton");

const deck = document.getElementById("deck");
const userHand = document.getElementById("user_hand");
const leftHand = document.getElementById("left_player_hand");
const rightHand = document.getElementById("right_player_hand");
const frontHand = document.getElementById("front_player_hand");

startGameButton.addEventListener("click", startGame);

function startGame() {
    initScreen.style.display = "none";
    scene.classList.remove("hide-content");
    game = new Game(numPlayers.value, Number(playerMoney.value));

    game.startRound();
    renderGame();
}

modalButton.addEventListener("click", nextTorn);

function nextTorn() {
    game.nextPlayer();
    modal.style.display = "none";
    renderGame();
    askCard_button.disabled = false;
}

const askCard_button = document.getElementById("askCard_button");
const showCard_button = document.getElementById("showCard_button");
const userPoints = document.getElementById("user_points");
const stand_button = document.getElementById("stand_button");
const acumulator_bet = document.getElementById("acumulator_bet");
const money_left = document.getElementById("money_left");
const current_bet = document.getElementById("current_bet");
const bet_button = document.getElementById("bet_button");

askCard_button.addEventListener("click", askCard);

function askCard(){
    game.dealCard(game.currentPlayer);
    console.log(game.currentPlayer.handValue());
    if(game.currentPlayer.handValue() > 7.5) {
        askCard_button.disabled = true;
        game.currentPlayer.setAllCardsVisible();
        modal.style.display = "block";
        modalTitle.textContent = "¡T'has pasat!"
        modalText.textContent = `El jugador ${game.currentPlayer.id} ha superat el 7,5. És el torn del seguent jugador.`;
    }
    renderGame();
}

showCard_button.addEventListener("click", showCard);

function showCard(){
    const card = userHand.querySelector(".selected");
    const card_content = card.querySelector(".card-content");
    const child = card_content.firstElementChild;
    console.log(child.getAttribute("suit"));
    game.currentPlayer.setCardVisible(child.getAttribute("suit"), Number(child.getAttribute("number")));
    card.classList.remove("selected");
    card.classList.add("visible");
    card.firstElementChild.classList.remove("flipped");
    card.removeEventListener("click", selectCard);
    this.disabled = true;
}

stand_button.addEventListener("click", stand);

function stand(){
    modal.style.display = "block";
    modalTitle.textContent = "¡T'has plantat!"
    modalText.textContent = `El jugador ${game.currentPlayer.id} s'ha plantat. És el torn del seguent jugador.`;
}

bet_button.addEventListener("click", bet);

function bet(){
    if(game.makeBet(game.currentPlayer, current_bet.value)) {
        acumulator_bet.value = game.currentPlayer.bet;
        money_left.value = game.currentPlayer.money;
        current_bet.value = 0;
        askCard_button.disabled = false;
    }
    else{
        modal.style.display = "block";
        modalTitle.textContent = "No tens prous diners!"
        modalText.textContent = `La teva aposta és superior als teus diners. Actualment disposes de ${game.currentPlayer.money} punts en fitxes. La teva aposta no pot superar aquesta quantitat.`;
    }
}

const renderCardContent = (card) => {
    const div = document.createElement("div");
    const suiteIcon = document.createElement("img");
    switch (card.number) {
        case 1:
            suiteIcon.src = `./src/images/as_${card.suit}.svg`;
            suiteIcon.setAttribute("suit", card.suit);
            suiteIcon.setAttribute("number", card.number);
            div.append(suiteIcon);
            break;
        case 10:
            suiteIcon.src = `./src/images/sota_${card.suit}.svg`;
            suiteIcon.setAttribute("suit", card.suit);
            suiteIcon.setAttribute("number", card.number);
            div.append(suiteIcon);
            break;
        case 11:
            suiteIcon.src = `./src/images/cavall_${card.suit}.svg`;
            suiteIcon.setAttribute("suit", card.suit);
            suiteIcon.setAttribute("number", card.number);
            div.append(suiteIcon);
            break;
        case 12:
            suiteIcon.src = `./src/images/rei_${card.suit}.svg`;
            suiteIcon.setAttribute("suit", card.suit);
            suiteIcon.setAttribute("number", card.number);
            div.append(suiteIcon);
            break;
        default:
            for(let i = 0; i < card.number; ++i) {
                const suiteIcon = document.createElement("img");
                suiteIcon.src = `./src/images/${card.suit}.svg`;
                suiteIcon.setAttribute("suit", card.suit);
                suiteIcon.setAttribute("number", card.number);
                div.append(suiteIcon);
            }
            break;

    }
    div.setAttribute("suit", card.suit);
    div.setAttribute("number", card.number);
    return div;
}

const renderUserCard = (card) => {
    const li = document.createElement("li");
    li.classList.add("card");
    const div = document.createElement("div");
    const front = document.createElement("div");
    front.setAttribute("suit", card.suit);
    const div2 = document.createElement("div");
    if(card.suit === "bastos") {
        const borderDiv = document.createElement("div");
        borderDiv.classList.add("card-border");
        div2.append(borderDiv);
    }

    const spanTop = document.createElement("span");
    spanTop.textContent = card.number;

    const divMiddle = document.createElement("div");
    divMiddle.append(renderCardContent(card));
    divMiddle.classList.add("card-content")

    const spanBottom = document.createElement("span");
    spanBottom.textContent = card.number;

    div2.append(spanTop, divMiddle, spanBottom);
    front.append(div2);
    front.classList.add("front");

    const back = document.createElement("div");
    const div3 = document.createElement("div");
    const img = document.createElement("img");
    img.src = "./src/images/revers.svg";
    div3.append(img);
    back.append(div3);
    back.classList.add("back");
    if(card.isVisible()) {
        div.append(front);
        li.classList.add("visible");
    } 
    else {
        div.append(front, back);
        div.classList.add("flipped");
        li.addEventListener("click", selectCard);
    }
    li.append(div);
    return li;
}

function selectCard(event){
    this.classList.toggle("selected");
    showCard_button.disabled = !showCard_button.disabled;
}

const renderOponentCard = (card) => {
    const li = document.createElement("li");
    li.classList.add("card");
    const div = document.createElement("div");
    if(card.isVisible()){
        const front = document.createElement("div");
        front.setAttribute("suit", card.suit);
        const div2 = document.createElement("div");
        if(card.suit === "bastos") {
            const borderDiv = document.createElement("div");
            borderDiv.classList.add("card-border");
            div2.append(borderDiv);
        }
    
        const spanTop = document.createElement("span");
        spanTop.textContent = card.number;
    
        const divMiddle = document.createElement("div");
        divMiddle.append(renderCardContent(card));
        divMiddle.classList.add("card-content")
    
        const spanBottom = document.createElement("span");
        spanBottom.textContent = card.number;
    
        div2.append(spanTop, divMiddle, spanBottom);
        front.append(div2);
        front.classList.add("front");

        div.append(front);
    }
    else {
        const div4 = document.createElement("div");
        const img = document.createElement("img");
        img.src = "./src/images/revers.svg";
        div4.append(img);
        div.append(div4);
        div.classList.add("hidden");
    }
    li.append(div);
    return li;
}

const renderDeck = (card, i) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = "./src/images/revers.svg";
    div.append(img);
    li.append(div);
    li.style.left = `${Math.floor(Math.random() * 5 - 2)}px`;
    li.style.zIndex = `${i}`;
    return li;
}

const renderGame = () => {
    deck.textContent = "";
    userHand.textContent = ""; //Borra interior del userHand
    leftHand.textContent = "";
    rightHand.textContent = "";
    frontHand.textContent = "";

    showCard_button.disabled = true;
    userPoints.textContent = game.currentPlayer.handValue();
    acumulator_bet.value = game.currentPlayer.bet;
    money_left.value = game.currentPlayer.money;

    for(let i = 0; i < game.deck.cards.length; i++){
        deck.appendChild(renderDeck(game.deck.cards[i], i));
    };
    game.players[1].hand.forEach(card => {
        leftHand.appendChild(renderOponentCard(card));
    });
    game.players[2].hand.forEach(card => {
        frontHand.appendChild(renderOponentCard(card));
    });
    game.players[game.numberOfPlayers()-1].hand.forEach(card => {
        rightHand.appendChild(renderOponentCard(card));
    });

    if(game.currentPlayer.bet === 0) {
        console.log("Player bet = 0");
        askCard_button.disabled = true;
    }
    game.currentPlayer.hand.forEach(card => {
        userHand.appendChild(renderUserCard(card));
    });
}




