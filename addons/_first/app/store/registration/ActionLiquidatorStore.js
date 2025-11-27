Ext.define('first.store.registration.ActionLiquidatorStore', {
    extend: 'Ext.data.Store',

    alias: 'store.actionLiquidatorStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
    ],

    model: 'first.model.repository.NodeModel',
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
                    if (data && data.list) {
                        Ext.each(data.list, function (record) {
                            if (record) {
                                let props = record.properties;
                                if (props) {
                                    Ext.Object.each(props, function (key, val) {
                                        record[key.replace(':', '_')] = val;
                                        if (key === 'fina:fiLiquidatorReportCardDocument') {
                                            record['fina_fiActionLiquidatorReportCardDocumentReferenceId'] = val.id;
                                            record['fina_fiActionLiquidatorReportCardDocumentNumber'] = val.properties['fina:fiDocumentNumber'];
                                            record['fina_fiActionLiquidatorReportCardDocumentDate'] = val.properties['fina:fiDocumentDate'];
                                        } else if (key === 'fina:fiLiquidatorLetterDocument') {
                                            record['fina_fiActionLiquidatorLetterDocumentReferenceId'] = val.id;
                                            record['fina_fiActionLiquidatorLetterDocumentNumber'] = val.properties['fina:fiDocumentNumber'];
                                            record['fina_fiActionLiquidatorLetterDocumentDate'] = val.properties['fina:fiDocumentDate'];
                                        }
                                    });
                                }
                            }
                        });
                    }

                    return data;
                },
                scope: this
            }
        }
    }
});