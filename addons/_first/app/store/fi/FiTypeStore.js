Ext.define('first.store.fi.FiTypeStore', {
    extend: 'Ext.data.Store',

    alias: 'store.fiTypeStore',

    storeId: 'fiTypeStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.fi.FiTypeModel'
    ],

    model: 'first.model.fi.FiTypeModel',

    autoLoad: true,
    pageSize: 20,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + 'ecm/fi/types',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});