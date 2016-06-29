var fs = require('fs')
/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 */
module.exports = {
	/**
	 * Set a value or sub JSON to two or more files.
	 * @param config
	 * 	The configuration object. It must contain the following properties:
	 * 		{
			"key":"test",  //Key path of the value or sub JSON to set
			"values":[ \	//Array of the files to synchronize and their values.
				{
					"fileName":FILE_EN,
					"value":"new_value"
				},
				...
			]
		}
	 *
	 * @returns {boolean}
	 */
	synch: function (config) {
		var result = false;
		var context = this;

		var keyPath;

		try{
			if (config.key) {
				keyPath = config.key;
			}
			else{
				throw new Error("The expected property 'key' is undefined");
			}

			if (config.values) {
				for (var i in config.values) {
					if (config.values.hasOwnProperty(i)) {
						var value = config.values[i].value;
						var fileName = config.values[i].fileName;
						var json = JSON.parse(fs.readFileSync(fileName, "ascii"));

						var newJSON = context.setSubJSON(value, keyPath, json);

						context.saveJSON(fileName, newJSON);
					}

				}
				result = true;
			}
			else{
				throw new Error("The expected property 'values' is undefined");
			}
		}
		catch(e){
			console.error(e);
			result = false;
		}
		return result;


	},
	/**
	 * Retrieves a sub JSON using a key path.
	 *
	 * Given a JSON:
	 * {
	 * 	sub:{
			"number1":"one",
			"number2":"two"
		}
	 * }
	 *
	 * And the key path sub.number1, getSubJson will return 'one'
	 *
	 * @param keyPath - The key path to search a property or sub JSON: e.g. 'sub.number1'
	 * @param json - A JSON object
	 * @returns {Array} - An array of all the properties or sub JSON objects which match the key path.
	 */
	getSubJSON: function (keyPath, json) {
		var results = [];
		var getObj = function (currPath, json) {

			for (var key in json) {
				var newPath;
				if (currPath) {
					newPath = currPath + "." + key
				}
				else {
					newPath = key;
				}

				if (newPath === keyPath) {
					results.push(json[key]);
				}


				if (json[key] && typeof json[key] === 'object') {
					getObj(newPath, json[key])
				}

			}
		}

		getObj('', json);

		return results;
	},

	/**
	 * Retrieves a sub JSON or property from a files using a key path.
	 *
	 * @param keyPath - The key path to search a property or sub JSON: e.g. 'sub.number1'
	 * @param jsonFiles - An array of file paths
	 * @returns {Array} - An array of all the properties or sub JSON objects which match the key path.
	 */
	getSubJSONinFiles: function (keyPath, jsonFiles) {
		var context = this;
		var results = [];
		for (var i in jsonFiles) {
			if (jsonFiles.hasOwnProperty(i)) {
				var result = {};
				var jsonFile = jsonFiles[i];
				result.fileName = jsonFile;

				jsonFile = JSON.parse(fs.readFileSync(jsonFile, "ascii"))

				result.value = context.getSubJSON(keyPath, jsonFile);
				results.push(result);
			}
		}
		return results;
	},

	setSubJSON: function (value, keyPath, json) {
		var getObj = function (currPath, json) {

			for (var key in json) {
				var newPath;
				if (currPath) {
					newPath = currPath + "." + key
				}
				else {
					newPath = key;
				}

				if (newPath === keyPath) {
					json[key] = value;
				}


				if (json[key] && typeof json[key] === 'object') {
					getObj(newPath, json[key])
				}

			}
		}

		getObj('', json);
		return json;
	},

	saveJSON: function (fileName, json) {
		var jsonString = JSON.stringify(json, null, '\t');
		fs.writeFileSync(fileName, jsonString);
	}
};