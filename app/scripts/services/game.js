'use strict';

/**
 * @ngdoc service
 * @name chroniclesApp.game
 * @description Describe model of memory game
 * Inspired by https://github.com/IgorMinar/Memory-Game
 * # game
 * Factory in the chroniclesApp.
 */



Game.MESSAGE_CLICK = 'Click on a tile.';
Game.MESSAGE_ONE_MORE = 'Pick one more card.';
Game.MESSAGE_MISS = 'Try again.';
Game.MESSAGE_MATCH = 'Good job! Keep going.';
Game.MESSAGE_WON = 'You win !';

var cardNames = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6',
    'card7', 'card8'];

function Game(theme,difficulty) {

    //Function for start or restart a new Game
    this.reset=function (theme,difficulty) {
        var sliceDeck;
        if(difficulty<=8)
            sliceDeck=cardNames.slice(0, difficulty);
        else
            sliceDeck=multiplyArray(cardNames,difficulty);

        this.deck = makeDeck(sliceDeck,theme);
        this.message = Game.MESSAGE_CLICK;
        this.unmatchedPairs = difficulty;
    };

    //Initialization
    this.reset(theme,difficulty);

    //Whent we flip a card
    this.flipTile = function(card) {

        //If card is already return
        if (card.flipped) {
            return;
        }

        //We return card
        card.flip();

        //If they have only one card return
        if (!this.firstPick || this.secondPick) {

          //If two card are returned but not the same
            if (this.secondPick) {
                this.firstPick.flip();
                this.secondPick.flip();
                this.firstPick = this.secondPick = undefined;
            }

            this.firstPick = card;
            this.message = Game.MESSAGE_ONE_MORE;

        }
        else {//If they have two card return
            if (this.firstPick.title === card.title) {
                this.unmatchedPairs--;
                this.message = this.unmatchedPairs > 0 ? Game.MESSAGE_MATCH : Game.MESSAGE_WON;
                this.firstPick = this.secondPick = undefined;

            } else {
                this.secondPick = card;
                this.message = Game.MESSAGE_MISS;
            }
        }
    };



    /**
     * Define card
     * @param card
     * @constructor
     */
    function Card(card) {
        this.title = card;
        this.flipped = false;
    }

    /**
     * Change the state flip of card
     */
    Card.prototype.flip = function() {
        this.flipped = !this.flipped;
    };

    /**
     * Take a table of card and return a table with
     * size of difficulty with more card.
     * @param cardNames
     * @param difficulty
     * @returns table withe table.length=difficulty
     */
    function multiplyArray(cardNames,difficulty) {
        var i=0;
        while(cardNames.length!==parseInt(difficulty)){
            cardNames.push(cardNames[i]);
            i++;
        }
        return cardNames;
    }

    /**
     *
     * Construct deck with theme of card
     * @param cardNames
     * @param theme
     * @returns deck
     */
    function makeDeck(cardNames,theme) {
        var deck = [];
        cardNames.forEach(function(name) {
            deck.push(new Card(theme+'/'+name));
            deck.push(new Card(theme+'/'+name));
        });

        shuffle(deck);
        return deck;
    }


  /**
   * Shuffles array in place.
   * @param {Array} a items The array containing the items.
   */
  function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }
}

angular.module('chroniclesApp').service('game', function(){
    this.service1 = function(theme,difficulty) {
        return new Game(theme,difficulty);
    }
});

