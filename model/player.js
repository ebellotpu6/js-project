export class Player {
    constructor(id){
        this._id = id;
        this._hand = [];
        this._money = 0;
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

    dealCard(card) {
        this._hand.push(card);
    }
}