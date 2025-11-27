Ext.define('first.store.licensetype.LicenseTypeStore', {
    extend: 'Ext.data.Store',

    alias: 'store.licenseTypeStore',

    storeId: 'licenseType',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.licensetype.LicenseTypeModel'
    ],

    model: 'first.model.licensetype.LicenseTypeModel',

    pageSize: 20,

    autoLoad: true,

     proxy: {
       type: 'rest',
       url: first.config.Config.remoteRestUrl + 'organizationIndividual/license/type',
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