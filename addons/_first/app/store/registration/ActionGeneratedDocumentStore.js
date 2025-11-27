Ext.define('first.store.registration.ActionGeneratedDocumentStore', {
    extend: 'Ext.data.Store',

    alias: 'store.actionGeneratedDocumentStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
    ],

    model: 'first.model.repository.NodeModel',
    autoLoad: false,

    proxy: {
        type: 'rest',
        enablePaging: true,
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
                        });
                    }

                    return data;
                },
                scope: this
            }
        }
    }
});