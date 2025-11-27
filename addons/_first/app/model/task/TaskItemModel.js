Ext.define('first.model.task.TaskItemModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'createdAt', type: 'date', dateFormat: 'timestamp'},
        {name: 'size', type: 'number'},
        {name: 'createdBy', type: 'string'},
        {name: 'modifiedAt', type: 'date', dateFormat: 'timestamp'},
        {name: 'name', type: 'string'},
        {name: 'modifiedBy', type: 'string'},
        {name: 'mimeType', type: 'string'}
    ],

    idProperty: 'id'
});