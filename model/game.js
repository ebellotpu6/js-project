import { Deck } from "./deck";
import { Player } from "./player";

export class Game {
    constructor(numPlayers, money){
        this._deck = new Deck();
        this._players = [];
        for (let i = 1; i <= numPlayers; i++) {
            this._players.push(new Player(i, money));
        }
        this._playersOrder = this._players;
        this._bankPlayer = this._players[numPlayers - 1];
        this._currentPlayer = this._players[0];
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

    get playersOrder() {
        return this._playersOrder;
    }

    set playersOrder(playersOrder) {
        this._playersOrder = playersOrder;
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

    isBankPlayer(player) {
        return player === this._bankPlayer;
    }

    restartGame(){
        this._deck = new Deck();
        this._players.forEach(player => {
            player.hand = [];
            player.bet = 0;
        });
        this._playersOrder = this._players;
        this._bankPlayer = this._players[this.numberOfPlayers() - 1];
        this._currentPlayer = this._players[0];
    }

    startRound(){
        this._deck.shuffle();
        this._playersOrder.forEach(player => {
            player.dealCard(this.isBankPlayer(player), this._deck.cards.pop());
        });
    }

    restartRound(lastWinner){
        this._deck = new Deck();
        let lastWinnerIndex;
        this._bankPlayer = lastWinner;
        lastWinnerIndex = this._playersOrder.indexOf(lastWinner);
        this._playersOrder = this.restoreOrder(lastWinnerIndex);
        this._currentPlayer = this._playersOrder[0];
        this._players.forEach(player => {
            player.hand = [];
            player.bet = 0;
        });
        this.startRound();
    }

    restoreOrder(index){
        return this._playersOrder.slice(index+1).concat(this._playersOrder.slice(0, index+1));
    }

    dealCard(player){
        if(this.isBankPlayer(player)){
            player.dealCard(true, this._deck.cards.pop());
            return true;
        }
        else {
            if(player.bet === 0) return false;
            else {
                player.dealCard(false, this._deck.cards.pop());
                return true;
            }
        } 
    }

    makeBet(player, bet){
        if(this.isBankPlayer(player)) return false;
        else{
            const current_bet = Number(bet);
            return player.makeBet(current_bet);
        }
    }

    nextPlayer(){
        if(this.isBankPlayer(this._currentPlayer)) return false;
        else {
            this._playersOrder.splice(this.numberOfPlayers()-1, 0, this._playersOrder.splice(0, 1)[0]);
            this._currentPlayer = this._playersOrder[0];
            return true;
        }
    }

    whoWins(){
        const winner = new Map();
        winner.set("player", this._bankPlayer);
        let bankPlayer_handValue = this._bankPlayer.handValue();
        if(bankPlayer_handValue === 7.5) {
            let jackpot = 0;
            this._players.forEach(player => {
                jackpot += player.bet;
                this._bankPlayer.earnMoney(player.bet);
            });
            winner.set("jackpot", jackpot);
        }
        else if (bankPlayer_handValue > 7.5){
            this._players.forEach(player => {
                let playerHandValue = player.handValue();
                if(playerHandValue === 7.5){
                    winner.set("player", player);
                    winner.set("jackpot", 2*player.bet);
                    player.earnMoney(3*player.bet);
                    this._bankPlayer.loseMoney(2*player.bet);
                } 
                else if (playerHandValue < 7.5){
                    player.earnMoney(2*player.bet);
                    this._bankPlayer.loseMoney(player.bet);                    
                }
                else {
                    player.earnMoney(player.bet);
                }
            });
        }
        else {
            this._players.forEach(player => {
                let playerHandValue = player.handValue();
                if(playerHandValue <= 7.5 && playerHandValue > bankPlayer_handValue){
                    if(playerHandValue === 7.5){
                        winner.set("player", player);
                        winner.set("jackpot", 2*player.bet);
                        player.earnMoney(3*player.bet);
                        this._bankPlayer.loseMoney(2*player.bet);
                    } 
                    else {
                        player.earnMoney(2*player.bet);
                        this._bankPlayer.loseMoney(player.bet);  
                    }
                }
                else {
                    this._bankPlayer.earnMoney(player.bet);
                }
            });
        }
        return winner;
    }
}