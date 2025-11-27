Ext.define('first.store.fi.FiDocumentRequestStore', {
    extend: 'Ext.data.Store',

    alias: 'store.fiDocumentRequest',

    storeId: 'fiDocumentRequest',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.blacklist.Blacklist'
    ],

    groupField: 'name',

    model: 'first.model.fi.FiDocumentRequestModel',

    pageSize: 20,

    autoLoad: false
});