Ext.define('first.store.registration.FiProcessHistoryItemStore', {
    extend: 'Ext.data.Store',

    alias: 'store.fiProcessHistoryItemStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
    ],

    model: 'first.model.repository.NodeModel',
    autoLoad: false,

    sorters: [
        {
            sorterFn: function(record1, record2) {
                const seq1 = record1.data.properties['fina:folderConfigSequence'],
                    seq2 = record2.data.properties['fina:folderConfigSequence'];

                return seq1 === undefined ? 1 : seq2 === undefined ? -1 : seq1 > seq2 ? 1 : (seq1 === seq2) ? 0 : -1;
            },
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
                    if (data && data.list) {
                        Ext.each(data.list, function (record) {
                            if (record) {
                                let props = record.properties;
                                if (props) {
                                    Ext.Object.each(props, function (key, val) {
                                        record[key.replace(':', '_')] = val;
                                    });
                                }
                            }
                        });
                        let ignoreItems = ['ORGANIZATIONAL_FORM_AND_NAME_CHANGE_DATA', 'LEGAL_ADDRESS_CHANGE_DATA', 'DOCUMENT_WITHDRAWAL_DATA'];

                        data.list = data.list.filter(item => item.folder && !ignoreItems.includes(item.name));
                    }

                    return data;
                },
                scope: this
            }
        }
    }
});