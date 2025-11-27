/**
 * Created by oto on 25.05.20.
 */
Ext.define('first.model.repository.VersionModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'versionComment', type: 'string'},
        {name: 'name'},
        {name: 'nodeType'},
        {name: 'isFolder'},
        {name: 'isFile'},
        {name: 'modifiedAt', type: 'date', dateFormat: 'time'},
        {name: 'modifiedByUserDescription', mapping: 'modifiedByUser.displayName'},
        {name: 'content'},
        {name: 'properties'}
    ],

    idProperty: 'id'
});