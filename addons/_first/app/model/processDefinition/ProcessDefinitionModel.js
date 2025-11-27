Ext.define('first.model.common.processDefinition.ProcessDefinitionModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', mapping: 'processDefinition.id'},
        {name: 'description', mapping: 'processDefinition.description'},
        {name: 'title', mapping: 'processDefinition.title'},
        {name: 'name', mapping: 'processDefinition.name'},
        {name: 'key', mapping: 'processDefinition.key'},
        {name: 'startFormResourceKey', mapping: 'processDefinition.startFormResourceKey'}
    ],

    idProperty: 'id'
});