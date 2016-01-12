'use strict';

describe('SwaggerUi.partials.signature tests', function () {
    var sut = SwaggerUi.partials.signature;

    describe('method createXMLSample', function () {
        var date = sut.getSampleDate('date');
        var dateTime = sut.getSampleDate('date-time');

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
        });
    });
});
