Ext.define('first.store.attestation.Attestation', {
    extend: 'Ext.data.Store',

    alias: 'store.attestations',

    requires: [
        'Ext.data.identifier.Negative',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.validator.Format',
        'Ext.data.validator.Length',
        'Ext.data.writer.Json',
        'first.config.Config'
    ],

    autoLoad: true,

    sorters: [{
        property: 'createdAt',
        direction: 'DESC'
    }],

    remoteSort: true,
    remoteFilter: true,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/attestation",
        headers: {
            'Accept-Language': '*'
        },
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults',
            transform: {
                fn: function (data) {
                    let result = [];

                    if (data && data.list) {
                        Ext.each(data.list, function (record) {
                            if (record) {
                                if (record.properties) {
                                    let model = {
                                        id : record.id
                                    };

                                    if (record.createdAt) {
                                        model.createdAt = new Date(parseInt(record.createdAt));
                                    }

                                    for (let i in record.properties) {
                                        model[i.replace(":", "_")] = record.properties[i];
                                    }

                                    result.push(model);
                                }
                            }
                        }, this);
                        data.list = result;
                    }
                    return data;
                },
            }
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});