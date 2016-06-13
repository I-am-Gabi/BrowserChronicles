'use strict';
/**
 * @ngdoc service
 * @name chroniclesApp.riddle
 * @description
 * # riddle
 * Service in the chroniclesApp.
 */
angular.module('chroniclesApp')
        .run(['stepTypeHandlers', function (stepTypeHandlers) {
                /**
                 * Add the following attributes to the step:
                 *  -maxAttempts: The maximum attempts the player get
                 *  -hint: an hint to help the player
                 *  -answers: one or more key (the answer text)
                 *            value (the id of the next step) pairs.
                 *  -failure: the id of the step to go to if the player failed
                 *            to find an answer within the given attempts.
                 */
                stepTypeHandlers.riddle = function (step, element) {
                    switch (element.nodeName) {
                        case "maxTry":
                            step.maxAttempts = element.textContent * 1;
                            break;
                        case "hint":
                            step.hint = element.textContent;
                            break;
                        case "possibility":
                            element = element.firstElementChild;
                            step.next = {};
                            while (element !== null) {
                                step.next[element.textContent] = element.attributes["nextStep"].value;
                                element = element.nextElementSibling;
                            }
                            break;
                        default:
                            return false;
                    }
                    return true;
                };
            }])

        .run(['stepSaveXml', function (stepSaveXml) {
                stepSaveXml.riddle = function (step) {
                    var arrayXML = [];

                    var possibility = "";
                    Object.keys(step).forEach(function (key) {
                        switch (key) {
                            case "next":
                                for (var nextStep in step.next) {
                                    possibility += "<choice nextStep=\"" + step.next[nextStep] + "\">" + nextStep + "</choice>";
                                }
                                arrayXML.push("<possibility>" + possibility + "</possibility>");
                                break;
                            case "maxAttempts":
                                arrayXML.push("<maxTry>" + step.maxAttempts + "</maxTry>");
                                break;
                            case "hint":
                                arrayXML.push("<hint>" + step.hint + "</hint>");
                                break;
                            default:
                                break;
                        }
                    });

                    return arrayXML;
                };
            }])
        .service('riddle', function () {
            return{
                template: 'views/riddle.html',
                templateEdit: 'views/steps/riddle-edit.html',
                // next: undefined,
                answer: '',
                opts: {},
                next: function () {
                    return (this.error !== undefined && !this.error) ? this.nextStep : undefined;
                },
                handleStep: function (step) {
                    this.opts = step.next;
                },
                /**
                 * Handle riddle answer validation, and change step if required
                 * @returns {undefined}
                 */
                checkAnswer: function () {
                    for (var opt in this.opts) {
                        var dir = this.distance(this.answer, opt);
                        if (dir <= 1) {
                            this.error = false;
                            this.answer = '';
                            this.nextStep = this.opts[opt];
                            break;
                        }
                    }
                    if (this.answer !== '') {
                        this.error = "Invalid answer!";
                        this.answer = '';
                    }
                },
                /**
                 * Function to measuring the difference between two strings.
                 * This function is not case sensitive, uppercase and lowercase
                 * are not considered differences in our implementation.
                 * @param str1
                 * @param str2
                 * @returns the minimum number of character edits to change one string into the other.
                 */
                distance: function (str1, str2) {
                    var matrix_dist = [];
                    var i, j;
                    str1 = str1.toUpperCase();
                    str2 = str2.toUpperCase();
                    var len_str1 = str1.length;
                    var len_str2 = str2.length;
                    if (str1 === str2)
                        return 0;
                    if (len_str1 === 0)
                        return len_str2;
                    if (len_str2 === 0)
                        return len_str1;
                    for (i = 0; i <= len_str2; i++) {
                        matrix_dist[i] = [i];
                    }

                    for (j = 0; j <= len_str1; j++) {
                        matrix_dist[0][j] = j;
                    }

                    for (i = 1; i <= len_str2; i++) {
                        for (j = 1; j <= len_str1; j++) {
                            if (str1.charAt(j - 1) === str2.charAt(i - 1)) {
                                matrix_dist[i][j] = matrix_dist[i - 1][j - 1];
                            } else {
                                var del = matrix_dist[i - 1][j] + 1;
                                var ins = matrix_dist[i][j - 1] + 1;
                                var dif = matrix_dist[i - 1][j - 1] + 1;
                                matrix_dist[i][j] = Math.min(dif, Math.min(ins, del));
                            }
                        }
                    }
                    return matrix_dist[len_str2][len_str1];
                },
                removeNext: function (step, id) {
                    delete step.next[id];
                },
                addOption: function (step, id, text) {
                    if (step.next === undefined)
                        step.next = {};
                    step.next[text] = id;
                }
            };
        });
