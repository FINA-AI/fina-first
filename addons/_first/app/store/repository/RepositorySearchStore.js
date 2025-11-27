/**
 * Created by oto on 27.05.20.
 */
Ext.define('first.store.repository.RepositorySearchStore', {
    extend: 'Ext.data.Store',
    alias: 'store.repositorySearchStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.search.SearchModel'
    ],

    model: 'first.model.search.SearchModel',

    autoLoad: false,

    proxy: {
        type: 'rest',
        url: first.config.Config.remoteRestUrl + "ecm/search/personalFiles",
        headers: {
            'Accept-Language': '*'
        },
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        }
    }
});