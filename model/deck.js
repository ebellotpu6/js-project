import { Card } from "./card";

const Suits = ["oros","copes","espases","bastos"];
const Values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export class Deck {
    constructor(cards = freshDeck()){
        this._cards = cards;

    }

    get cards() {
        return this._cards;
    }

    set cards(cards) {
        this._cards = cards;
    }

    get numberOfCards() {
        return this._cards.length;
    }

    shuffle(){
        for(let i = this.numberOfCards - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1));
            const oldValue = this._cards[newIndex];
            this._cards[newIndex] = this._cards[i];
            this._cards[i] = oldValue;
        }
    }
}

//Function that creates a new Deck of cards.
function freshDeck() {
    return Suits.flatMap(suit => {
        return Values.map(value => {
            return new Card(suit, value)
        });
    });
}