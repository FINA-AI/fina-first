Ext.define('first.store.search.SearchStore', {
    extend: 'Ext.data.Store',

    alias: 'store.searchStore',
    storeId: 'searchStore',
    id: 'searchStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
    ],


    model: 'first.model.search.SearchModel',

    autoLoad: false,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/search",
        headers : {
            'Accept-Language' : '*'
        },
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        }
    }
});