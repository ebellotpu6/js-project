import { Game } from "./model/game";
import { Player } from "./model/player";
import { Deck } from "./model/deck";
import { Hand } from "./model/hand";
import { Card } from "./model/card";


const bastos = document.createElementNS("./src/images/oros.svg", "svg");
const espases = document.createElementNS("./src/images/oros.svg", "svg");
const copes = document.createElementNS("./src/images/oros.svg", "svg");

const player1 = new Player(1);
const player2 = new Player(2);
const player3 = new Player(3);
const player4 = new Player(4);
const game = new Game(new Deck(), [player1, player2, player3, player4]);
console.log(game.deck);
console.log(game.players);

game.startGame();
console.log(game.deck);
console.log(game.players);

const cardsList = document.getElementById("cards_list");

const renderCardContent = (card) => {
    const div = document.createElement("div");
    const suiteIcon = document.createElement("img");
    switch (card.value) {
        case 1:
            suiteIcon.src = `./src/images/as_${card.suit}.svg`;
            suiteIcon.setAttribute("suit", card.suit);
            suiteIcon.setAttribute("value", card.value);
            div.append(suiteIcon);
            break;
        case 10:
            suiteIcon.src = `./src/images/sota_${card.suit}.svg`;
            suiteIcon.setAttribute("suit", card.suit);
            suiteIcon.setAttribute("value", card.value);
            div.append(suiteIcon);
            break;
        case 11:
            suiteIcon.src = `./src/images/cavall_${card.suit}.svg`;
            suiteIcon.setAttribute("suit", card.suit);
            suiteIcon.setAttribute("value", card.value);
            div.append(suiteIcon);
            break;
        case 12:
            suiteIcon.src = `./src/images/rei_${card.suit}.svg`;
            suiteIcon.setAttribute("suit", card.suit);
            suiteIcon.setAttribute("value", card.value);
            div.append(suiteIcon);
            break;
        default:
            for(let i = 0; i < card.value; ++i) {
                const suiteIcon = document.createElement("img");
                suiteIcon.src = `./src/images/${card.suit}.svg`;
                suiteIcon.setAttribute("suit", card.suit);
                suiteIcon.setAttribute("value", card.value);
                div.append(suiteIcon);
            }
            break;

    }
    div.setAttribute("suit", card.suit);
    div.setAttribute("value", card.value);
    return div;
}

const renderCard = (card) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.setAttribute("suit", card.suit);
    if(card.suit === "bastos") {
        const borderDiv = document.createElement("div");
        borderDiv.classList.add("card-border");
        div.append(borderDiv);
    }

    const spanTop = document.createElement("span");
    spanTop.textContent = card.value;

    const divMiddle = document.createElement("div");
    divMiddle.append(renderCardContent(card));
    divMiddle.classList.add("card-content")

    const spanBottom = document.createElement("span");
    spanBottom.textContent = card.value;

    div.append(spanTop, divMiddle, spanBottom);
    li.append(div);
    li.classList.add("card");
    return li;
}

const render = () => {
    cardsList.textContent = ""; //Borra interior del cardsList
    player2.hand.forEach(card => {
        cardsList.appendChild(renderCard(card));
    });
}

window.onload = function() {
    render();
};




