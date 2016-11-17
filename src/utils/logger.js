export default {
    trace(options) { console.log("TRACE", options.short_message, options._operation); },
    debug (options) { console.log("DEBUG", options.short_message, options._operation, options.long_message); }
}

