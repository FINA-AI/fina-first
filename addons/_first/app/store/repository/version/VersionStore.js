/**
 * Created by oto on 25.05.20.
 */
Ext.define('first.store.repository.version.VersionStore', {
    extend: 'Ext.data.Store',
    alias: 'store.versions',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.repository.VersionModel'
    ],


    model: 'first.model.repository.VersionModel',

    autoLoad: false,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/node/version",
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