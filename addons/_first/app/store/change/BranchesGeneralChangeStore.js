Ext.define('first.store.change.BranchesGeneralChangeStore', {
    extend: 'Ext.data.Store',

    alias: 'store.branchesGeneralChanges',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.repository.NodeModel'
    ],


    model: 'first.model.repository.NodeModel',

    autoLoad: false,

    proxy: {
        type: 'rest',
        url: first.config.Config.remoteRestUrl,
        enablePaging: true,
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults',
            transform: {
                fn: function (data) {
                    var transform = function (timestamp) {
                        if (timestamp) {
                            return timestamp / 1000 + '';
                        }
                        return timestamp;
                    };

                    if (data && data.list) {
                        Ext.each(data.list, function (record) {
                            if (record) {
                                let props = record.properties;
                                if (props) {
                                    let branchChangeStatus = props['fina:fiBranchesChangeFinalStatus'];
                                    Ext.Object.each(props, function (key, val) {
                                        record[key.replace(':', '_')] = val;
                                        if (key === 'fina:fiBranchRefusalLetterDocument') {
                                            record['fina_refusalLetterDocumentNumber'] = val.properties['fina:fiDocumentNumber'];
                                            record['fina_refusalLetterDocumentDate'] = val.properties['fina:fiDocumentDate'];
                                        }

                                        if (key === 'fina:fiDocument' && branchChangeStatus === 'GAP') {
                                            record['fina_fiDocumentNumber'] = val.properties['fina:fiDocumentNumber'];
                                            record['fina_fiDocumentDate'] = val.properties['fina:fiDocumentDate'];
                                        } else if (key === 'fina:fiBranchDecreeDocument' && branchChangeStatus !== 'GAP') {
                                            record['fina_fiDocumentNumber'] = val.properties['fina:fiDocumentNumber'];
                                            record['fina_fiDocumentDate'] = val.properties['fina:fiDocumentDate'];
                                        }

                                    });
                                }
                            }
                        }, this);
                    }

                    return data;
                },
                scope: this
            }
        },
        writer: {
            type: 'json',
            writeAllFields: false
        }
    }
});
