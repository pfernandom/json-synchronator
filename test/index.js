var should = require('chai').should(),
	jsynch = require('../index'),
	synch = jsynch.synch,
	escape = jsynch.escape,
	unescape = jsynch.unescape;

describe('#escape', function () {
	it('converts & into &amp;', function () {
		escape('&').should.equal('&amp;');
	});

	it('converts " into &quot;', function () {
		escape('"').should.equal('&quot;');
	});

	it('converts \' into &#39;', function () {
		escape('\'').should.equal('&#39;');
	});

	it('converts < into &lt;', function () {
		escape('<').should.equal('&lt;');
	});

	it('converts > into &gt;', function () {
		escape('>').should.equal('&gt;');
	});
});

describe('#unescape', function () {
	it('converts &amp; into &', function () {
		unescape('&amp;').should.equal('&');
	});

	it('converts &quot; into "', function () {
		unescape('&quot;').should.equal('"');
	});

	it('converts &#39; into \'', function () {
		unescape('&#39;').should.equal('\'');
	});

	it('converts &lt; into <', function () {
		unescape('&lt;').should.equal('<');
	});

	it('converts &gt; into >', function () {
		unescape('&gt;').should.equal('>');
	});
});

var fs = require('fs')
describe('#synch', function () {

	it('retrieves the correct property', function () {
		var file = fs.readFileSync('test/file_en.json', "ascii")

		var json = JSON.parse(file)

		JSON.stringify(jsynch.getSubJSON('test',json)).should.equal(JSON.stringify(['hello']));
		JSON.stringify(jsynch.getSubJSON('sub',json)).should.equal(JSON.stringify([{
			"number1":"one",
			"number2":"two"
		}]));
		JSON.stringify(jsynch.getSubJSON('sub.number1',json)).should.equal(JSON.stringify(['one']));
	});

	it('sets the correct property', function () {
		var file = fs.readFileSync('test/file_en.json', "ascii")

		var json = JSON.parse(file)

		var newValue = "newValue";

		JSON.stringify(jsynch.setSubJSON(newValue,'test',JSON.parse(JSON.stringify(json))))
			.should.equal(JSON.stringify({
				"test":newValue,
				"another":"bye",
				"sub":{
					"number1":"one",
					"number2":"two"
				}
			}));

		JSON.stringify(jsynch.setSubJSON(newValue,'sub.number1',JSON.parse(JSON.stringify(json))))
			.should.equal(JSON.stringify({
				"test":"hello",
				"another":"bye",
				"sub":{
					"number1":newValue,
					"number2":"two"
				}
			}));
	});

	it('retrieves the correct property', function () {
		JSON.stringify(synch('test', 'test/file_en.json')).should.equal(JSON.stringify({
			'test': 'hello'
		}));
	});
});