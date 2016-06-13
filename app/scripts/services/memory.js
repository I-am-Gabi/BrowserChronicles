'use strict';

/**
 * @ngdoc service
 * @name chroniclesApp.memory
 * @description
 * # memory
 * Service in the chroniclesApp.
 */
angular.module('chroniclesApp')
        .run(['stepTypeHandlers', function (stepTypeHandlers) {
                /**
                 * Add the following attributes to the step:
                 *  -theme: a string representing the theme of the memory
                 *  -difficulty: the amount of pair in the memory
                 *  -next: the if of the next step
                 */
                stepTypeHandlers.memory = function (step, element) {
                    // Init the step
                    if (step.theme === undefined)
                        step.theme = 'default';

                    switch (element.nodeName) {
                        case "theme":
                            step.theme = element.textContent;
                            break;
                        case "difficulty":
                            step.difficulty = element.textContent * 1;
                            break;
                        case "nextStep":
                            step.next = {
                                next: element.attributes["value"].value
                            };
                            break;
                        default:
                            return false;
                    }
                    return true;
                };
            }])
        .run(['stepSaveXml', function (stepSaveXml) {
                stepSaveXml.memory = function (step) {
                    var arrayXML = [];

                    Object.keys(step).forEach(function (key, index) {
                        switch (key) {
                            case "theme":
                                arrayXML.push("<theme>" + step.theme + "</theme>");
                                break;
                            case "difficulty":
                                arrayXML.push("<difficulty>" + step.difficulty + "</difficulty>");
                                break;
                            case "next":
                                arrayXML.push("<nextStep value=\"" + step.next.next + "\"/>");
                                break;
                            default:
                                break;
                        }
                    });
                    return arrayXML;
                };
            }])
        .service('memory', ['game', function (game) {
                return{
                    template: 'views/memory.html',
                    templateEdit: 'views/steps/memory-edit.html',
                    next: function () {
                        return this.game.unmatchedPairs === 0 ? this.nextStep : undefined;
                    },
                    avaiableThemes: ['default', 'fruit', 'prof'],
                    handleStep: function (step) {
                        this.game = game.service1(step.theme, step.difficulty);
                        this.game.reset(step.theme, step.difficulty);
                        this.theme = step.theme;
                        this.nextStep = step.next.next;
                    },
                    setNext: function (step, stepId) {
                        if (step.next === undefined)
                            step.next = {};
                        step.next.next = stepId;
                    }
                };
            }]);
