Ext.define('first.store.property.PropertyStore', {
    extend: 'Ext.data.Store',

    alias: 'store.configPropertyStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.property.ConfigPropertyModel'
    ],


    model: 'first.model.property.ConfigPropertyModel',

    autoLoad: true,

    pageSize: 50,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/config/properties",
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
        },
        writer: {
            writeRecordId: false,
            writeAllFields: true
        }
    }
});