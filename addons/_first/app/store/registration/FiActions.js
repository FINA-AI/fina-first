Ext.define('first.store.registration.FiActions', {
    extend: 'Ext.data.Store',


    alias: 'store.actionsStoreEcm',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
    ],

    fields: [
        {name: 'id'},
        {name: 'name'},
        {name: 'createdAt', type: 'date', dateFormat: 'time'}
    ],

    sorters: [
        {
            property: 'createdAt',
            direction: 'ASC'
        }
    ],

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
                                let obj = {};

                                obj.id = record.id;
                                obj.name = record.name;
                                obj.createdAt = record.createdAt;

                                if (record.properties) {
                                    obj.author = record.modifiedBy.displayName
                                        ? record.modifiedBy.displayName.split(' ').map(d => d === 'NONAME'? '' : d).join(' ')
                                        : record.modifiedBy.createdBy.id;
                                    obj.processId = record.properties['fina:fiRegistryActionProcessId'];
                                    obj.type = record.properties['fina:fiRegistryActionType'];
                                    obj.documentsFolderId = record.properties['fina:fiRegistryActionDocumentsFolderId'];
                                    obj.taskNumber = record.properties['fina:fiRegistryActionTaskNumber'];
                                    obj.taskReceiptDate = record.properties['fina:fiRegistryActionTaskReceiptDate'];
                                    obj.changeFormType = record.properties['fina:fiChangeFormType'];
                                }

                                result.push(obj);
                            }
                        }, this);
                    }
                    return result;
                },
                scope: this
            }
        }, writer: {
            type: 'json',
            writeAllFields: true
        }
    }

});
