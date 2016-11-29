var winston = require('winston');
var path = require('path');

// configure default logger
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
	colorize: true,
	prettyPrint: true,
	level: 'debug'
});

winston.add(winston.transports.File, {
	level: 'verbose',
	colorize: false,
	timestamp: true,
	filename: path.join(process.cwd(),'logs','CMS.log'),
	maxsize: 1024 * 1024 * 20,
	maxFiles: 10
});

module.exports = winston;