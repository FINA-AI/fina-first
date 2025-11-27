Ext.define('first.model.FiRegistryModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id'},

        {name: 'lastProcessId'},

        {name: 'fiTypeCode'},

        {name: 'code'},

        {name: 'name'},

        {name: 'actionType', type: 'string'},

        {name: 'author', type: 'string'},

        {name: 'createdAt', type: 'date', dateFormat: 'time'},

        {name: 'status', type: 'string'},

        {name: 'progress'},

        {name: 'lastActionId', type: 'string'},

        {name: 'licenseStatus', type: 'string'},

        {name: 'isHistoricData', type: 'boolean'},

        {name: 'binder', type: 'string'},

        {name: 'archivedGapTaskCount'},

        {name: 'lastLegalActDate', type: 'date', dateFormat: 'time'},

        {name: 'lastLegalActNumber', type: 'string'},

        {name: 'lastActionDate', type: 'date', dateFormat: 'time'},

        {name: 'directorFullName', type: 'string'}
    ],

    idProperty: 'id'

});