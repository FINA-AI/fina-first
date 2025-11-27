Ext.define('first.store.blacklist.Blacklist', {
    extend: 'Ext.data.Store',

    alias: 'store.blacklists',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config'
    ],

    storeId: 'blacklists',

    autoLoad: true,

    remoteSort: true,
    remoteFilter: true,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + 'blacklist',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults',
            transform: {
                fn: function (data) {
                    let result = [];
                    if (data && data.list) {

                        Ext.each(data.list, function (record) {
                            if (record) {
                                if (record.properties) {
                                    let model = {
                                        id : record.id
                                    };

                                    if (record.createdAt) {
                                        model.createdAt = new Date(parseInt(record.createdAt));
                                    }

                                    for (let i in record.properties) {
                                        model[i.replace(":", "_")] = record.properties[i];
                                    }

                                    result.push(model);
                                }
                            }
                        }, this);
                        data.list = result;
                    }

                    return data;
                },
                scope: this
            }
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            transform: {
                fn: function (data) {
                    let obj = {};

                    Ext.Object.each(data, function (key) {
                        obj[key.replace('_', ':')] = data[key]
                    });

                    delete obj['createdAt'];
                    return obj
                }
            }
        }
    }
});