import { Game } from "./model/game";

const bastos = document.createElementNS("./src/images/oros.svg", "svg");
const espases = document.createElementNS("./src/images/oros.svg", "svg");
const copes = document.createElementNS("./src/images/oros.svg", "svg");

let game, lastWinner;

const initScreen = document.getElementById("initScreen");
const numPlayers = document.getElementById("numPlayers");
const playerMoney = document.getElementById("playerMoney");
const startGameButton = initScreen.querySelector("#startGameButton");

const restartGameButton = document.getElementById("restartGameButton");
const helpButton = document.getElementById("helpButton");

const scene = document.getElementById("scene");

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
const modalHelpContent = modalHelp.querySelector(".modal-content");
const modalHelpButton1 = modalHelp.querySelector("#modalButton6");
const modalHelpButton2 = modalHelp.querySelector("#modalButton7");

const deck = document.getElementById("deck");
const userHand = document.getElementById("user_hand");
const leftHand = document.getElementById("left_player_hand");
const rightHand = document.getElementById("right_player_hand");
const frontHand = document.getElementById("front_player_hand");

startGameButton.addEventListener("click", startGame);

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

function showModalRestartGame() {
    modalGame.style.display = "block";
    modalGameTitle.textContent = "Reiniciar la partida?"
    modalGameText.textContent = `Estàs segur que vols reiniciar la partida?`;
    modalGameButton1.classList.add("hide-content");
    modalGameButton4.classList.remove("hide-content");
    modalGameButton5.classList.remove("hide-content");
}

helpButton.addEventListener("click", showModalHelp);

function showModalHelp() {
    modalHelp.style.display = "block";
}

modalGameButton1.addEventListener("click", nextTorn);

function nextTorn() {
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

function closeModalHelp() {
    modalHelp.style.display = "none";
}

modalGameButton5.addEventListener("click", restartGame);

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

const askCard_button = document.getElementById("askCard_button");
const showCard_button = document.getElementById("showCard_button");
const userPoints = document.getElementById("user_points");
const userName = document.getElementById("user_name");
const stand_button = document.getElementById("stand_button");
const acumulator_bet = document.getElementById("acumulator_bet");
const money_left = document.getElementById("money_left");
const current_bet = document.getElementById("current_bet");
const bet_button = document.getElementById("bet_button");

deck.addEventListener("dblclick", askCard);

askCard_button.addEventListener("click", askCard);

function askCard(){
    game.dealCard(game.currentPlayer);
    if(game.currentPlayer.handValue() > 7.5) {
        askCard_button.disabled = true;
        deck.classList.add("disabled");
        game.currentPlayer.setAllCardsVisible();
        modalGame.style.display = "block";
        if(game.isBankPlayer(game.currentPlayer)) nextTorn();
        else {
            modalGameTitle.textContent = "¡T'has pasat!"
            modalGameText.textContent = `El jugador ${game.currentPlayer.id} ha superat el 7,5. És el torn del seguent jugador.`;
        }
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
    modalGame.style.display = "block";
    if(game.isBankPlayer(game.currentPlayer)) nextTorn();
    else {
        modalGameTitle.textContent = "¡T'has plantat!"
        modalGameText.textContent = `El jugador ${game.currentPlayer.id} s'ha plantat. És el torn del seguent jugador.`;
    }
}

bet_button.addEventListener("click", bet);

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




