Ext.define('first.model.tag.TagModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'tag', type: 'string'}
    ],

    idProperty: 'id'
});