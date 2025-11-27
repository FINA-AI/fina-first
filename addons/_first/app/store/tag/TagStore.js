Ext.define('first.store.tag.TagStore', {
    extend: 'Ext.data.Store',

    alias: 'store.tagStore',

    storeId: 'tagStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.tag.TagModel'
    ],

    model: 'first.model.tag.TagModel',

    autoLoad: true,

    proxy: {
        type: 'rest',
        url: first.config.Config.remoteRestUrl + 'ecm/tag',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        }
    }
});