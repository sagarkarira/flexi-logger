/*
 *   LOGGING HANDLER FOR THE APIs
 *
 *   ALL THE LOGGING CALLS WILL BE ROUTED THROUGH THIS MODULE
 *   TO HANDLE SELECTIVE LOGGING DEPENDING UPON THE MODULE
 *   AND THE PARTICULAR HANDLER GENERATING THE LOG
 */
var moment = require('moment');

var levels = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
};

var debuggingPermissions = {

    loggingEnabled: true,
    defaultLoggingLevel: levels.trace,

};

exports.trace = trace;
exports.debug = debug;
exports.info = info;
exports.warn = warn;
exports.error = error;
exports.logDatabaseQuery = logDatabaseQuery;
exports.logSendingEmail = logSendingEmail;
exports.logSessions = logSessions;
exports.logFileWrite = logFileWrite;
exports.logFileRead = logFileRead;
exports.logRequest = logRequest;
exports.logResponse = logResponse;
exports.logErrorResponse = logErrorResponse;


// A variadic function to log the stuff
function log(loggingLevel, loggingParameters) {
    var handlingInfo = loggingParameters[0];
    var apiModule = handlingInfo.apiModule;
    var apiHandler = handlingInfo.apiHandler;

    var defaultLoggingLevel = debuggingPermissions[apiModule].defaultLoggingLevel;

    if (loggingLevel !== levels.error && (!isLoggingEnabled(apiModule, apiHandler) || loggingLevel > defaultLoggingLevel)) {
        return;
    }

    var stream = process.stdout;
    if (loggingLevel === levels.error) {
        stream = process.stderr;
    }

    for (var i = 1; i < loggingParameters.length; i++) {
        if (loggingParameters[i]) {
            stream.write(moment().utc().add(330, 'minutes').format("YYYY-MM-DD HH:mm:ss") + ':::' + apiModule + ' ::: ' + apiHandler + ' ::: ' + JSON.stringify(loggingParameters[i]) + '\n');
        }
    }
}


function trace(/* arguments */) {
    log(levels.trace, arguments);
}

function debug(/* arguments */) {
    log(levels.debug, arguments);
}

function info(/* arguments */) {
    log(levels.info, arguments);
}

function warn(/* arguments */) {
    log(levels.warn, arguments);
}

function error(/* arguments */) {
    log(levels.error, arguments);
}

function logDatabaseQuery(handlerInfo, eventFired, error, result, query) {
    if (error) {
        if (typeof query !== 'undefined')
            module.exports.error(handlerInfo, {event: eventFired}, {error: error}, {result: result}, {query: query});
        else
            module.exports.error(handlerInfo, {event: eventFired}, {error: error}, {result: result});
    }
    else {
        if (typeof query !== 'undefined')
            module.exports.trace(handlerInfo, {event: eventFired}, {error: error}, {result: result}, {query: query});
        else
            module.exports.trace(handlerInfo, {event: eventFired}, {error: error}, {result: result});
    }
}

function logSendingEmail(handlerInfo, mailOptions, error, response) {
    if (error) {
        module.exports.error(handlerInfo, {MAILOPTIONS: mailOptions}, {ERROR: error}, {RESPONSE: response});
    }
    else {
        module.exports.trace(handlerInfo, {MAILOPTIONS: mailOptions}, {ERROR: error}, {RESPONSE: response});
    }
}

function logSessions(handlerInfo, sessions) {
    var sessionsInfo = '';
    for (var sessionId in sessions) {
        sessionsInfo +=
            '{session_id : ' + sessionId + ', ' +
            'num_drivers : ' + sessions[sessionId].num_drivers + ', ' +
            'max_tries : ' + sessions[sessionId].max_tries + ', ' +
            'drivers_index : ' + sessions[sessionId].drivers_index + ' ' +
            '}, ';
    }
    module.exports.trace(handlerInfo, {ONGOING_SESSIONS: sessionsInfo});
}

function logFileWrite(handlerInfo, filename, error) {
    if (error) {
        module.exports.error(handlerInfo, {FILENAME: filename}, {ERROR: error});
    }
    else {
        module.exports.trace(handlerInfo, {FILENAME: filename}, {ERROR: error});
    }
}

function logFileRead(handlerInfo, filename, error, data) {
    if (error) {
        module.exports.error(handlerInfo, {FILENAME: filename}, {ERROR: error});
    }
    else {
        module.exports.trace(handlerInfo, {FILENAME: filename}, {ERROR: error});
    }
}

function logRequest(handlerInfo, request) {
    module.exports.trace(handlerInfo, {REQUEST: request});
}

function logResponse(handlerInfo, response) {
    module.exports.trace(handlerInfo, {RESPONSE: response});
}

function logErrorResponse(handlerInfo, response) {
    module.exports.error(handlerInfo, {RESPONSE: response});
}


function isLoggingEnabled(module, handler) {
    // Check if the logging has been enabled
    if (!debuggingPermissions.loggingEnabled) {
        return false;
    }

    // Check if the logging has been enabled for the complete module
    if (!debuggingPermissions[module].loggingEnabled) {
        return false;
    }

    // Check if the logging has been enabled for the particular handler function for the module
    if (!debuggingPermissions[module][handler]) {
        return false;
    }

    return true;
}
