Ext.define('first.store.common.EcmGroupStore', {
    extend: 'Ext.data.Store',

    alias: 'store.ecmGroupStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.common.EcmGroupModel'
    ],

    model: 'first.model.common.EcmGroupModel',

    autoLoad: true,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/group/all",
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