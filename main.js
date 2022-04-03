import { Deck } from "./model/deck";
import { Hand } from "./model/hand";
import { Card } from "./model/card";


const bastos = document.createElementNS("./src/images/oros.svg", "svg");
const espases = document.createElementNS("./src/images/oros.svg", "svg");
const copes = document.createElementNS("./src/images/oros.svg", "svg");

const deck = new Deck();

const cardsList = document.getElementById("cards_list");

const renderCard = (card) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.setAttribute("suit", card.suit);
    if(card.suit === "bastos") {
        const borderDiv = document.createElement("div");
        borderDiv.classList.add("card-border");
        div.append(borderDiv);
    }
    const suiteIcon = document.createElement("img");
    suiteIcon.src = `./src/images/${card.suit}.svg`;

    const spanTop = document.createElement("span");
    spanTop.textContent = card.value;

    const divMiddle = document.createElement("div");
    divMiddle.append(suiteIcon);
    divMiddle.classList.add("card-content")

    const spanBottom = document.createElement("span");
    spanBottom.textContent = card.value;

    div.append(spanTop, divMiddle, spanBottom);
    li.append(div);
    li.classList.add("card");
    return li;
}

const render = () => {
    deck.shuffle();
    cardsList.textContent = ""; //Borra interior del cardsList
    deck.cards.forEach(card => {
        cardsList.appendChild(renderCard(card));
    });
}

window.onload = function() {
    render();
};




