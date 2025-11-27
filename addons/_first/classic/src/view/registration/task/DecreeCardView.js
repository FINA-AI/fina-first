Ext.define('first.view.registration.task.DecreeCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'decreeView',

    requires: [
        'Ext.button.Button',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Ext.form.FieldSet',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.Date',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.selection.CellModel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.config.Config',
        'first.model.repository.NodeModel',
        'first.view.registration.task.DecreeCardController'
    ],

    controller: 'decreeController',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    reference: 'decreeView',

    scrollable: true,

    items: [{
        xtype: 'label',
        hidden: true,
        bind: {
            html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToRedactor + "</br></br></br><b><i>" + ' " {redactorName} "' + '</b></i></p>',
            hidden: '{!taskRedactor}'
        }
    }, {
        xtype: 'fieldset',
        title: i18n.goToSanctionedPeopleChecklist,
        flex: 0,
        margin: '15 10 0 10',
        items: [{
            xtype: 'panel',
            items: [{
                xtype: 'button',
                text: i18n.checkResult,
                cls: 'finaSecondaryBtn',
                margin: '10 10 10 10',
                flex: 0,
                handler: 'onSanctionedPeopleChecklistReviewClick'
            }]
        }]
    }, {
        xtype: 'fieldset',
        title: i18n.controllerChekResults,
        flex: 0,
        margin: '20 10 0 10',
        items: [{
            xtype: 'form',
            margin: '5 0 5 0',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            padding: 'auto',
            items: [{
                xtype: 'textfield',
                fieldLabel: i18n.status,
                editable: false,
                inputWrapCls: '',
                triggerWrapCls: '',
                flex: 1,
                bind: {
                    value: '{decreeFiAction.fina_fiRegistryActionControlStatusI18n}'
                }
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.comment,
                editable: false,
                inputWrapCls: '',
                triggerWrapCls: '',
                flex: 1,
                bind: {
                    value: '{fiAction.fina_fiRegistryActionControllerComment}'
                }
            }]
        }]
    }, {
        xtype: 'fieldset',
        title: i18n.reportCardTitle,
        flex: 0,
        margin: '20 10 0 10',
        items: [{
            xtype: 'form',
            margin: '5 0 5 0',
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
            padding: 'auto',
            items: [{
                xtype: 'textfield',
                editable: false,
                inputWrapCls: '',
                triggerWrapCls: '',
                flex: 1,
                bind: {
                    value: '{existingReportCard.infoText}'
                }
            }, {
                xtype: 'button',
                text: i18n.downloadReportCard,
                iconCls: 'x-fa fa-cloud-download-alt',
                cls: 'finaSecondaryBtn',
                flex: 0,
                disabled: true,
                bind: {
                    disabled: '{!existingReportCard.infoText}'
                },
                handler: 'onReportCardDownloadClick',
                disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
            }]
        }]
    }, {
        flex: 1,
        margin: '20 0 0 0',
        minHeight: 200,
        border: false,
        xtype: 'grid',
        columnLines: true,
        reference: 'decreeBranchGridView',

        selModel: {
            type: 'cellmodel'
        },

        plugins: [{
            ptype: 'cellediting',
            clicksToEdit: 1,
            listeners: {
                beforeedit: 'beforeCellEdit'
            }
        }],

        tbar: {
            items: [{
                xtype: 'button',
                iconCls: 'x-fa fa-cog',
                cls: 'finaSecondaryBtn',
                text: i18n.generateDocuments,
                handler: 'onGenerateDocumentsButtonClick',
                disabled: true,
                bind: {
                    disabled: '{theFi.fina_fiRegistryStatus != "IN_PROGRESS"|| taskRedactor}'
                },
                flex: 0
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-cloud-download-alt',
                cls: 'finaSecondaryBtn',
                text: i18n.representativeLetterDownload,
                handler: 'onLetterToTheRepresentativeDownloadClick',
                disabled: true,
                bind: {
                    disabled: '{!existingLetterToTheRepresentative.id}'
                },
                disabledTooltip: i18n.pleaseGeneratePrescriptionDisabledTooltip,
            }],
            bind: {
                disabled: '{!isRegistryActionEditor}'
            }
        },

        store: {
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
                                }, this);
                            }

                            return data;
                        },
                        scope: this
                    }
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                }
            }
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
            resizable: false,
            align: 'center',
            text: i18n.DOCUMENT,
            items: [{
                xtype: 'button',
                iconCls: 'x-fa fa-cloud-download-alt',
                tooltip: i18n.download,
                handler: 'onDownloadDecreeDocumentCLick',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('properties')['document'];
                }
            }, '', {
                xtype: 'button',
                iconCls: 'x-fa fa-cloud-upload-alt',
                tooltip: i18n.upload,
                handler: 'onUploadDecreeDocumentCLick',
                isActionDisabled: 'isUploadDecreeDocumentDisabled'
            }]
        }, {
            text: i18n.type,
            flex: 1,
            dataIndex: 'fina_fiRegistryBranchType',
            renderer: function (content, cell, record) {
                let value = record.get('properties')['fina:fiRegistryBranchType'];
                return i18n[value] ? i18n[value] : value;
            }
        }, {
            text: i18n.filterFieldRegion,
            flex: 1,
            dataIndex: 'fina_fiRegistryBranchAddressRegion',
            renderer: function (content, cell, record) {
                let value = record.get('properties')['fina:fiRegistryBranchAddressRegion'];
                return i18n[value] ? i18n[value] : value;
            }
        }, {
            text: i18n.filterFieldCity,
            flex: 1,
            dataIndex: 'fina_fiRegistryBranchAddressCity',
            renderer: function (content, cell, record) {
                let value = record.get('properties')['fina:fiRegistryBranchAddressCity'];
                return i18n[value] ? i18n[value] : value;
            }
        }, {
            text: i18n.address,
            flex: 1,
            dataIndex: 'fina_fiRegistryBranchAddress',
        }, {
            text: i18n.status,
            flex: 1,
            dataIndex: 'fina_fiRegistryBranchStatus',
            renderer: function (content, cell, record) {
                let value = record.get('properties')['fina:fiRegistryBranchStatus'];
                return i18n[value] ? i18n[value] : value;
            }
        }, {
            flex: 1,
            text: i18n.documentDate,
            dataIndex: 'fina_fiDocumentDate',
            xtype: 'datecolumn',
            format: first.config.Config.dateFormat,
            editor: {
                disabled: true,
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                bind: {
                    disabled: '{taskRedactor}'
                }
            }
        }, {
            text: i18n.documentNumber,
            flex: 1,
            dataIndex: 'fina_fiDocumentNumber',
            editor: {
                disabled: true,
                bind: {
                    disabled: '{taskRedactor}'
                },
                minChars: 1
            }
        }, {
            xtype: 'actioncolumn',
            width: 40,
            align: 'center',
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            items: [{
                xtype: 'button',
                flex: 0,
                iconCls: 'x-fa fa-cog',
                handler: 'onGenerateClick',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    let viewModel = view.grid.up().getController().getViewModel();
                    return !viewModel.get('isRegistryActionEditor') || record.get('fina_fiRegistryBranchStatus') === 'GAP';
                },
                getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                    let viewModel = view.grid.up().getController().getViewModel();
                    return !viewModel.get('isRegistryActionEditor') ?
                        'x-hide-display' :
                        "x-fa fa-cog icon-margin";
                },
                getTip: function (value, metadata, record) {
                    let branchStatus = record.get('fina_fiRegistryBranchStatus');
                    switch (branchStatus) {
                        case 'GAP':
                            return i18n.generateGapletterButtonText;
                        case 'DECLINED':
                            return i18n.generateRefusalDecreeCardButtonText;
                        default:
                            return i18n.generateDecreeDocument;
                    }
                }
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
            afterrender: 'afterGridRender'
        }
    }],

    bbar: [
        '->', {
            xtype: 'textfield',
            inputAttrTpl: " data-qtip='" + i18n.fiRegistryBinder + "' ",
            emptyText: i18n.fiRegistryBinder + ' ...',
            disabled: true,
            hidden: true,
            bind: {
                disabled: '{theFi.fina_fiRegistryStatus != "IN_PROGRESS" || !isRegistryActionEditor}',
                hidden: '{theFi.fina_fiActionType != "REGISTRATION"}',
                value: '{theFi.fina_fiRegistryBinder}'
            }
        }, {
            xtype: 'button',
            reference: 'finishRegistration',
            iconCls: 'x-fa fa-check',
            cls: 'finaPrimaryBtn',
            text: i18n.finishRegistration,
            handler: 'onFinishRegistrationClick',
            disabled: true,
            bind: {
                disabled: '{theFi.fina_fiRegistryStatus != "IN_PROGRESS" || !isRegistryActionEditor}'
            }
        }]

});
