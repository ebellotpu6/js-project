import { Deck } from "./deck";
import { Player } from "./player";

export class Game {
    constructor(numPlayers, money){
        this._deck = new Deck();
        this._players = [];
        for (let i = 0; i < numPlayers; i++) {
            this._players.push(new Player(i, money));
        }
        this._playersOrder = this._players;
        this._bankPlayer = this._players[numPlayers - 1];
        this._currentPlayer = this._players[0];
        this._jackpot = 0;
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

    get bankPlayer() {
        return this._bankPlayer;
    }

    set bankPlayer(player) {
        this._bankPlayer = player;
    }

    get currentPlayer() {
        return this._currentPlayer;
    }

    set currentPlayer(player) {
        this._currentPlayer = player;
    }

    numberOfPlayers() {
        return this._players.length;
    }

    startRound(){
        this._deck.shuffle();
        this._playersOrder.forEach(player => {
            console.log(player);
            player.dealCard(this._deck.cards.pop());
        });
    }

    restartRound(){
        this._deck = new Deck();
        this._jackpot = 0;
        this._players.forEach(player => {
            player.hand = [];
            player.bet = 0;
        });
        this.startRound();
    }

    dealCard(player){
        if(player.bet === 0) return false;
        else {
            player.dealCard(this._deck.cards.pop());
            return true;
        }
    }

    makeBet(player, bet){
        const current_bet = Number(bet);
        if(player.makeBet(current_bet)) {
            this._jackpot += current_bet;
            return true;
        }
        else return false;
    }

    nextPlayer(){
        if(this.currentPlayer === this._bankPlayer){
            let winner = this.whoWins();
            alert(`The player ${winner.id} wins the game with ${winner.handValue()}. He has won ${this._jackpot}!!!`);
            winner.money += this._jackpot;
            this._bankPlayer = winner;
            this.restartRound();
        } 
        else {
            console.log("next player is...");
            this._playersOrder.splice(this.numberOfPlayers()-1, 0, this._playersOrder.splice(0, 1)[0]);
            this._currentPlayer = this._playersOrder[0];
            console.log(this._currentPlayer);
        }
    }

    whoWins(){
        let winner;
        let maxPoints = 0;
        this._players.forEach(player => {
            let playerHandValue = player.handValue();
            console.log("current player: "+playerHandValue);
            console.log("current maxPoints: "+maxPoints);
            if(playerHandValue <= 7.5 && playerHandValue > maxPoints){
                winner = player;
                maxPoints = playerHandValue;
            }
        });
        return winner;
    }
}