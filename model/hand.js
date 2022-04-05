import { Card } from "./card";
export class Hand {
    constructor(player, cards){
        this._player = player_id;
        this._cards = cards;
    }

    get player() {
        return this._player;
    }

    set player(player) {
        this._player = player;
    }

    get cards() {
        return this._cards;
    }

    set cards(cards) {
        this._cards = cards;
    }

    get handValue() {
        totalValue = 0;
        this._cards.forEach(card => {
            totalValue += card.value;
        });
        return totalValue;
    }
}