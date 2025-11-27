/**
 * Created by oto on 6/6/19.
 */
Ext.define('first.store.repository.common.CommonStore', {
    extend: 'Ext.data.Store',

    alias: 'store.commonFilesStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.repository.NodeModel'
    ],


    model: 'first.model.repository.NodeModel',

    autoLoad: false,
    remoteSort: true,
    sorters: [
        {
            property: 'modifiedAt',
            direction: 'DESC'
        }
    ],

    pageSize: 20,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/",
        simpleSortMode: true,
        directionParam: 'orderBy',
        sortParam: 'orderBy',
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