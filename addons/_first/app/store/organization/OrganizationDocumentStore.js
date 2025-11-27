/**
 * Created by oto on 22.06.20.
 */
Ext.define('first.store.organization.OrganizationDocumentStore', {
    extend: 'Ext.data.Store',
    alias: 'store.organizationDocument',

    requires: [
        'Ext.data.proxy.Rest'
    ],

    pageSize: 20,

    autoLoad: false,

    proxy: {
        type: 'rest',
        enablePaging: true,
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        }
    }
});