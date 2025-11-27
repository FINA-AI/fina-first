Ext.define('first.store.common.EcmUsersStore', {
    extend: 'Ext.data.Store',

    alias: 'store.ecmUsersStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.common.EcmUserModel'
    ],

    model: 'first.model.common.EcmUserModel',

    autoLoad: true,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/people/all",
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