export class Player {
    constructor(id, money){
        this._id = id;
        this._hand = [];
        this._money = money;
        this._bet = 0;
    }

    get id() {
        return this._id;
    }

    get hand() {
        return this._hand;
    }

    set hand(hand) {
        this._hand = hand;
    }

    get money() {
        return this._money;
    }

    set money(money) {
        this._money = money;
    }

    get bet() {
        return this._bet;
    }

    set bet(bet) {
        this._bet = bet;
    }

    //Pedir carta
    dealCard(card) {
        if(this.hasHiddenCard()){
            card.visible = true;
        }
        this._hand.push(card);
    }

    handValue() {
        let totalValue = 0;
        this._hand.forEach(card => {
            totalValue += card.value;
        });
        return totalValue;
    }

    hasHiddenCard() {
        let b = false;
        this._hand.forEach((card) => {
            if(!card.isVisible()) {
                b = true;
            }
        });
        return b;
    }

    setCardVisible(suit, number) {
        this._hand.find(card => card.suit === suit && card.number === number).visible = true;
    }

    setAllCardsVisible() {
        this._hand.forEach((card) => {
            card.visible = true;
        });
    }

    makeBet(bet) {
        if(bet > this._money) return false;
        else {
            this._bet += bet;
            this._money -= bet;
            return true;
        }
    }

    
}