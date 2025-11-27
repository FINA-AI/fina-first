Ext.define('first.model.common.EcmGroupModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'displayName', type: 'string'}
    ],

    idProperty: 'id'
});