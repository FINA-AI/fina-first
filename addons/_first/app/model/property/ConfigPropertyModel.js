Ext.define('first.model.property.ConfigPropertyModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'parentId', type: 'string'},
        {name: 'content'},
        {name: 'createdBy'},
        {name: 'modifiedBy'},
        {name: 'properties'},
        {name: 'name', type: 'string'},
        {name: 'fina_propertyValue', type: 'string'},
        {name: 'nodeType', type: 'string', default: 'fina:configuration', defaultValue: 'fina:configuration'},
        {name: 'createdAt', type: 'date', dateFormat: 'time'},
        {name: 'modifiedAt', type: 'date', dateFormat: 'time'}
    ],

    idProperty: 'id'
});