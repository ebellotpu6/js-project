import { Game } from "./model/game";
import { Deck } from "./model/deck";

let game, lastWinner;

/* -------------- INIT SCREEN ---------------- */

const initScreen = document.getElementById("initScreen");
const cardsAnimationList = initScreen.querySelector("#cards_animation_list");
const numPlayers = initScreen.querySelector("#numPlayers");
const playerMoney = initScreen.querySelector("#playerMoney");
const startGameButton = initScreen.querySelector("#startGameButton");

/* ------------------------------------------- */

/* -------------- MENU BUTTONS --------------- */

const restartGameButton = document.getElementById("restartGameButton");
const helpButton = document.getElementById("helpButton");

/* ------------------------------------------- */

/* -------------- GAME SCREEN ---------------- */

const scene = document.getElementById("scene");
const deck = scene.querySelector("#deck");
const userHand = scene.querySelector("#user_hand");
const leftHand = scene.querySelector("#left_player_hand");
const rightHand = scene.querySelector("#right_player_hand");
const frontHand = scene.querySelector("#front_player_hand");

    /* ------------------ GAME UI ----------------- */

const userComands = document.getElementById("user_comands");
const askCard_button = userComands.querySelector("#askCard_button");
const showCard_button = userComands.querySelector("#showCard_button");
const userPoints = userComands.querySelector("#user_points");
const userName = userComands.querySelector("#user_name");
const stand_button = userComands.querySelector("#stand_button");
const acumulator_bet = userComands.querySelector("#acumulator_bet");
const money_left = userComands.querySelector("#money_left");
const current_bet = userComands.querySelector("#current_bet");
const bet_button = userComands.querySelector("#bet_button");

    /* ------------------------------------------- */

    /* ----------------- MODALS ------------------ */

const modalGame = document.getElementById("modalGame");
const modalGameContent = modalGame.querySelector(".modal-content");
const modalGameTitle = modalGame.querySelector("#modalTitle");
const modalGameText = modalGame.querySelector("#modalText");
const modalGameButton1 = modalGame.querySelector("#modalButton1");
const modalGameButton2 = modalGame.querySelector("#modalButton2");
const modalGameButton3 = modalGame.querySelector("#modalButton3");
const modalGameButton4 = modalGame.querySelector("#modalButton4");
const modalGameButton5 = modalGame.querySelector("#modalButton5");

const modalHelp = document.getElementById("modalHelp");
const modalHelpButton1 = modalHelp.querySelector("#modalButton6");
const modalHelpButton2 = modalHelp.querySelector("#modalButton7");

    /* ------------------------------------------- */

/* ------------------------------------------- */

startGameButton.addEventListener("click", startGame);
// This function strarts the game. It's called when the user click on the *INICIAR PARTIDA* button on the InitScreen
function startGame() {
    game = new Game(numPlayers.value, Number(playerMoney.value));

    game.startRound();
    renderGame();
    setTimeout(function() {
        initScreen.style.display = "none";
        scene.classList.remove("hide-content");
    }, 500);
}

restartGameButton.addEventListener("click", showModalRestartGame);
// This function shows the Modal Game and ask user to confirm the restart of the game. It's called when the user click on the *NOVA PARTIDA* button on the top bar menu.
function showModalRestartGame() {
    modalGame.style.display = "block";
    modalGameTitle.textContent = "Reiniciar la partida?"
    modalGameText.textContent = `Estàs segur que vols reiniciar la partida?`;
    modalGameButton1.classList.add("hide-content");
    modalGameButton4.classList.remove("hide-content");
    modalGameButton5.classList.remove("hide-content");
}

modalGameButton5.addEventListener("click", restartGame);
// This restart the game. It's called when the user click on the *ACEPTAR* button on the Modal Game.
function restartGame() {
    modalGame.style.display = "none";
    modalGameButton1.classList.remove("hide-content");
    modalGameButton4.classList.add("hide-content");
    modalGameButton5.classList.add("hide-content");
    game.restartGame();
    console.log(game);
    game.startRound();
    renderGame();
}

helpButton.addEventListener("click", showModalHelp);
// This function shows the Modal Help that contins the instructions of the game. It's called when the user click on the *COM ES JUGA?* button on the top bar menu.
function showModalHelp() {
    modalHelp.style.display = "block";
}

modalGameButton1.addEventListener("click", nextTurn);
// This function change the current palyer and if the round is finished, shows the Modal Game with the result of the round.
function nextTurn() {
    if(game.nextPlayer()) {
        modalGame.style.display = "none";
        renderGame();
    } else {
        lastWinner = game.whoWins();
        renderGame();
        if(lastWinner.get("jackpot") === undefined){
            modalGameContent.classList.add("no-winner");
            modalGameTitle.textContent = `S'ha acabt la ronda`;
            modalGameText.textContent = `Ningú ha aconseguit el 7 i mig. Les apostes ja han estat remoneritzades. A la seguent ronda el jugador ${lastWinner.get("player").id} seguirà fent de banca.`;
        }
        else {
            modalGameContent.classList.add("game-winner");
            modalGameTitle.textContent = `El jugador ${lastWinner.get("player").id} ha guanyat la ronda!`;
            modalGameText.textContent = `Amb un total de 7,5 punts, s'emporta un pot de ${lastWinner.get("jackpot")}!`;
        }
        modalGameButton1.classList.add("hide-content");
        modalGameButton2.classList.remove("hide-content");
    }
}

modalGameButton2.addEventListener("click", restartRound);
// This function starts a new round. It's called when the user click on the *COMENÇAR UNA NOVA RONDA* button on the Modal Game.
function restartRound() {
    modalGame.style.display = "none";
    modalGameContent.classList.remove("game-winner");
    modalGameButton1.classList.remove("hide-content");
    modalGameButton2.classList.add("hide-content");
    game.restartRound(lastWinner.get("player"));

    renderGame();
}

modalGameButton3.addEventListener("click", closeModalGame);
modalGameButton4.addEventListener("click", closeModalGame);
// This function close the Modal Game.
function closeModalGame(event) {
    modalGame.style.display = "none";
    if(event.currentTarget === modalGameButton3) modalGameButton3.classList.add("hide-content");
    else {
        modalGameButton4.classList.add("hide-content");
        modalGameButton5.classList.add("hide-content");
    }
    modalGameButton1.classList.remove("hide-content");
}

modalHelpButton1.addEventListener("click", closeModalHelp);
modalHelpButton2.addEventListener("click", closeModalHelp);
// This function close the Modal Help.
function closeModalHelp() {
    modalHelp.style.display = "none";
}

deck.addEventListener("dblclick", askCard);
askCard_button.addEventListener("click", askCard);
// This function ask a card for the current player. If his hand value is gretter than 7.5, the fucntion shows the Modal Game with a message.
function askCard(){
    game.dealCard(game.currentPlayer);
    if(game.currentPlayer.handValue() > 7.5) {
        askCard_button.disabled = true;
        deck.classList.add("disabled");
        game.currentPlayer.setAllCardsVisible();
        modalGame.style.display = "block";
        if(game.isBankPlayer(game.currentPlayer)) nextTurn();
        else {
            modalGameTitle.textContent = "¡T'has pasat!"
            modalGameText.textContent = `El jugador ${game.currentPlayer.id} ha superat el 7,5. És el torn del seguent jugador.`;
        }
    }
    renderGame();
}

showCard_button.addEventListener("click", showCard);
// This function flip the card selected and show it to all players.
function showCard(){
    const card = userHand.querySelector(".selected");
    const card_content = card.querySelector(".card-content");
    const child = card_content.firstElementChild;
    game.currentPlayer.setCardVisible(child.getAttribute("suit"), Number(child.getAttribute("number")));
    card.classList.remove("selected");
    card.classList.add("visible");
    card.firstElementChild.classList.remove("flipped");
    card.removeEventListener("click", selectCard);
    this.disabled = true;
}

stand_button.addEventListener("click", stand);
// This function stand the player game and shows the Modal Game.
function stand(){
    modalGame.style.display = "block";
    if(game.isBankPlayer(game.currentPlayer)) nextTurn();
    else {
        modalGameTitle.textContent = "¡T'has plantat!"
        modalGameText.textContent = `El jugador ${game.currentPlayer.id} s'ha plantat. És el torn del seguent jugador.`;
    }
}

bet_button.addEventListener("click", bet);
// This function make a bet with the quantity introduced in the input. If the player doesn't have enough money, the function shows the Modal Game qith a message.
function bet(){
    if(game.makeBet(game.currentPlayer, current_bet.value)) {
        acumulator_bet.value = game.currentPlayer.bet;
        money_left.value = game.currentPlayer.money;
        current_bet.value = 0;
        askCard_button.disabled = false;
        deck.classList.remove("disabled");
    }
    else{
        modalGame.style.display = "block";
        modalGameTitle.textContent = "No tens prous diners!"
        modalGameText.textContent = `La teva aposta és superior als teus diners. Actualment disposes de ${game.currentPlayer.money} punts en fitxes. La teva aposta no pot superar aquesta quantitat.`;
        modalGameButton1.classList.add("hide-content");
        modalGameButton3.classList.remove("hide-content");
    }
}

// This function render the content of a Card.
const renderCardContent = (card) => {
    const div = document.createElement("div");
    const suiteIcon = document.createElement("img");
    suiteIcon.setAttribute("suit", card.suit);
    suiteIcon.setAttribute("number", card.number);
    switch (card.number) {
        case 1:
            suiteIcon.src = `./src/images/as_${card.suit}.svg`;
            div.append(suiteIcon);
            break;
        case 10:
            suiteIcon.src = `./src/images/sota_${card.suit}.svg`;
            div.append(suiteIcon);
            break;
        case 11:
            suiteIcon.src = `./src/images/cavall_${card.suit}.svg`;
            div.append(suiteIcon);
            break;
        case 12:
            suiteIcon.src = `./src/images/rei_${card.suit}.svg`;
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

// This function render the content of a Card that can only be visible.
const renderVisibleCard = (card) => {
    const li = document.createElement("li");
    li.classList.add("card");
    const div = document.createElement("div");
    div.append(renderFrontCard(card));
    li.append(div);
    return li;
}

// This function render the front face of the content of a Card.
const renderFrontCard = (card) => {
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
    return front;
}

// This function render the back face of the content of a Card.
const renderBackCard = () => {
    const back = document.createElement("div");
    const div3 = document.createElement("div");
    const img = document.createElement("img");
    img.src = "./src/images/revers.svg";
    div3.append(img);
    back.append(div3);
    back.classList.add("back");
    return back;
}

// This function render a Card of the current player. If card is visible, it only render the front face (with the card suit and number), else, it renders the two faces (the front and the back).
// If the Card is not visible, it can be flipped and selectable.
const renderUserCard = (card) => {
    const li = document.createElement("li");
    li.classList.add("card");
    const div = document.createElement("div");
    if(card.isVisible()) {
        div.append(renderFrontCard(card));
        li.classList.add("visible");
    } 
    else {
        div.append(renderFrontCard(card), renderBackCard());
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


// This function render a Card of the current player. If card is visible, it only render the front face (with the card suit and number), else, it renders the two faces (the front and the back).
const renderOponentCard = (card) => {
    if(card.isVisible()) return renderVisibleCard(card);
    else {
        const li = document.createElement("li");
        li.classList.add("card");
        const div = document.createElement("div");
        const div1 = document.createElement("div");
        const img = document.createElement("img");
        img.src = "./src/images/revers.svg";
        div1.append(img);
        div.append(div1);
        div.classList.add("hidden");
        li.append(div);
        return li;
    }
}

// This function render a the deck of the game.
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

// This function render the the game.
const renderGame = () => {
    deck.textContent = "";
    userHand.textContent = "";
    leftHand.textContent = "";
    rightHand.textContent = "";
    frontHand.textContent = "";

    if(game.currentPlayer === game.bankPlayer){
        game.currentPlayer.setAllCardsVisible();
        current_bet.disabled = true;
        bet_button.disabled = true;
        askCard_button.disabled = false;
        deck.classList.remove("disabled");
    }
    else {
        askCard_button.disabled = true;
        deck.classList.add("disabled");
        current_bet.disabled = false;
        bet_button.disabled = false;
    }

    showCard_button.disabled = true;
    userName.textContent = `Jugador: ${game.currentPlayer.id}`;
    userPoints.textContent = game.currentPlayer.handValue();
    acumulator_bet.value = game.currentPlayer.bet;
    money_left.value = game.currentPlayer.money;

    for(let i = 0; i < game.deck.cards.length; i++){
        deck.appendChild(renderDeck(game.deck.cards[i], i));
    };

    if(game.numberOfPlayers() === 2) {
        game.playersOrder[1].hand.forEach(card => {
            frontHand.appendChild(renderOponentCard(card));
        });
    }

    else if (game.numberOfPlayers() === 3) {
        game.playersOrder[1].hand.forEach(card => {
            leftHand.appendChild(renderOponentCard(card));
        });
        game.playersOrder[2].hand.forEach(card => {
            rightHand.appendChild(renderOponentCard(card));
        });
    }

    else {
        game.playersOrder[1].hand.forEach(card => {
            leftHand.appendChild(renderOponentCard(card));
        });
        game.playersOrder[2].hand.forEach(card => {
            frontHand.appendChild(renderOponentCard(card));
        });
        game.playersOrder[game.numberOfPlayers()-1].hand.forEach(card => {
            rightHand.appendChild(renderOponentCard(card));
        });

    }
    game.currentPlayer.hand.forEach(card => {
        userHand.appendChild(renderUserCard(card));
    });
}


window.onload = function() {
    let listCardAnimation = new Deck();
    listCardAnimation.shuffle();
    for(let i = 0; i < 8; i++){
        cardsAnimationList.appendChild(renderVisibleCard(listCardAnimation.cards[i]));
    }
};
