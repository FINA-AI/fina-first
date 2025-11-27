Ext.define('first.model.permission.PermissionModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'authorityId', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'accessStatus', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'settable'}
    ],

    idProperty: 'id'
});