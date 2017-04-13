const logger = require('./logger');
const stack = require('callsite');
const debugLog = require('debug')('logger');

function randomFunction() {
	let config = {};
	// config.loggingEnabled = false;
	config.displayStack = false;
	config.showCPUInfo = false;

	logger.trace(config, {EVENT : 'I am trace logger'});	
	logger.debug(config, {EVENT : 'I am debug logger'});
	logger.info(config, {EVENT : 'I am info logger'});
	logger.warn(config, {EVENT : 'I am warn logger'});
	logger.error(config, {EVENT : 'I am error logger'});
}


randomFunction();