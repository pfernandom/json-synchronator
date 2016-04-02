/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 */
module.exports = {
	escape: function (html) {
		return String(html)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	},

	/**
	 * Unescape special characters in the given string of html.
	 *
	 * @param  {String} html
	 * @return {String}
	 */
	unescape: function (html) {
		return String(html)
			.replace(/&amp;/g, '&')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, '\'')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>');
	},

	synch: function (key, jsonFile) {
		var fs = require('fs')
		var file = fs.readFileSync(jsonFile, "ascii")

		var json = JSON.parse(file)
		var result = {};

		result[key] = json[key];
		return result;
		/*
		 fs.writeFile(fileName, JSON.stringify(file), function (err) {
		 if (err) return console.log(err)
		 console.log(JSON.stringify(file))
		 console.log('writing to ' + fileName)
		 });
		 */
	},

	getSubJSON:function(keyPath,json){
		var results = [];
		var getObj = function(currPath, json){

			for(var key in json) {
				var newPath;
				if(currPath){
					newPath = currPath + "." + key
				}
				else{
					newPath = key;
				}

				if(newPath === keyPath){
					results.push(json[key]);
				}


				if (json[key] && typeof json[key] === 'object') {
					getObj(newPath, json[key])
				}

			}
		}

		getObj('',json);

		return results;
	},
	setSubJSON:function(value,keyPath,json){
		var getObj = function(currPath, json){

			for(var key in json) {
				var newPath;
				if(currPath){
					newPath = currPath + "." + key
				}
				else{
					newPath = key;
				}

				if(newPath === keyPath){
					json[key] = value;
				}


				if (json[key] && typeof json[key] === 'object') {
					getObj(newPath, json[key])
				}

			}
		}

		getObj('',json);
		return json;
	}
};