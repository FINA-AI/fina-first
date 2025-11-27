Ext.define('first.view.registration.task.cancellation.CancellationDecreeCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'cancellationDecreeCardView',

    requires: [
        'first.view.registration.task.cancellation.CancellationDecreeCardController'
    ],

    controller: 'cancellationDecreeCardController',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'cardHeader'
    }, {
        xtype: 'label',
        hidden: true,
        bind: {
            html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToRedactor + "</br></br></br><b><i>" + ' " {redactorName} "' + '</b></i></p>',
            hidden: '{!taskRedactor}'
        }
    }, {
        xtype: 'fieldset',
        margin: '5 5 0 5',
        title: '<b>' + i18n.controllerChekResults + '</b>',
        items: [{
            xtype: 'form',
            margin: '5 0 5 0',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            defaults: {
                xtype: 'textfield',
                editable: false
            },
            items: [{
                fieldLabel: i18n.status,
                bind: {
                    value: '{decreeFiAction.fina_fiRegistryActionControlStatusI18n}'
                }
            }, {
                fieldLabel: i18n.comment,
                bind: {
                    value: '{fiAction.fina_fiRegistryActionControllerComment}'
                }
            }]
        }]
    }, {
        xtype: 'fieldset',
        margin: '5 5 5 5',
        title: '<b>' + i18n.reportCardTitle + '</b>',
        items: [{
            xtype: 'form',
            margin: '5 0 5 0',
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
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
                margin: '0 0 0 5',
                text: i18n.downloadReportCard,
                iconCls: 'x-fa fa-cloud-download-alt',
                cls: 'finaSecondaryBtn',
                disabled: true,
                bind: {
                    disabled: '{!existingReportCard.infoText}'
                },
                handler: 'onReportCardDownloadClick',
                disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
            }]
        }]
    }, {
        xtype: 'grid',
        columnLines: true,
        flex: 1,
        reference: 'cancellationDecreeBranchGridView',

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
            cls:'firstFiRegistryTbar',
            defaults: {
                bind: {
                    disabled: '{theFi.fina_fiRegistryStatus != "IN_PROGRESS"|| taskRedactor}'
                }
            },
            items: [{
                iconCls: 'x-fa fa-cog',
                cls: 'finaSecondaryBtn',
                text: i18n.decreeGenerationTitle,
                handler: 'onGenerateDocumentsButtonClick',
                disabled: true
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-cloud-download-alt',
                cls: 'finaSecondaryBtn',
                text: i18n.representativeLetterDownload,
                handler: 'onLetterToTheRepresentativeDownloadClick',
                margin: '0 5 0 5',
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
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            flex: 0,
            align: 'center',
            items: [{
                xtype: 'button',
                flex: 0,
                iconCls: 'x-fa fa-eye',
                tooltip: i18n.DOCUMENT,
                handler: 'onViewDecreeDocumentCLick',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('properties')['document'];
                }
            }, '',{
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
            text: i18n.status,
            flex: 1,
            dataIndex: 'fina_status',
            renderer: function (content, cell, record) {
                let value = record.get('properties')['fina:status'];
                return i18n[value] ? i18n[value] : value;
            }
        }, {
            text: i18n.address,
            flex: 1,
            dataIndex: 'fina_fiRegistryBranchAddress',
        }, {
            text: i18n.decreeDate,
            flex: 1,
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
            text: i18n.decreeNumber,
            flex: 1,
            dataIndex: 'fina_fiDocumentNumber',
            editor: {
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
                iconCls: 'x-fa fa-cog',
                cls: 'finaSecondaryBtn',
                tooltip: i18n.generate,
                handler: 'onGenerateClick',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    let viewModel = view.grid.up().getController().getViewModel();
                    return !viewModel.get('isRegistryActionEditor');
                },
                getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                    let viewModel = view.grid.up().getController().getViewModel();
                    return !viewModel.get('isRegistryActionEditor') ?
                        'x-hide-display' :
                        "x-fa fa-cog icon-margin";
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

    buttons: [{
        reference: 'finishRegistration',
        iconCls: 'x-fa fa-check',
        cls: 'finaPrimaryBtn',
        text: i18n.finishCancellation,
        handler: 'onFinishRegistrationClick',
        disabled: true,
        bind: {
            disabled: '{theFi.fina_fiRegistryStatus != "IN_PROGRESS" || !isRegistryActionEditor}'
        }
    }]

});
