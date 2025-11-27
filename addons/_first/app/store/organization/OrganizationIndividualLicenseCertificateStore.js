Ext.define('first.store.organization.OrganizationIndividualLicenseCertificateStore', {
    extend: 'Ext.data.Store',

    alias: 'store.organizationIndividualLicenseCertificate',

    storeId: 'organizationIndividualLicenseCertificate',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.organization.OrganizationIndividualLicenseCertificateModel'
    ],

    model: 'first.model.organization.OrganizationIndividualLicenseCertificateModel',

    pageSize: 20,

    autoLoad: false,

     proxy: {
       type: 'rest',
       enablePaging: true,
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