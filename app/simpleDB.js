//
// Simple object store module that writes to disk
//

var logger = require('./logger.js');
var fs = require('fs');

function SimpleDB(filename){
	this.cache = {}; // keeps current version of store in memory
	this.filename = filename;
}

SimpleDB.prototype.init = function(){
	var that = this;

	return new Promise(function(resolve, reject){
		// check if file exists first
		fs.open(that.filename, 'wx', function(err, fd){
			if( err ){
				// already exists
				if( err.code == "EEXIST" ){
					// initially read file contents
					fs.readFile(that.filename, function(err, data){
						if( err ){
							logger.error(err.message);
							reject(err);
							return;
						}

						that.cache = JSON.parse(data);

						resolve();
					});
				}
				// some other error
				else {
					logger.error(err.message);
					reject(err);
				}
			}
			// file doesn't exist yet; write blank data
			else {
				fs.write(fd, JSON.stringify(that.cache), function(err){
					if( err ){
						logger.error(err.message);
						reject(err);
						return;
					}

					fs.close(fd, function(){
						resolve();
					});
				});
			}
		});
	});
}

SimpleDB.prototype.setObject = function(id, data){
	var that = this;
	return new Promise(function(resolve, reject){
		that.cache[id] = data;

		fs.writeFile(that.filename, JSON.stringify(that.cache), function(err){
			if( err ){
				reject(err);
				return;
			}

			resolve( that.cache[id] );
		});
	});
}

SimpleDB.prototype.getObject = function(id){
	var that = this;
	return new Promise(function(resolve, reject){
		if( !that.cache.hasOwnProperty(id) ){
			reject('id not found in store');
		}

		resolve( that.cache[id] );
	});
}

module.exports = SimpleDB;