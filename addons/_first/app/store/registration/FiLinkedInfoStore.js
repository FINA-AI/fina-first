Ext.define('first.store.registration.FiLinkedInfoStore', {
    extend: 'Ext.data.Store',

    alias: 'store.fiLinkedInfoStoreEcm',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
    ],


    model: 'first.model.repository.NodeModel',

    groupField: 'linkType',

    autoLoad: false,

    remoteFilter:true,

    proxy: {
        type: 'rest',
        url: first.config.Config.remoteRestUrl,
        enablePaging: true,
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        }
    }
});
