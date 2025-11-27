/**
 * Created by oto on 24.04.20.
 */
Ext.define('first.store.repository.share.SharedFilesStore', {
    extend: 'Ext.data.Store',

    alias: 'store.sharedfiles',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.repository.NodeModel'
    ],


    model: 'first.model.repository.NodeModel',

    autoLoad: true,

    remoteSort: true,
    sorters: [
        {
            property: 'name',
            direction: 'asc'
        }
    ],


    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/share/files",
        simpleSortMode: true,
        sortParam: 'orderBy',
        directionParam: 'orderBy',
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