Ext.define('first.model.licensetype.LicenseTypeModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'identifier', type: 'string'},
        {name: 'documentNumber', type: 'string'},
        {name: 'allowedOperations'},
        {name: 'registrationDate', type: 'date', dateFormat: 'time'},
    ]
});