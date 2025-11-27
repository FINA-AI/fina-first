Ext.define('first.store.registration.FiRegistry', {
    extend: 'Ext.data.Store',

    alias: 'store.fiRegistryEcm',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.FiRegistryModel'
    ],

    model: 'first.model.FiRegistryModel',

    autoLoad: false,
    remoteSort: true,
    sorters: [{
        property: 'lastActionDate',
        direction: 'DESC'
    }],

    grouper: {
        property: "fiTypeCode"
    },

    pageSize: 30,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + 'ecm/fi',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        }
    }
});
