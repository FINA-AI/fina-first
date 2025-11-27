/**
 * Created by nikoloz on 2019-06-28.
 */
Ext.define('first.model.Tag', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.identifier.Negative',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.validator.Format',
        'Ext.data.validator.Length',
        'Ext.data.writer.Json',
        'first.config.Config'
    ],

    fields: [
        {name: 'name', type: 'string'},
    ],

    identifier: {
        type: 'negative'
    },

    validators: {
        name: [
            {type: 'length', min: 2},
            {type: 'format', matcher: /([a-z])/i}
        ]
    },

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "tag",
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults',
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});