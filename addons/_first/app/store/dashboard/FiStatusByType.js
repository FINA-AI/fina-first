Ext.define('first.store.dashboard.FiStatusByType', {
    extend: 'Ext.data.Store',
    alias: 'store.fiStatusByType',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config'
    ],

    fields: ['fiType', 'active', 'inactive', 'canceled'],

    proxy: {
        type: 'rest',
        enablePaging: false,
        url: first.config.Config.remoteRestUrl + 'ecm/dashboard/fiRegistryStatusCount?year=' + new Date().getFullYear(),
        reader: {
            type: 'json'
        }
    }

});