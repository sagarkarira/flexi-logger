const logger = require('./logger');
const stack = require('callsite');

function randomFunction() {
	let config = {};
	// config.loggingEnabled = false;
	config.displayStack = true;
	config.showCPUInfo = true;
	logger.trace(config, {EVENT : 'My first log'}, {EVENT : 'My second log' });	
}


randomFunction();