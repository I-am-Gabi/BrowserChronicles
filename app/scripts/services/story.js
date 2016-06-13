'use strict';
/**
 * @ngdoc service
 * @name chroniclesApp.story
 * @description
 * # story
 * Factory in the chroniclesApp.
 */
angular.module('chroniclesApp')
        .constant('EVENT_STORY_LOADED', 'story_loaded')
        .constant('EVENT_STORY_UPDATED_SHORTEST_PATH', 'story_shortestPath_update')
        /**
         * This object contain handlers to initialize a story. Each member
         * should be a function named after the type name, and should take
         * two parameters:
         *  -The object being built
         *  -The element that was encountered
         * Those functions should return true if the given element is known.
         */
        .value('stepTypeHandlers', {})
        .value('stepSaveXml', {})
        .factory('story', function ($http, $rootScope, stepTypeHandlers, stepSaveXml, EVENT_STORY_LOADED, EVENT_STORY_UPDATED_SHORTEST_PATH) {
            /**
             * Handle initialization from the xml
             * @param {Element} initXml The init tag
             * @returns {undefined}
             */
            var constants = {
                INIT: "init",
                STEP: "step",
                TYPE: "type",
                ID: "id",
                TITLE: "title",
                DESCRIPTION: "description",
                STORY_NAME: "title"
            };
            /**
             * This function handle initialization required by the init tag of
             * the XML.
             * @param {Element} initElement The init element of the XML
             * @returns {undefined}
             */
            var init = function (initElement) {

            };
            // Public API here
            return {
                /**
                 * A step contain a type, and is identified by an id.
                 * This object is not an array because the ids doesn't have to
                 * be continuous.
                 * Furthermore, it could contain a title, a description and
                 * datas dependant on the type.
                 */
                steps: {},
                name: '',
                nbSteps: 0,
                // A story should have a BEGIN step and at least one happy ending
                hasBegin: function () {
                    return this.steps["BEGIN"] !== undefined;
                },
                /**
                 * Parse an XML string to an Object
                 * @param {string} rawContent The content to parse
                 * @returns {Object} The representation of the xml
                 */
                parseXML: function (rawContent) {
                    var xml = new DOMParser().parseFromString(rawContent, "text/xml");
                    var rootStory = xml.getElementsByTagName('story')[0];
                    this.name = rootStory.attributes[constants.STORY_NAME].value;
                    // Handle initialization
                    init(rootStory.getElementsByTagName(constants.INIT)[0]);
                    this.steps = {};
                    this.nbSteps = 0;
                    var steps = rootStory.getElementsByTagName(constants.STEP);
                    // Go through all steps
                    for (var i = 0; i < steps.length; i++) {
                        var currentElement = steps[i].firstChild;
                        var id = steps[i].attributes[constants.ID].value;
                        this.steps[id] = {};
                        this.steps[id].type = steps[i].attributes[constants.TYPE].value;
                        this.steps[id].node = {id: id, label: id};
                        this.steps[id].edges = {arrow: "to", from: id, to: {}};
                        // Gather all informations on the current step
                        while (currentElement !== null) {
                            switch (currentElement.nodeName) {
                                case constants.DESCRIPTION:
                                    this.steps[id].description = currentElement.textContent;
                                    break;
                                case constants.TITLE:
                                    this.steps[id].title = currentElement.textContent;
                                    break;
                                case '#text':// Ignore those anoying white spaces
                                    break;
                                default:
                                    if (stepTypeHandlers[this.steps[id].type] !== undefined) {
                                        if (!stepTypeHandlers[this.steps[id].type](this.steps[id], currentElement))
                                            console.warn("XML parsing: error while parsing tag '" + currentElement.nodeName + "'.");
                                    } else
                                        console.warn("XML parsing: unknown tag '" + currentElement.nodeName + "'.");
                                    break;
                            }
                            currentElement = currentElement.nextElementSibling;
                        }
                        this.nbSteps++;
                    }
                    // Check the validity of the story
                    this.validate();
                    this.isLoaded = true;
                    $rootScope.$emit(EVENT_STORY_LOADED, this);
                },
                parseStepToXML: function () {
                    var story = "<?xml version=\"1.0\"?>" +
                            "<story xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
                            " xsi:noNamespaceSchemaLocation=\"story.xsd\" title=\"" + this.name + "\">";

                    story += "<init></init>";

                    for (var step in this.steps) {
                        story += "<step id=\"" + step + "\" type=\"" + this.steps[step].type + "\">";

                        if (typeof this.steps[step].title !== 'undefined') {
                            story += "<title><![CDATA[" + this.steps[step].title + "]]></title>";
                        }

                        if (typeof this.steps[step].description !== 'undefined') {
                            story += "<description><![CDATA[" + this.steps[step].description + "]]></description>";
                        }
                        story += stepSaveXml[this.steps[step].type](this.steps[step]).join("");
                        story += "</step>";
                    }

                    story += "</story>";
                    return story;
                },
                isLoaded: false,
                /**
                 * Get all the steps of the given type
                 * @param {String} type The type of the steps to collect
                 * @returns {Object} An object containing keys (id of the step)
                 *                   and values (data of the step)
                 */
                getStepsOfType: function (type) {
                    var result = {};
                    for (var step in this.steps) {
                        if (this.steps[step].type === type) {
                            result[step] = this.steps[step];
                        }
                    }
                    return result;
                },
                isValid: false,
                hasHappyEnding: function () {
                    var endSteps = this.getStepsOfType('end');
                    for (var i in endSteps) {
                        if (endSteps[i].won === true) {
                            return true;
                        }
                    }
                    return false;
                },
                hasValidOptions: function () {
                    for (var step in this.steps) {
                        var s = this.steps[step];
                        if (s.type === 'multiChoice' || s.type === 'riddle') {
                            if (Object.keys(s.next).length === 0) {
                                return false;
                            }
                        }
                    }
                    return true;
                },
                validate: function () {
                    var valid = false;
                    if (!this.hasBegin()) {
                        this.isValid = false;
                        return false;
                    }
                    this.isValid = this.hasHappyEnding();
                    if (this.computeShortestPath().length === 0)
                        this.isValid = false;
                    $rootScope.$emit(EVENT_STORY_UPDATED_SHORTEST_PATH, this.shortestPath);
                    return this.isValid;
                },
                /**
                 * Retrieve the story from the server and parse it.
                 * @param {String} The name of the story
                 */
                loadFromServer: function (name) {
                    name += ".xml";
                    var that = this;
                    $http.get('/stories/' + name).then(function (response) {
                        that.parseXML(response.data);
                    }, function (response) {
                        console.warn("Story '" + name + "' couldn't be retrieved: " + response.statusText + ".");
                    });
                },
                /**
                 * Create a new story
                 * @param {String} title The title of the new story
                 * @returns {undefined}
                 */
                create: function (title) {
                    this.name = title;
                    this.steps = {};
                    this.nbSteps = 0;
                    this.addStep('BEGIN', {
                        type: Object.keys(stepTypeHandlers)[0],
                        title: 'The begining',
                        description: 'A new beggining...',
                        next: {}
                    });
                    this.isLoaded = true;
                    this.validate();
                },
                addStep: function (id, step) {
                    if (this.steps[id] !== undefined)
                        return false;
                    if (typeof step === 'string') {
                        this.steps[id] = {
                            type: step,
                            next: {}
                        };
                    } else {
                        this.steps[id] = step;
                    }
                    this.nbSteps++;
                    this.validate();
                    return true;
                },
                /**
                 * Change the ID of a step. If the newId already exist, the
                 * function return false and nothing is done.
                 * @param {type} oldId The old ID of the step
                 * @param {type} newId The new ID of the step
                 * @returns {Boolean} true if the id was successfully changed
                 */
                changeId: function (oldId, newId) {
                    if (this.steps[newId] !== undefined)
                        return false;

                    for (var stepKey in this.steps) {
                        if (typeof this.steps[stepKey].next === 'string') {
                            if (this.steps[stepKey].next === oldId) {
                                this.steps[stepKey].next = newId;
                            }
                        } else {
                            for (var key in this.steps[stepKey].next) {
                                if (this.steps[stepKey].next[key] === oldId) {
                                    this.steps[stepKey].next[key] = newId;
                                }
                            }
                        }
                    }
                    this.steps[newId] = this.steps[oldId];
                    delete this.steps[oldId];
                    this.validate();
                },
                removeStep: function (stepId) {
                    for (var stepKey in this.steps) {
                        if (typeof this.steps[stepKey].next === 'string') {
                            if (this.steps[stepKey].next === stepId) {
                                this.steps[stepKey].next = undefined;
                            }
                        } else {
                            for (var key in this.steps[stepKey].next) {
                                if (this.steps[stepKey].next[key] === stepId) {
                                    delete this.steps[stepKey].next[key];
                                }
                            }
                        }
                    }
                    delete this.steps[stepId];
                    this.validate();
                },
                errors: [],
                shortestPath: [],
                computeShortestPath: function () {
                    this.errors = [];
                    var g = new Graph();

                    // Register steps and edges
                    for (var n in this.steps) {
                        if (!this.steps.hasOwnProperty(n)) {
                            continue;
                        }
                        // Step
                        g.addNode(n);
                        // Edges
                        for (var e in this.steps[n].next) {
                            g.addEdge(n, this.steps[n].next[e], 1);
                        }
                    }

                    var winningNodeArray = [];
                    for (var step in this.steps) {
                        if (this.steps[step].type === 'end' && this.steps[step].won) {
                            winningNodeArray.push(step);
                        }
                    }

                    this.shortestPath = [];
                    if (winningNodeArray.length === 0) {
                        this.errors.push('No winning node detected.');
                    } else {
                        for (var i = 0; i < winningNodeArray.length; i++) {
                            var next = g.shortestPath('BEGIN', winningNodeArray[i]);
                            if (next.length !== 0 && (this.shortestPath.length === 0 || next.length < this.shortestPath.length)) {
                                this.shortestPath = next;
                            } else if (next.length === 0) {
                                this.errors.push('Missing path to reach winning node "' + winningNodeArray[i] + '".');
                            }
                        }
                        if (this.shortestPath.length === 0)
                            this.errors.push('No path detected to reach any winning node.');
                    }
                    if (!this.hasValidOptions()) {
                        this.errors.push('Steps with invalid number of answers');
                    }
                    return this.shortestPath;
                }
            };
        });
