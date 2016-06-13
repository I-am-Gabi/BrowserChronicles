'use strict';
/**
 * @ngdoc function
 * @name chroniclesApp.controller:MultichoiceCtrl
 * @description
 * # MultichoiceCtrl
 * Controller of the chroniclesApp
 */
angular.module('chroniclesApp')
        .run(['stepTypeHandlers', function (stepTypeHandlers) {
                /**
                 * Add the following attributes to the step:
                 *  -next: An object containing the next step is as key, and a
                 *         short descriptive text as value.
                 *  -nbChoices: The amount of avaiable choices.
                 */
                stepTypeHandlers.multiChoice = function (step, element) {
                    if (element.nodeName !== "possibility")
                        return false;
                    element = element.firstElementChild;
                    step.next = {};
                    while (element !== null) {
                        step.next[element.textContent] = element.attributes["nextStep"].value;
                        element = element.nextElementSibling;
                    }
                    return true;
                };
            }])
        .run(['stepSaveXml', function (stepSaveXml) {
                stepSaveXml.multiChoice = function (step) {
                    var arrayXML = [];

                    var possibility = "";
                    Object.keys(step).forEach(function (key, index) {
                        switch (key) {
                            case "next":
                                for (var nextStep in step.next) {
                                    possibility += "<choice nextStep=\"" + step.next[nextStep] + "\">" + nextStep + "</choice>";
                                }
                                arrayXML.push("<possibility>" + possibility + "</possibility>");
                                break;
                            default:
                                break;
                        }
                    });

                    return arrayXML;
                };
            }])
        .service('multiChoice', function () {
            return{
                template: 'views/multichoice.html',
                templateEdit: 'views/steps/multichoice-edit.html',
                next: undefined,
                opts: {},
                handleStep: function (step) {
                    if (Object.keys(step.next).length > 1) {
                        this.opts = step.next;
                        delete this.next;
                    } else {
                        var key = Object.keys(step.next)[0];
                        this.next = step.next[key];
                        delete this.opts;
                    }
                },
                removeNext: function (step, id) {
                    delete step.next[id];
                },
                addOption: function (step, id, text) {
                    step.next[text] = id;
                }
            };
        });
