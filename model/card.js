export class Card {
    constructor(suit, number){
        this._suit = suit;
        this._number = number;
        if(number >= 10) this._value = 0.5;
        else this._value = number;
        this._visible = false;
    }

    get suit() {
        return this._suit;
    }

    set suit(suit) {
        this._suit = suit;
    }

    get number() {
        return this._number;
    }

    set number(number) {
        this._number = number;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    isVisible() {
        return this._visible;
    }

    set visible(visibility) {
        this._visible = visibility;
    }
}