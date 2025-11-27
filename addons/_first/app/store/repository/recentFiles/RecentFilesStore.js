/**
 * Created by oto on 6/18/19.
 */
Ext.define('first.store.repository.recentFiles.RecentFilesStore', {
    extend: 'Ext.data.Store',

    alias: 'store.recentFiles',

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
            property: 'modifiedAt',
            direction: 'DESC'
        }
    ],

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/search/recentFiles",
        simpleSortMode: true,
        sortParam: 'orderBy',
        directionParam: 'orderBy',
        reader: {
            type: 'json',
            rootProperty: 'objects',
            totalProperty: 'pagination.totalItems'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});