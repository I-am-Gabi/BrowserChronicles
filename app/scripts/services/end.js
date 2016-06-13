'use strict';

/**
 * @ngdoc service
 * @name chroniclesApp.end
 * @description
 * # end
 * Service in the chroniclesApp.
 */
angular.module('chroniclesApp')
        .run(['stepTypeHandlers', function (stepTypeHandlers) {
                /**
                 * Add the following attribute to the step:
                 *  -won: true if the endding is a win, false otherwise
                 */
                stepTypeHandlers.end = function (step, element) {
                    if (element.nodeName !== "win")
                        return false;
                    step.won = element.attributes["value"].value === "false" ? false : true;
                    return true;
                };
            }])

        .run(['stepSaveXml', function (stepSaveXml) {
                stepSaveXml.end = function (step) {
                    var arrayXML = [];

                    Object.keys(step).forEach(function (key, index) {
                        switch (key) {
                            case "won":
                                if (step.won === false)
                                    arrayXML.push("<win value=\"false\"/>");
                                else
                                    arrayXML.push("<win value=\"true\"/>");
                                break;
                            default:
                                break;
                        }
                    });

                    return arrayXML;
                }

            }])

        .service('end', function () {
            return{
                template: 'views/end.html',
                templateEdit: 'views/steps/end-edit.html',
                next: undefined,
                disableNextButton: true,
                handleStep: function (step) {}
            };
        });
