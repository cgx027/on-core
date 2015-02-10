// Copyright 2014, Renasar Technologies Inc.
/* jshint: node:true */

'use strict';

var di = require('di'),
    util = require('util');

module.exports = ErrorEventFactory;

di.annotate(ErrorEventFactory, new di.Provide('ErrorEvent'));
di.annotate(ErrorEventFactory,
    new di.Inject(
        'Assert',
        'Serializable',
        'Tracer',
        '_'
    )
);

function ErrorEventFactory (assert, Serializable, tracer, _) {
    function ErrorEvent (error) {
        Serializable.call(
            this,
            {
                name: {
                    type: 'string',
                    required: true
                },
                message: {
                    type: 'string',
                    required: true
                },
                stack: {
                    type: 'string',
                    required: true
                },
                context: {
                    type: 'object',
                    required: true
                }
            },
            {
                name: error.name,
                message: error.message,
                stack: error.stack,
                context: _.merge(
                    error.context || {},
                    tracer.active
                )
            }
        );
    }

    util.inherits(ErrorEvent, Serializable);

    Serializable.register(ErrorEventFactory, ErrorEvent);

    return ErrorEvent;
}