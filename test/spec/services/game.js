'use strict';

describe('Service: game', function () {

  var game;

  var theme="default";
  var difficulty=4;



  beforeEach(function() {
    game = new Game(theme,difficulty);
  });


  describe('init', function() {

    it('Should deck of 8 cards with default theme', function() {
      expect(game.deck.length).toBe(8);
      expect(game.unmatchedPairs).toBe(4);
      expect(game.message).toBe("Click on a tile.");
    });


  });

  describe('flip', function() {

    function Card(card) {
      this.title = card;
      this.flipped = false;
    }

    var cardList = ['default/card1','default/card1','default/card2','default/card2','default/card3','default/card3','default/card4','default/card4'];

    beforeEach(function() {
      //All this part is a trick for have card in right order because there is a shuffle normally

      function compare (a, b) {
        if (a.title > b.title)
          return 1;
        if (a.title < b.title)
          return -1;
        // a doit être égale à b
        return 0;
      }

      game.deck.sort(compare);

    });


    it('should set the flipped flag on the tile being flipped', function() {
      expect(game.deck[0].flipped).toBe(false);
      game.flipTile(game.deck[0]);
      expect(game.deck[0].flipped).toBe(true);
    });


    it('Two card flipped after one card flipped and the other two card are not flipped', function() {
      game.flipTile(game.deck[0]);
      game.flipTile(game.deck[2]);
      expect(game.deck[0].flipped).toBe(true);
      expect(game.deck[2].flipped).toBe(true);
      expect(game.deck[1].flipped).toBe(false);

      game.flipTile(game.deck[1]);
      expect(game.deck[0].flipped).toBe(false);
      expect(game.deck[2].flipped).toBe(false);
      expect(game.deck[1].flipped).toBe(true);
      expect(game.unmatchedPairs).toBe(4);
    });


    it('Two card flipped match and after two other card flipped matched and all cards are flipped', function() {
      game.flipTile(game.deck[0]);
      game.flipTile(game.deck[1]);
      expect(game.deck[0].flipped).toBe(true);
      expect(game.deck[1].flipped).toBe(true);
      expect(game.deck[2].flipped).toBe(false);
      expect(game.deck[3].flipped).toBe(false);
      expect(game.unmatchedPairs).toBe(3);

      game.flipTile(game.deck[2]);
      game.flipTile(game.deck[3]);
      expect(game.deck[0].flipped).toBe(true);
      expect(game.deck[1].flipped).toBe(true);
      expect(game.deck[2].flipped).toBe(true);
      expect(game.deck[3].flipped).toBe(true);
      expect(game.unmatchedPairs).toBe(2);
    });


    it('Test message', function() {
      expect(game.message).toBe(Game.MESSAGE_CLICK);

      game.flipTile(game.deck[0]);
      expect(game.message).toBe(Game.MESSAGE_ONE_MORE);

      game.flipTile(game.deck[3]);
      expect(game.message).toBe(Game.MESSAGE_MISS);

      game.flipTile(game.deck[1]);
      expect(game.message).toBe(Game.MESSAGE_ONE_MORE);

      game.flipTile(game.deck[0]);
      expect(game.message).toBe(Game.MESSAGE_MATCH);

      game.flipTile(game.deck[3]);
      expect(game.message).toBe(Game.MESSAGE_ONE_MORE);

      game.flipTile(game.deck[2]);
      expect(game.message).toBe(Game.MESSAGE_MATCH);
    });



    });


});
