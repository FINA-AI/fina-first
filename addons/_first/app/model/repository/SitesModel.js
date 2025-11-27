/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.model.repository.SitesModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'guid', type: 'string'},
        {name: 'role', type: 'string'},
        {name: 'role', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'visibility'},
        {name: 'preset', stype: 'string'},
    ],

    idProperty: 'id'
});