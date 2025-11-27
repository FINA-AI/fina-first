Ext.define('first.view.registration.task.change.ChangeEditInfoDecreeCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'changeEditInfoDecreeCard',

    requires: [
        'first.view.registration.task.change.ChangeEditInfoDecreeCardController',
        'Ext.button.Button',
        'Ext.form.FieldSet',
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
        'first.store.common.NodePropertyStore',
        'first.view.registration.task.shared.CardHeaderView'
    ],

    controller: 'changeEditInfoDecreeController',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    reference: 'changeEditInfoDecreeCard',

    scrollable: true,

    items: [{
        xtype: 'cardHeader'
    }, {
        xtype: 'fieldset',
        title: i18n.changesGridTitle,
        flex: 0,
        margin: '10 10 0 10',
        items: [{
            xtype: 'form',
            reference: 'generalInfoForm',
            margin: '5 0 5 0',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            padding: 'auto',
            items: []
        }]
    }, {
        xtype: 'fieldset',
        title: i18n.controllerChekResults,
        flex: 0,
        margin: '10 10 0 10',
        items: [
            {
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
                },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.comment,
                        editable: false,
                        inputWrapCls: '',
                        triggerWrapCls: '',
                        flex: 1,
                        bind: {
                            value: '{fiAction.fina_fiRegistryActionControllerComment}'
                        }
                    }
                ]
            }
        ]
    }, {
        xtype: 'fieldset',
        title: i18n.reportCardTitle,
        flex: 0,
        margin: '10 10 0 10',
        items: [
            {
                xtype: 'form',
                margin: '5 0 5 0',
                layout: {
                    type: 'hbox',
                    align: 'stretch',
                },
                padding: 'auto',
                items: [
                    {
                        xtype: 'textfield',
                        editable: false,
                        inputWrapCls: '',
                        triggerWrapCls: '',
                        flex: 1,
                        bind: {
                            value: '{existingReportCard.infoText}'
                        }
                    },
                    {
                        xtype: 'button',
                        cls: 'finaSecondaryBtn',
                        text: i18n.downloadReportCard,
                        iconCls: 'x-fa fa-cloud-download-alt',
                        flex: 0,
                        disabled: true,
                        bind: {
                            disabled: '{!existingReportCard.infoText}'
                        },
                        handler: 'onReportCardDownloadClick',
                        disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
                    }
                ]
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.editorComment,
                margin: '10 0 10 0',
                flex: 1,
                editable: false,
                anchor: '100%',
                bind: {
                    value: '{fiAction.fina_fiRegistryActionEditorComment}'
                }
            }]
    }, {
        hidden: true,
        xtype: 'fieldset',
        title: i18n.decreeGenerationTitle,
        flex: 0,
        margin: '10 10 10 10',
        items: [{
            xtype: 'panel',
            margin: '5 0 5 0',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            defaults: {
                labelWidth: '100%',
                flex: 1
            },
            padding: 'auto',
            items: [{
                xtype: 'textfield',
                fieldLabel: i18n.decreeNumber,
                bind: {
                    value: '{decreeDocumentNumber}',
                    disabled: '{!isRegistryActionEditor}'
                },
                listeners: {
                    blur: 'updateDecreeDocumentDetails'
                }
            }, {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                fieldLabel: i18n.decreeDate,
                bind: {
                    value: '{decreeDocumentDate}',
                    disabled: '{!isRegistryActionEditor}'
                },
                listeners: {
                    select: 'updateDecreeDocumentDetails'
                }
            }, {
                xtype: 'panel',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    iconCls: 'x-fa fa-cog',
                    cls: 'finaSecondaryBtn',
                    text: i18n.decreeGenerationTitle,
                    handler: 'onGenerateDecreeButtonClick',
                    bind: {
                        disabled: '{!isRegistryActionEditor || inReview || !isAccepted}'
                    },
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-cloud-download-alt',
                    cls: 'finaSecondaryBtn',
                    text: i18n.decreeDownload,
                    handler: 'onDecreeCardDownloadClick',
                    disabled: true,
                    bind: {
                        disabled: '{!decreeDocument}'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-cloud-upload-alt',
                    cls: 'finaSecondaryBtn',
                    text: i18n.uploadDecree,
                    handler: 'onDecreeCardUploadClick',
                    disabled: true,
                    bind: {
                        disabled: '{!isRegistryActionEditor}'
                    }
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
                }]
            }],
            bind: {
                disabled: '{!headOfficeBranch}'
            }
        }],
        bind: {
            hidden: '{fiAction.fina_fiRegistryActionChangeGenerateDecreeForAllBranches}'
        }
    }, {
        minHeight: 200,
        hidden: true,
        margin: '20 0 0 0',
        border: false,
        xtype: 'grid',
        flex: 1,
        columnLines: true,
        reference: 'decreeBranchGridView',

        selModel: {
            type: 'cellmodel'
        },

        plugins: [{
            ptype: 'cellediting',
            clicksToEdit: 1,
            listeners: {
                beforeedit: 'beforeDecreeGridCellEdit'
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
                    disabled: '{theFi.fina_fiRegistryStatus != "IN_PROGRESS" || taskRedactor}'
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
            type: 'nodePropertyStore',
        },

        columns: [{
            flex: 0,
            xtype: 'rownumberer'
        }, {
            xtype: 'actioncolumn',
            flex: 0,
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
            flex: 0,
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            align: 'center',
            items: [{
                xtype: 'button',
                flex: 0,
                iconCls: 'x-fa fa-cog icon-margin',
                handler: 'onGenerateDecreeClick',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    let viewModel = view.grid.up().up().getController().getViewModel();
                    return !viewModel.get('isRegistryActionEditor');
                },
                getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                    let viewModel = view.grid.up().up().getController().getViewModel();
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

        bind: {
            hidden: '{!fiAction.fina_fiRegistryActionChangeGenerateDecreeForAllBranches}'
        },

        listeners: {
            afterrender: 'afterDecreeGridRender'
        }

    }],

    bbar: ['->', {
        xtype: 'button',
        cls: 'finaPrimaryBtn',
        reference: 'finishRegistration',
        iconCls: 'x-fa fa-check',
        text: i18n.finishChange,
        handler: 'onFinishRegistrationClick',
        disabled: true,
        bind: {
            disabled: '{!isRegistryActionEditor || inReview || !isAccepted || !decreeDocumentValid || !decreeDocumentNumber}'
        }
    }]

});
