Ext.define('first.store.registration.CorrespondenceStore', {
    extend: 'Ext.data.Store',

    alias: 'store.correspondenceStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config'
    ],

    autoLoad: false,

    pageSize: 30,

    sorters: [
        {
            property: 'fina_smsSendDate',
            direction: 'DESC'
        },
        {
            property: 'fina_smsCreationDate',
            direction: 'DESC'
        }],

    proxy: {
        autoLoad: false,
        type: 'rest',
        enablePaging: true,
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
                                let props = record.properties;

                                if (record.createdBy) {
                                    record.author = record.createdBy.displayName
                                        ? record.createdBy.displayName.split(' ').map(d => d === 'NONAME'? '' : d).join(' ')
                                        : record.createdBy.id;
                                }

                                if (record.createdAt) {
                                    record.creationDate = new Date(parseInt(record.createdAt));
                                }
                                if (record.modifiedAt) {
                                    record.modifiedDate = new Date(parseInt(record.modifiedAt));
                                }

                                for (let prop in props) {
                                    record[prop.replace(':', '_')] = props[prop];
                                }

                                result.push(record);
                            }
                        }, this);
                    }
                    return {
                        list: result,
                        totalResults: data.totalResults
                    };
                },
                scope: this
            }
        }
    }
});