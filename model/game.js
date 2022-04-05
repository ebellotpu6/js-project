import { Deck } from "./deck";
import { Player } from "./player";

export class Game {
    constructor(deck, players){
        this._deck = deck;
        this._players = players;
    }

    get deck() {
        return this._deck;
    }

    set deck(deck) {
        this._deck = deck;
    }

    get players() {
        return this._players;
    }

    set players(players) {
        this._players = players;
    }

    get numberOfPlayers() {
        return this._players.length;
    }

    startGame(){
        this._deck.shuffle();
        this._players.forEach(player => {
            console.log(player);
            player.dealCard(this._deck.cards.pop());
        });
    }
}