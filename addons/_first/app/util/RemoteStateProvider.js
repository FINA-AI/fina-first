Ext.define('first.util.RemoteStateProvider', {
    extend: 'Ext.state.Provider',
    requires: ['Ext.state.Provider', 'Ext.Ajax'],

    config: {
        url: null,
        stateRestoredCallback: null
    },

    constructor: function (config) {
        if (!config.url) {
            throw 'first.util.RemoteStateProvider: Missing url';
        }

        this.initConfig(config);

        this.restoreState();
        this.callParent(arguments);
    },

    set: function (name, value) {
        var me = this;

        if (typeof value == 'undefined' || value === null) {
            me.clear(name);
            return;
        }

        me.saveStateForKey(name, value);
        me.callParent(arguments);
    },

    restoreState: function () {
        var me = this,
            callback = me.getStateRestoredCallback();

        Ext.Ajax.request({
            url: me.getUrl(),
            method: 'GET',
            success: function (response, options) {
                const result = JSON.parse(response.responseText.trim());
                result.forEach(function (state) {
                    me.state[state.key] = me.decodeValue(state.value);
                });
                if (callback) {
                    callback();
                }
            },
            failure: function (response) {
                console.log('first.util.RemoteStateProvider: restoreState failed', arguments);
                first.util.ErrorHandlerUtil.showErrorWindow(response);
                if (callback) {
                    callback();
                }
            }
        });
    },

    clear: function (name) {
        var me = this;
        me.clearStateForKey(name);
        me.callParent(arguments);
    },

    saveStateForKey: function (key, value) {
        var me = this;
        var model = {};
        model['key'] = key;
        model['value'] = me.encodeValue(value);

        Ext.Ajax.request({
            url: me.getUrl(),
            method: 'POST',
            jsonData: JSON.stringify(model),
            failure: function (response) {
                console.log('first.util.RemoteStateProvider: saveStateForKey failed', arguments);
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    clearStateForKey: function (key) {
        var me = this;

        var model = {};
        model['key'] = key;
        model['value'] = '';    // does not matter now

        Ext.Ajax.request({
            url: me.getUrl(),
            method: 'DELETE',
            jsonData: JSON.stringify(model),
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    }
});
