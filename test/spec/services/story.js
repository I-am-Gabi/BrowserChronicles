'use strict';
describe('Service: story', function () {

    // load the service's module
    beforeEach(module('chroniclesApp'));
    // instantiate service
    var story;
    var xml = '<?xml version="1.0"?><story xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="story.xsd" title="example story">' +
            '<init>Story n°=0</init><step id="BEGIN" type="multiChoice">' +
            '<title>Which into the mountain</title>' +
            '<description>After an exhausting encounter with a bugbear, four travelling heroes are grateful' +
            ' to find a small town nestled in the unfamiliar hills. Their relief quickly turns' +
            ' to suspicion, however, when they find the town of Murkshire uninhabited—at least by the living.' +
            ' Do you want to go to the city?' +
            '</description><possibility><choice nextStep="s1">No</choice><choice nextStep="s2">Yes</choice>' +
            '</possibility></step>' +
            '<step id="s1" type="riddle">' +
            '<title>Enigme du sorcier</title><description>Voici une enigme : Combien font 2 + 3</description>' +
            '<maxTry>4</maxTry> <hint>Utilise tes doigts</hint><possibility><choice nextStep="s2">5</choice>' +
            '<choice nextStep="s3">8</choice> </possibility>' +
            '</step><step id="s2" type="memory">' +
            '<theme>Pirate</theme><difficulty>5</difficulty><description>Cherche les paires</description>' +
            '<nextStep value="s3"/></step><step id="s3" type="multiChoice"><title>Sorcier sur la montagne</title>' +
            '<description><![CDATA[<p>So you chose to go to the city of Murkshire.' +
            'The town is little more than ten or twelve buildings scattered on either side of the weedy road.' +
            'You can see a graveyard, then an abandoned camp, then finally a cave. BUT, WAIT!' +
            'What is that? <b>Wraiths</b>, possessed animals and beasts they begin to emerge from the dark places of cite.' +
            'Then you progress further into the cave, however, you can see more human enemies... Necromancers come in your ' +
            'direction.</p><img src="https://d3b4yo2b5lbfy.cloudfront.net/wp-description/uploads/wallpapers/GW2_HumanNecromancer-1280x720.jpg" height="400"/>]]></description><possibility><choice nextStep="s1">Go to the graveyard</choice>' +
            '<choice nextStep="s5">Run to the mountains!</choice></possibility>' +
            '</step><step id="s4" type="end"><description>Tu as perdu</description><win value="false"/>' +
            '</step><step id="s5" type="end"><description>Tu as gagné</description><win value="true"/>' +
            '</step></story>';

    beforeEach(inject(function (_story_) {
        story = _story_;
        story.parseXML(xml);
    }));
    it('should parse xml to get standard infos', function () {
        expect(story.nbSteps).toBe(6);
        expect(story.steps['BEGIN'].type).toBe("multiChoice");
        expect(story.steps['BEGIN'].title).toBe("Which into the mountain");
        expect(story.steps['BEGIN'].description).toBe("After an exhausting encounter with a bugbear, four travelling heroes are grateful to find a small town nestled in the unfamiliar hills. Their relief quickly turns to suspicion, however, when they find the town of Murkshire uninhabited—at least by the living. Do you want to go to the city?");
        expect(story.steps['s5'].type).toBe("end");
        expect(story.steps['s5'].title).toBe(undefined);
        expect(story.steps['s5'].description).toBe("Tu as gagné");
    });

    it('should correctly retrieve HTML formatted description', function () {
        expect(story.steps['s3'].description).toBe('<p>So you chose to go to the city of Murkshire.The town is little more than ten or twelve buildings scattered on either side of the weedy road.You can see a graveyard, then an abandoned camp, then finally a cave. BUT, WAIT!What is that? <b>Wraiths</b>, possessed animals and beasts they begin to emerge from the dark places of cite.Then you progress further into the cave, however, you can see more human enemies... Necromancers come in your direction.</p><img src="https://d3b4yo2b5lbfy.cloudfront.net/wp-description/uploads/wallpapers/GW2_HumanNecromancer-1280x720.jpg" height="400"/>');
    });

    it('should parse xml to get infos for multiChoices', function () {
        expect(story.steps['BEGIN'].next).toEqual({"No": "s1", 'Yes': "s2"});
    });

    it('should parse xml to get infos for riddles', function () {
        expect(story.steps['s1'].next).toEqual({'5': 's2', '8': 's3'});
        expect(story.steps['s1'].hint).toBe("Utilise tes doigts");
    });

    it('should parse xml to get infos for end', function () {
        expect(story.steps['s4'].type).toBe("end");
        expect(story.steps['s4'].won).toBe(false);
        expect(story.steps['s5'].won).toBe(true);
    });

    it('should parse xml to get infos for memory', function () {
        expect(story.steps['s2'].type).toBe("memory");
        expect(story.steps['s2'].theme).toBe("Pirate");
        expect(story.steps['s2'].difficulty).toBe(5);
        expect(story.steps['s2'].next).toEqual({next: "s3"});
    });

    it('sould collect steps of one type', function () {
        expect(Object.keys(story.getStepsOfType("multiChoice"))).toEqual(['BEGIN', 's3']);
        expect(Object.keys(story.getStepsOfType("nothing"))).toEqual([]);
        expect(Object.keys(story.getStepsOfType("riddle"))).toEqual(['s1']);
    });

    it('should have a start and a happy ending', function () {
        expect(story.isValid).toBe(true);
    });


    it('should return an empty array when there is no winning node', function () {
        story.create("test story");
        expect(story.shortestPath.length).toBe(0);
    });

    it('should be able to compute shortest path from BEGIN to winning end', function () {
        expect(story.shortestPath).toEqual(['s5', 's3', 's1', 'BEGIN']);
    });
});
