'use strict';

const Transport = require('winston-transport');
const Sentry = require('@sentry/node');

//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
module.exports = class ServerTransport extends Transport {
    constructor(opts, config) {

        super(opts);
        Sentry.init(config);
    }

    log(info, callback) {

        setImmediate(() => {

            this.emit('logged', info);
        });

        if (info.level === 'error') {
            Sentry.captureException(info[Symbol.for('message')]);
        }

        if (info.level === 'warn') {
            Sentry.captureMessage(info.message, 'warning');
        }

        callback();
    }
};



