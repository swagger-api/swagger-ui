'use strict';

describe('SwaggerUi.partials.signature tests', function () {
    var sut = SwaggerUi.partials.signature;

    describe('method createXMLSample', function () {
        var date = new Date(1).toISOString().split('T')[0];
        var dateTime = new Date(1).toISOString();

        describe('simple types', function () {
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

            it('returns tag <tagname>' + dateTime + '</tagname> when passing type boolean format date-time', function () {
                var name = 'tagname';
                var definition = {type: 'string', format: 'date-time'};

                expect(sut.createXMLSample(name, definition)).to.equal('<tagname>' + dateTime + '</tagname>');
            });
        });
    });
});
