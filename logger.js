const stack = require('callsite');
const moment = require('moment');
const os = require('os');

exports.trace = trace;


var levels = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
};


const defaults = {
	loggingEnabled: true,
    defaultLoggingLevel: levels.trace, 
    
 	showCPUInfo : false,
    
    timestampPattern : 'ddd MMM DD h:mm:ss YYYY', 
    showTimestamp : true, 

    displayStack : false, 
    stackDepth : 3, 

    showFileName : true, 
    showFunctionName : true
};


/**
* 	Main function to display logs in console
*	loggingLevel 		{Number} 	displays the logging level
*	loggingParameters 	{Object}	1st argument is config object 
*									from locally called function. 
*									Rest all needs to be printed
**/
function log(loggingLevel, loggingParameters) {

	let stackObj = stack();
	// for (var i in stackObj) {
	// 	console.log(stackObj[i].getFunctionName());
	// }
	let fileName = stackObj[2].getFileName();
	let functionName = stackObj[2].getFunctionName() || 'anonymous';
	let lineNumber = stackObj[2].getLineNumber();

    // var handlingInfo = loggingParameters[0];
    // var apiModule = handlingInfo.apiModule;
    // var apiHandler = handlingInfo.apiHandler;

    // var defaultLoggingLevel = debuggingPermissions[apiModule].defaultLoggingLevel;

    // if (loggingLevel !== levels.error && (!isLoggingEnabled(apiModule, apiHandler) || loggingLevel > defaultLoggingLevel)) {
    //     return;
    // }

    // var stream = process.stdout;
    // if (loggingLevel === levels.error) {
    //     stream = process.stderr;
    // }
    let execConfig = defaults;
    let localConfig = loggingParameters['0'];
    delete loggingParameters['0'];

    Object.keys(execConfig).map((key)=>{
    	if (localConfig[key] !== undefined){
    		execConfig[key] = localConfig[key];
    	}	 
    });
    let output = '';
	output += showTimeStamp(execConfig);
  	output += showFileName(execConfig, fileName);
    output += showFunctionName(execConfig, functionName);
    output += showStackTrace(execConfig, stackObj);
    output += showCPUInfo(execConfig);

    console.log('***************************' + output + '***************************************');
    Object.keys(loggingParameters).forEach((parameter)=>{
   		console.log(JSON.stringify(loggingParameters[parameter]) + '\n');
   		return ;
    });
}



function showTimeStamp(execConfig) {
	if (!execConfig.showTimestamp) {
		return;
	}
	return moment().utc().add(330, 'minutes').format(execConfig.timestampPattern) + '~~~~~~'
}

function showFileName(execConfig, fileName) {
	if (!execConfig.showFileName) {
		return;
	}
	return fileName + '~~~~~~';

}

function showFunctionName(execConfig, functionName) {
	if (!execConfig.showFunctionName) {
		return;
	}
	return functionName + '~~~~~~'; 
}

function showStackTrace(execConfig, stackObj ) {
	if (!execConfig.displayStack) {
		return;
	}
	let stackDepth = execConfig.stackDepth;
	let output = '\n ******** Stack Trace ******* \n';
	for (let i in stackObj) {
		if (i>execConfig.stackDepth) {
			break;
		}
		let tabs = '		';
		let serialNumber = parseInt(i)+1;
		let functionName = 'Function: ' +  (stackObj[i].getFunctionName() || 'anonymous') + tabs ;
		let fileName = 'Path: ' + stackObj[i].getFileName() + tabs;
		let lineNumber = 'Line: ' + stackObj[i].getLineNumber() + tabs;
		output +=  + serialNumber + '. ' + functionName + fileName + lineNumber +  '\n';
	}
	return output;
}


function showCPUInfo(execConfig) {
	if (!execConfig.showCPUInfo) {
		return;
	}
	let output = `\n ******** OS Info ******* \n`;
	output += `Hostname :  ${os.hostname()}  \n`;
	output += `Type :   ${os.type()} \n`;
	output += `Platform :  ${os.platform()} \n`;
	output += `Architecture : ${os.arch()} \n`;
	output += `Release : ${os.release()} \n`;
	output += `Uptime :  ${os.uptime()} \n`; 
	output += `Load Avg : ${os.loadavg()} \n`;
	output += `Total Time :  ${os.totalmem()} \n`;
	output += `Freememory : ${os.freemem()} \n`;
	output += `CPUS : ${os.cpus()} \n`;
	output += `Network Interfaces : ${os.networkInterfaces()} \n`;
	return output;
}


function trace(/* arguments */) {
    log(levels.trace, arguments);
}


