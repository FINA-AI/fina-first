/**
 * Created by meryc on 14.05.2020.
 */
Ext.define('first.store.registration.EditorUsersStore', {
    extend: 'Ext.data.Store',

    alias: 'store.editorUsersStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.common.EcmUserModel'
    ],

    model: 'first.model.common.EcmUserModel',

    autoLoad: true,

    sorters: [{
       property: 'displayName'
    }],

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/people/editors",
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