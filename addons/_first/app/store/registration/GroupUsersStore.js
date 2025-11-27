Ext.define('first.store.registration.GroupUsersStore', {
    extend: 'Ext.data.Store',

    alias: 'store.groupUsersStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.common.EcmUserModel'
    ],

    model: 'first.model.common.EcmUserModel',

    autoLoad: false,

    sorters: [{
       property: 'displayName'
    }],

    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        }
    }
});