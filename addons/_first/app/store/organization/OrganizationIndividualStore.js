Ext.define('first.store.organization.OrganizationIndividualStore', {
    extend: 'Ext.data.Store',

    alias: 'store.organizationIndividual',

    storeId: 'organizationIndividual',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.organization.OrganizationIndividualModel'
    ],

    model: 'first.model.organization.OrganizationIndividualModel',

    pageSize: 20,
    autoLoad: false,
    remoteFilter: true
});