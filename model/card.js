export class Card {
    constructor(suit, value){
        this._suit = suit;
        this._value = value;
    }

    get suit() {
        return this._suit;
    }

    set suit(suit) {
        this._suit = suit;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
}