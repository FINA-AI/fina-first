Ext.define('first.model.organization.OrganizationIndividualModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.identifier.Negative',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.validator.Format',
        'Ext.data.validator.Length',
        'Ext.data.writer.Json',
        'first.config.Config'
    ],

    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'nameLatin', type: 'string'},
        {name: 'surname', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'taxId', type: 'string'},
        {name: 'personalId', type: 'string'},
        {name: 'stateRegOrDocNumber', type: 'string'},
        {name: 'stateRegOrBirthDate', type: 'date', dateFormat: 'time'},
        {name: 'address', type: 'string'},
        {name: 'idType', type: 'string'},
        {name: 'organizationalForm', type: 'string'},
        {name: 'gender', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'education', type: 'string'},
        {name: 'website', type: 'string'},
        {name: 'createdAt', type: 'date', dateFormat: 'time'},
        {name: 'modifiedAt', type: 'date', dateFormat: 'time'},
        {name: 'assignmentDate', type: 'date', dateFormat: 'time'},
        {name: 'documentNumber', type: 'string'},
        {name: 'position', type: 'string'},
        {name: 'birthPlace', type: 'string'},
        {name: 'citizenship', type: 'string'},
        {name: 'comments', type: 'string'},
        {name: 'registryId', type: 'string'},
        {name: 'branchId', type: 'string'},
        {name: 'attestationStatus', type: 'string'}
    ],

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + 'organizationIndividual',
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