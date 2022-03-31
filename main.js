import { Deck } from "./model/deck";
import { Hand } from "./model/hand";
import { Card } from "./model/card";

const deck = new Deck();
deck.shuffle();
console.log(deck);



