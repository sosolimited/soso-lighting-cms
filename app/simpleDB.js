//
// Simple object store module that writes to disk
//

var logger = require('./logger.js');
var fs = require('fs');

function SimpleDB(filename){
	this.cache = {}; // keeps current version of store in memory
	this.filename = filename;

	// check if file exists first
	fs.open(filename, 'wx', function(err, fd){
		if( err ){
			// already exists
			if( err.code == "EEXIST" ){

				var contents = "";

				// initially read file contents
				fs.readFile(filename, function(err, data){
					if( err ){
						logger.error(err.message);
						throw err;
					}

					this.cache = JSON.parse(data);
				});
			}
			// some other error
			else {
				logger.error(err.message);
				throw err;
			}
		}
		// file doesn't exist yet; write blank data
		else {
			fs.write(fd, JSON.stringify(cache), function(err){
				if( err ){
					logger.error(err.message);
				}

				fs.close(fd);
			});
		}
	})
}

SimpleDB.prototype.setObject = function(id, data){
	return new Promise(function(resolve, reject){
		cache[id] = data;

		fs.writeFile(filename, JSON.stringify(cache), function(err){
			if( err ){
				reject(err);
				return;
			}

			resolve( cache[id] );
		});
	});
}

SimpleDB.prototype.getObject = function(id){
	return new Promise(function(resolve, reject){
		if( !cache.hasOwnProperty(id) ){
			reject('id not found in store');
		}

		resolve( cache[id] );
	});
}

module.exports = SimpleDB;