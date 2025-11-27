Ext.define('first.store.common.NodePropertyStore', {
    extend: 'Ext.data.Store',

    alias: 'store.nodePropertyStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.repository.NodeModel'
    ],

    model: 'first.model.repository.NodeModel',

    autoLoad: false,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl,
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults',
            transform: {
                fn: function (data) {
                    if (data && data.list) {
                        Ext.each(data.list, function (record) {
                            if (record) {
                                let props = record.properties;
                                if (props) {
                                    Ext.Object.each(props, function (key, val) {
                                        record[key.replace(':', '_')] = val;
                                    });
                                }
                            }
                        }, this);
                    }

                    return data;
                },
                scope: this
            }
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});