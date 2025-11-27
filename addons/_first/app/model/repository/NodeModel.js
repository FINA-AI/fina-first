Ext.define('first.model.repository.NodeModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'parentId', type: 'string'},
        {name: 'path'},
        {name: 'location', mapping: 'path.name'},
        {name: 'allowableOperations'},
        {name: 'aspects'},
        {name: 'association'},
        {name: 'content'},
        {name: 'createdBy'},
        {name: 'createdByDescription', mapping: 'createdBy.displayName'},
        {name: 'modifiedBy'},
        {name: 'modifiedByUserDescription', mapping: 'modifiedBy.displayName'},
        {name: 'size', mapping: 'content.sizeInBytes'},
        {name: 'locked'},
        {name: 'link'},
        {name: 'permissions'},
        {name: 'properties'},
        {name: 'file', type: 'boolean'},
        {name: 'folder', type: 'boolean'},
        {name: 'name', type: 'string'},
        {name: 'nodeType', type: 'string'},
        {name: 'createdAt', type: 'date', dateFormat: 'time'},
        {name: 'modifiedAt', type: 'date', dateFormat: 'time'}
    ],

    idProperty: 'id'
});