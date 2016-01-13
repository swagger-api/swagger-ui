'use strict';

describe('SwaggerUi.partials.signature tests', function () {
    var sut = SwaggerUi.partials.signature;

    describe('method createXMLSample', function () {
        var date = new Date(1).toISOString().split('T')[0];
        var dateTime = new Date(1).toISOString();

        describe('simple types with no xml property', function () {
            it('returns tag <tagname>string</tagname> when passing type string', function () {
                var name = 'tagname';
                var definition = {type: 'string'};

                expect(sut.createXMLSample(name, definition)).to.equal('<tagname>string</tagname>');
            });

            it('returns tag <tagname>1</tagname> when passing type integer', function () {
                var name = 'tagname';
                var definition = {type: 'integer'};

                expect(sut.createXMLSample(name, definition)).to.equal('<tagname>1</tagname>');
            });

            it('returns tag <tagname>1.1</tagname> when passing type number', function () {
                var name = 'tagname';
                var definition = {type: 'number'};

                expect(sut.createXMLSample(name, definition)).to.equal('<tagname>1.1</tagname>');
            });

            it('returns tag <tagname>boolean</tagname> when passing type boolean', function () {
                var name = 'tagname';
                var definition = {type: 'boolean'};

                expect(sut.createXMLSample(name, definition)).to.equal('<tagname>true</tagname>');
            });

            it('returns tag <tagname>' + date + '</tagname> when passing type string format date', function () {
                var name = 'tagname';
                var definition = {type: 'string', format: 'date'};

                expect(sut.createXMLSample(name, definition)).to.equal('<tagname>' + date + '</tagname>');
            });

            it('returns tag <tagname>' + dateTime + '</tagname> when passing type string format date-time', function () {
                var name = 'tagname';
                var definition = {type: 'string', format: 'date-time'};

                expect(sut.createXMLSample(name, definition)).to.equal('<tagname>' + dateTime + '</tagname>');
            });
        });

        describe('simple types with xml property', function () {
            it('returns tag <newtagname>string</newtagname> when passing type string and xml:{name: "newtagname"}', function () {
                var name = 'tagname';
                var definition = {
                    type: 'string',
                    xml: {
                        name: 'newtagname'
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal('<newtagname>string</newtagname>');
            });

            it('returns tag <test:newtagname>string</test:newtagname> when passing type string and xml:{name: "newtagname", prefix:"test"}', function () {
                var name = 'tagname';
                var definition = {
                    type: 'string',
                    xml: {
                        name: 'newtagname',
                        prefix: 'test'
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal('<test:newtagname>string</test:newtagname>');
            });

            it('returns tag <test:tagname>string</test:tagname> when passing type string and xml:{name: "newtagname", prefix:"test"}', function () {
                var name = 'tagname';
                var definition = {
                    type: 'string',
                    xml: {
                        prefix: 'test'
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal('<test:tagname>string</test:tagname>');
            });

            it('returns tag <test:tagname >string</test:tagname> when passing type string and xml:{"namespace": "http://swagger.io/schema/sample", "prefix": "sample"}', function () {
                var name = 'name';
                var definition = {
                    "type": "string",
                    "xml": {
                        "namespace": "http://swagger.io/schema/sample",
                        "prefix": "sample"
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal('<sample:name xlmns:sample="http://swagger.io/schema/sample">string</sample:name>');
            });

            it('returns tag <test:tagname >string</test:tagname> when passing type string and xml:{"namespace": "http://swagger.io/schema/sample"}', function () {
                var name = 'name';
                var definition = {
                    "type": "string",
                    "xml": {
                        "namespace": "http://swagger.io/schema/sample"
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal('<name xlmns="http://swagger.io/schema/sample">string</name>');
            });
        });

        describe('array', function () {
            it('returns tag <tagname>string</tagname><tagname>string</tagname> when passing string items', function () {
                var expected = '<tagname>string</tagname><tagname>string</tagname>';
                var name = 'tagname';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal(expected);
            });
        });

        describe('array', function () {
            it('returns tag <animal>string</animal><animal>string</animal> when passing string items with name', function () {
                var expected = '<animal>string</animal><animal>string</animal>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'string',
                        xml: {
                            name: 'animal'
                        }
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal(expected);
            });

            it('returns tag <animals><animal>string</animal><animal>string</animal></animals> when passing string items with name', function () {
                var expected = '<animals><animal>string</animal><animal>string</animal></animals>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'string',
                        xml: {
                            name: 'animal'
                        }
                    },
                    xml: {
                        wrapped: true
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal(expected);
            });

            it('returns tag <aliens><animal>string</animal><animal>string</animal></aliens> when passing string items with name and {wrapped: true}', function () {
                var expected = '<aliens><animal>string</animal><animal>string</animal></aliens>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'string',
                        xml: {
                            name: 'animal'
                        }
                    },
                    xml: {
                        wrapped: true,
                        name: 'aliens'
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal(expected);
            });

            it('return correct nested wrapped array', function () {
                var expected = '<aliens><cat>string</cat><cat>string</cat><cat>string</cat><cat>string</cat></aliens>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'array',
                        items: {
                           type: 'string'
                        },
                        xml: {
                            name: 'cat'
                        }
                    },
                    xml: {
                        wrapped: true,
                        name: 'aliens'
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal(expected);
            });

            it('return correct nested wrapped array', function () {
                var expected = '<aliens>' +
                    '<cats><cat>string</cat><cat>string</cat></cats>' +
                    '<cats><cat>string</cat><cat>string</cat></cats>' +
                    '</aliens>';
                var name = 'animals';
                var definition = {
                    type: 'array',
                    items: {
                        type: 'array',
                        items: {
                            type: 'string',
                            xml: {
                                name: 'cat'
                            }
                        },
                        xml: {
                            name: 'cats',
                            wrapped: true
                        }
                    },
                    xml: {
                        wrapped: true,
                        name: 'aliens'
                    }
                };

                expect(sut.createXMLSample(name, definition)).to.equal(expected);
            });
        });
    });
});
