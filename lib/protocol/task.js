// Copyright 2014, Renasar Technologies Inc.
/* jshint: node:true */

'use strict';

var di = require('di');

module.exports = taskProtocolFactory;

di.annotate(taskProtocolFactory, new di.Provide('Protocol.Task'));
di.annotate(taskProtocolFactory,
    new di.Inject(
        'Services.Messenger',
        'Protocol.Exchanges.Task',
        'Protocol.Exchanges.Events',
        'Assert'
    )
);

function taskProtocolFactory (messenger, taskExchange, eventsExchange, assert) {
    function TaskProtocol() {
    }

    TaskProtocol.prototype.getBootFile = function getBootFile(nodeId, options) {
        return messenger.request(
                taskExchange.exchange,
                'methods.getBootFile' + '.' + nodeId,
                options
            )
            .then(function(message) {
                return message.data.result;
            });
    };

    TaskProtocol.prototype.activeTaskExists = function activeTaskExists(identifier) {
        return messenger.request(
                taskExchange.exchange,
                'methods.activeTaskExists' + '.' + identifier,
                identifier
            )
            .then(function(message) {
                return message.data.result;
            });
    };

    TaskProtocol.prototype.subscribeDhcpBoundLease =
                        function subscribeDhcpBoundLease(identifier, callback) {
        assert.ok(identifier);
        assert.ok(callback);
        return messenger.subscribe(
                eventsExchange.exchange,
                'dhcp.bind.success' + '.' + identifier,
                function(message) {
                    var _callback = callback;
                    _callback(message.data, message);
                }
        );
    };

    TaskProtocol.prototype.subscribeTftpSuccess =
                        function subscribeTftpSuccess(identifier, callback) {
        assert.ok(identifier);
        assert.ok(callback);
        return messenger.subscribe(
                eventsExchange.exchange,
                'tftp.success' + '.' + identifier,
                function(message) {
                    var _callback = callback;
                    _callback(message.data, message);
                }
        );
    };

    TaskProtocol.prototype.subscribeHttpResponse =
                        function subscribeHttpResponse(identifier, callback) {
        assert.ok(identifier);
        assert.ok(callback);
        return messenger.subscribe(
                eventsExchange.exchange,
                'http.response' + '.' + identifier,
                function(message) {
                    var _callback = callback;
                    _callback(message.data, message);
                }
        );
    };

    return new TaskProtocol();
}