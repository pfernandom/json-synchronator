var should = require('chai').should(),
	jsynch = require('../index');


var fs = require('fs')

function getJSON(fileName){
	var file = fs.readFileSync(fileName, "ascii");
	return JSON.parse(file);
}

describe('#synch', function () {
	beforeEach(function() {
		jsynch.saveJSON('test/file_en.json',{
			"test":"hello",
			"another":"bye",
			"sub":{
				"number1":"one",
				"number2":"two"
			}
		});

		jsynch.saveJSON('test/file_es.json',{
			"test":"hola",
			"another":"adios",
			"sub":{
				"number1":"uno",
				"number2":"dos"
			}
		});

		var json = getJSON('test/file_en.json');

		JSON.stringify(json).should.equal(JSON.stringify({
			"test": "hello",
			"another": "bye",
			"sub": {
				"number1": "one",
				"number2": "two"
			}
		}));


	});

	it('retrieves the correct property', function () {
		jsynch.saveJSON('test/file_es.json',{
			"test":"hola",
			"another":"adios",
			"sub":{
				"number1":"uno",
				"number2":"dos"
			}
		});
	});

	/**
	 * Test to retrieve a property or sub JSON.
	 */
	it('retrieves the correct property', function () {
		var json = getJSON('test/file_en.json');

		JSON.stringify(jsynch.getSubJSON('test',json)).should.equal(JSON.stringify(['hello']));
		JSON.stringify(jsynch.getSubJSON('sub',json)).should.equal(JSON.stringify([{
			"number1":"one",
			"number2":"two"
		}]));
		JSON.stringify(jsynch.getSubJSON('sub.number1',json)).should.equal(JSON.stringify(['one']));
		JSON.stringify(jsynch.getSubJSON('notexisting',json)).should.equal(JSON.stringify([]));
	});

	/**
	 * Test to set a value in a JSON using a key path
	 */
	it('sets the correct property', function () {
		var json = getJSON('test/file_en.json');
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

		JSON.stringify(jsynch.setSubJSON(newValue,'unexisting',JSON.parse(JSON.stringify(json))))
			.should.equal(JSON.stringify({
			"test":"hello",
			"another":"bye",
			"sub":{
				"number1":"one",
				"number2":"two"
			}
		}));

		JSON.stringify(jsynch.setSubJSON(newValue,'sub',JSON.parse(JSON.stringify(json))))
			.should.equal(JSON.stringify({
			"test":"hello",
			"another":"bye",
			"sub":newValue
		}));
	});

	it('synchronizes a new value in two different JSON files', function () {
		const FILE_EN = 'test/file_en.json',
			FILE_ES = 'test/file_es.json';

		var result1 = jsynch.synch({
			"values": [
				{
					"fileName": FILE_EN,
					"value": "new_value"
				},
				{
					"fileName": FILE_ES,
					"value": "nuevo_valor"
				}
			]
		});

		var result2 = jsynch.synch({
			"key": "test"
		});

		result1.should.equal(false);
		result2.should.equal(false);
	});

	it('synchronizes a new value in two different JSON files', function () {
		const FILE_EN = 'test/file_en.json',
			FILE_ES = 'test/file_es.json';

		var result = jsynch.synch({
			"key":"test",
			"values":[
				{
					"fileName":FILE_EN,
					"value":"new_value"
				},
				{
					"fileName":FILE_ES,
					"value":"nuevo_valor"
				}
			]
		});

		result.should.equal(true);

		var json = getJSON(FILE_EN);

		JSON.stringify(json).should.equal(JSON.stringify({
			"test": "new_value",
			"another": "bye",
			"sub": {
				"number1": "one",
				"number2": "two"
			}
		}));

		var json = getJSON(FILE_ES);

		JSON.stringify(json).should.equal(JSON.stringify({
			"test": "nuevo_valor",
			"another": "adios",
			"sub": {
				"number1": "uno",
				"number2": "dos"
			}
		}));


		JSON.stringify(jsynch.synch({
			"key":"sub.number1",
			"values":[
				{
					"fileName":FILE_EN,
					"value":"new_value"
				},
				{
					"fileName":FILE_ES,
					"value":"nuevo_valor"
				}
			]
		}));


		var json = getJSON(FILE_EN);

		JSON.stringify(json).should.equal(JSON.stringify({
			"test": "new_value",
			"another": "bye",
			"sub": {
				"number1": "new_value",
				"number2": "two"
			}
		}));

		var json = getJSON(FILE_ES);

		JSON.stringify(json).should.equal(JSON.stringify({
			"test": "nuevo_valor",
			"another": "adios",
			"sub": {
				"number1": "nuevo_valor",
				"number2": "dos"
			}
		}));

	});


	it('retrieves the correct property from two JSON files', function () {
		var files = ['test/file_en.json','test/file_es.json'];
		JSON.stringify(jsynch.getSubJSONinFiles('test', files)).should.equal(JSON.stringify([
			{
				fileName:files[0],
				value:["hello"]
			},
			{
				fileName:files[1],
				value:["hola"]
			}
		]));
	});
});