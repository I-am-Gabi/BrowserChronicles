'use strict';

describe('Controller: PlayctrlCtrl', function () {
    // load the controller's module
    beforeEach(module('chroniclesApp'));
    var PlayctrlCtrl,
            scope;
    var controller;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller;
        PlayctrlCtrl = $controller('PlayCtrl', {
            $scope: scope
        });
    }));

    describe("with route /play/test", function () {
        beforeEach(function () {
            controller('PlayCtrl', {$scope: scope, $routeParams: {story: "test"}});
        });
        it('should get a story from the server', inject(function ($location, $httpBackend) {
            $httpBackend.whenRoute('GET', '/stories/:story')
                    .respond(function (method, url, data, headers, params) {
                        return [200, '<story  title="test story"><init></init><step id="1" type="multiChoice">' +
                                    '<title>Sorcier sur la montagne</title>' +
                                    '<description>Votre quête commence maintenant. De l\'autre côté de la clairière, il y a l\'entrée d\'une caverne sombre. Vous ramassez votre épée, vous vous relevez et vous pensez à tous les dangers qui vous attendent. Puis, avec détermination, vous remettez l\'épée dans son fourreau et vous vous avancez vers l\'entrée de la caverne. Vous jetez un coup d\'œil dans les ténèbres et vous apercevez des parois suintantes et sombres ainsi que des flaques d\'eau sur le sol de pierre. L\'air est froid et humide. Vous allumez votre lanterne et vous faites prudemment quelques pas dans l\'obscurité. Des toiles d\'araignées vous balaient le visage et vous entendez le bruit que font sur le sol des pattes minuscules ; ce sont probablement des rats qui prennent la fuite. Vous entrez dans la caverne. Après avoir parcouru quelques mètres, vous arrivez à une bifurcation.</description>' +
                                    '<possibility><choice nextStep="2">Irez-vous vers l\'ouest ?</choice>' +
                                    '<choice nextStep="6">Irez-vous vers l\'est ?</choice></possibility></step>;'];
                    });
            $httpBackend.expectGET('/stories/test.xml');
            $location.path("/play/test");
            $httpBackend.flush();
        }));
    });
});
