Ext.define('first.view.registration.task.shared.ActionLiquidatorView', {
    extend: 'Ext.grid.Panel',

    xtype: 'actionLiquidatorView',

    requires: [
        'first.view.registration.task.shared.ActionLiquidatorController'
    ],

    controller: 'actionLiquidatorController',

    layout: {
        type: 'fit'
    },

    columnLines: true,

    store: {
        type: 'actionLiquidatorStore'
    },

    selModel: {
        type: 'cellmodel'
    },

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

    tbar: {
        reference: 'actionLiquidatorTbar',
        items: [{
            text: i18n.add,
            iconCls: 'x-fa fa-plus',
            cls: 'finaSecondaryBtn',
            handler: 'onAddLiquidatorClick'
        }]
    },

    columns: [{
        flex: 0,
        xtype: 'rownumberer'
    }, {
        xtype: 'actioncolumn',
        flex: 1,
        menuDisabled: true,
        sortable: false,
        hideable: false,
        items: [{
            iconCls: 'x-fa fa-eye icon-margin',
            tooltip: i18n.view,
            handler: 'onViewClick'
        }]
    }, {
        hidden: true,
        flex: 0,
        header: i18n.type,
        dataIndex: 'fina_fiActionLiquidatorType',
        renderer: function (content, cell, record) {
            let value = record.get('fina_fiActionLiquidatorType');
            let v = value.includes(":") ? value.split(":")[1] : value;
            return i18n[v] ? i18n[v] : v;
        }
    }, {
        hidden: true,
        flex: 1,
        header: i18n.liquidatorsFirstName,
        dataIndex: 'fina_fiActionLiquidatorFirstName'
    }, {
        hidden: true,
        flex: 1,
        header: i18n.liquidatorsLastName,
        dataIndex: 'fina_fiActionLiquidatorLastName'
    }, {
        hidden: true,
        flex: 1,
        header: i18n.liquidatorsIdentificationNumber,
        dataIndex: 'fina_fiActionLiquidatorIdentificationNumber'
    }, {
        flex: 1,
        header: i18n.liquidator,
        dataIndex: 'fina_fiActionLiquidatorIdentificationNumber',
        renderer: function (value, cell, record) {
            return record.get('fina_fiActionLiquidatorFirstName') + ' ' + record.get('fina_fiActionLiquidatorLastName') + ' - ' + record.get('fina_fiActionLiquidatorIdentificationNumber');
        }
    }, {
        flex: 2,
        text: i18n.liquidatorsReportCardTitle,
        columns: [{
            xtype: 'actioncolumn',
            text: i18n.generateDownloadUpload,
            flex: 1,
            menuDisabled: true,
            sortable: false,
            hideable: false,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-cog',
                tooltip: i18n.generate,
                handler: 'onGenerateLiquidatorReportCardClick',
                isDisabled: 'isGenerateLiquidatorReportCardDisabled'
            }, '', {
                iconCls: 'x-fa fa-cloud-download-alt',
                tooltip: i18n.download,
                handler: 'onDownloadLiquidatorReportCardClick',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('fina_fiLiquidatorReportCardDocument');
                }
            }, '', {
                iconCls: 'x-fa fa-cloud-upload-alt',
                tooltip: i18n.upload,
                handler: 'onUploadLiquidatorReportCardClick',
                isDisabled: 'isUploadLiquidatorReportCardDisabled'
            }]
        }, {
            flex: 1,
            text: i18n.documentDate,
            dataIndex: 'fina_fiActionLiquidatorReportCardDocumentDate',
            bind: {
                hidden: '{!liquidatorReadOnlyFields && actionStep===1}'
            },
            renderer: function (content, cell, record) {
                let value = record.get('fina_fiActionLiquidatorReportCardDocumentDate');
                if (value) {
                    return Ext.Date.format(new Date(value), first.config.Config.dateFormat);
                }
                return '';
            }
        }, {
            flex: 1,
            text: i18n.documentDate,
            dataIndex: 'fina_fiActionLiquidatorReportCardDocumentDate',
            xtype: 'datecolumn',
            format: first.config.Config.dateFormat,
            bind: {
                hidden: '{liquidatorReadOnlyFields || actionStep!==1}'
            },
            editor: {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                selectOnFocus: false,
                allowBlank: 'false'
            }
        }, {
            flex: 1,
            text: i18n.documentNumber,
            dataIndex: 'fina_fiActionLiquidatorReportCardDocumentNumber',
            editor: {
                bind: {
                    disabled: '{liquidatorReadOnlyFields || actionStep!==1}',
                },
                minChars: 1
            }
        }]
    }, {
        flex: 2,
        text: i18n.liquidatorLetter,
        columns: [{
            xtype: 'actioncolumn',
            text: i18n.generateDownloadUpload,
            flex: 1,
            menuDisabled: true,
            sortable: false,
            hideable: false,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-cog',
                tooltip: i18n.generate,
                handler: 'onGenerateLiquidatorLetterClick',
                isDisabled: 'isGenerateLiquidatorLetterDisabled'
            }, '', {
                iconCls: 'x-fa fa-cloud-download-alt',
                tooltip: i18n.download,
                handler: 'onDownloadLiquidatorLetterClick',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('fina_fiLiquidatorLetterDocument');
                }
            }, '', {
                iconCls: 'x-fa fa-cloud-upload-alt',
                tooltip: i18n.upload,
                handler: 'onUploadLiquidatorLetterClick',
                isDisabled: 'isUploadLiquidatorLetterDisabled'
            }]
        }, {
            flex: 1,
            text: i18n.documentDate,
            dataIndex: 'fina_fiActionLiquidatorLetterDocumentDate',
            xtype: 'datecolumn',
            format: first.config.Config.dateFormat,
            bind: {
                hidden: '{!liquidatorReadOnlyFields}'
            },
            renderer: function (content, cell, record) {
                let value = record.get('fina_fiActionLiquidatorLetterDocumentDate');
                if (value) {
                    return Ext.Date.format(new Date(value), first.config.Config.dateFormat);
                }
                return '';
            }
        }, {
            flex: 1,
            text: i18n.documentDate,
            dataIndex: 'fina_fiActionLiquidatorLetterDocumentDate',
            xtype: 'datecolumn',
            format: first.config.Config.dateFormat,
            bind: {
                hidden: '{liquidatorReadOnlyFields}'
            },
            editor: {
                xtype: 'datefield',
                format: first.config.Config.dateFormat
            }
        }, {
            flex: 1,
            text: i18n.documentNumber,
            dataIndex: 'fina_fiActionLiquidatorLetterDocumentNumber',
            editor: {
                bind: {
                    disabled: '{liquidatorReadOnlyFields}'
                },
                minChars: 1
            }
        }],
        hidden: true,
        bind: {
            hidden: '{fiAction.fina_fiRegistryActionStep !== 4}'
        }
    }, {
        xtype: 'actioncolumn',
        flex: 1,
        menuDisabled: true,
        sortable: false,
        hideable: false,
        items: [{
            iconCls: 'x-fa fa-minus-circle icon-margin',
            tooltip: i18n.delete,
            handler: 'onDeleteClick',
            isDisabled: 'isDeleteLiquidatorDisabled'
        }]
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        afterrender: 'afterRender'
    }

});
