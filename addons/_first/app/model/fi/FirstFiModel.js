Ext.define('first.model.fi.FirstFiModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'fiTypeCode', type: 'string'}
    ],

    idProperty: 'id'
});