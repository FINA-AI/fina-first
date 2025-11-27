Ext.define('first.model.fi.FiDocumentRequestModel', {
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
        {name: 'description', type: 'string'},
        {name: 'dueDate', type: 'date', dateFormat: 'time'},
        {name: 'assigneeFiCode', type: 'string'},
        {name: 'assigneeFiName', type: 'string'},
        {name: 'submitted'},
        {name: 'submissionDate', type: 'date', dateFormat: 'time'},
        {name: 'createdAt', type: 'date', dateFormat: 'time'},
        {name: 'modifiedAt', type: 'date', dateFormat: 'time'}
    ],

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + 'ecm/fi/documentRequest',
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