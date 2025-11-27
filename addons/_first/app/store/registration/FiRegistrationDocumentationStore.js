Ext.define('first.store.registration.FiRegistrationDocumentationStore', {
    extend: 'Ext.data.Store',

    alias: 'store.registrationDocumentationStoreEcm',

    requires: [
        'Ext.data.proxy.Rest'
    ],

    pageSize: 200,

    autoLoad: false,

    proxy: {
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
                                        ? record.createdBy.displayName.split(' ').map(d => d === 'NONAME' ? '' : d).join(' ')
                                        : record.createdBy.id;
                                }

                                if (record.createdAt) {
                                    record.creationDate = new Date(parseInt(record.createdAt));
                                }
                                if (record.modifiedAt) {
                                    record.modifiedDate = new Date(parseInt(record.modifiedAt));
                                }

                                if (record.nodeType === 'fina:fiDocument') {
                                    record.documentNumber = record.properties['fina:fiDocumentNumber'];
                                    record.documentDate = record.properties['fina:fiDocumentDate'];
                                } else {
                                    record.documentNumber = record.properties['fina:actionDocumentsFolderConfigDocumentNumber'];
                                    record.documentDate = record.properties['fina:actionDocumentsFolderConfigDocumentDate'];
                                }

                                for (let prop in props) {
                                    record[prop.replace(':', '_')] = props[prop];
                                }

                                result.push(record);
                            }
                        }, this);
                    }
                    return result;
                },
                scope: this
            }
        }
    },
    listeners: {
        load: function (store, data) {
            this.fireEvent('renewDocumentationBreadcrumb', data.filter(item => item.get('folder')));
        }
    }
});