Ext.define('first.store.permission.UserAndGroupStore', {
    extend: 'Ext.data.Store',

    alias: 'store.userAndGroup',

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
        url: first.config.Config.remoteRestUrl + "ecm/search/usergroup",
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