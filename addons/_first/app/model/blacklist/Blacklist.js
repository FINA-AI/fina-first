Ext.define('first.model.blacklist.Blacklist', {
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
        {name: 'id', type: 'string'},
        {name: 'identity', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'sanctionIntroReason', type: 'string'},
        {name: 'sanctionIntroDate', type: 'date', dateFormat: 'time'},
        {name: 'penaltyExpDate', type: 'date', dateFormat: 'time'},
        {name: 'resolutionDocNumber', type: 'string'},
        {name: 'createdAt', type: 'date', dateFormat: 'time'},
        {name: 'modifiedAt', type: 'date', dateFormat: 'time'}
    ],

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + 'blacklist',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }

});