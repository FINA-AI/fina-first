/**
 * Created by nikoloz on 2019-06-28.
 */
Ext.define('first.store.Tag', {
    extend: 'Ext.data.Store',

    alias: 'store.tags',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.Tag'
    ],

    model: 'first.model.Tag',

    autoLoad: true,

    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],

    remoteSort: true,
});