/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.store.repository.sites.SitesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.sites',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.repository.NodeModel'
    ],


    model: 'first.model.repository.NodeModel',

    autoLoad: false,

    remoteSort: true,
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],

    pageSize: 20,

    proxy: {
        simpleSortMode: true,
        sortParam: 'orderBy',
        directionParam: "orderBy",
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/sites/load",
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