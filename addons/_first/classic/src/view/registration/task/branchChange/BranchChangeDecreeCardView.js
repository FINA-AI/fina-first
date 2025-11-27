Ext.define('first.view.registration.task.branchChange.BranchChangeDecreeCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'branchChangeDecreeCard',

    requires: [
        'Ext.button.Button',
        'Ext.form.Label',
        'Ext.form.field.Date',
        'Ext.form.field.Number',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.Date',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.selection.CellModel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.change.BranchesGeneralChangeStore',
        'first.view.registration.task.branchChange.BranchChangeDecreeCardController',
        'first.view.registration.task.shared.CardHeaderView'
    ],

    controller: 'branchChangeDecreeCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'cardHeader'
    }, {
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        flex: 1,
        items: [{
            xtype: 'label',
            hidden: true,
            bind: {
                html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToRedactor + "</br></br></br><b><i>" + ' " {redactorName} "' + '</b></i></p>',
                hidden: '{!taskRedactor}'
            }
        }, {
            xtype: 'grid',

            columnLines: true,
            flex: 1,
            title: i18n.branchesChangeHeaderTitle,
            reference: 'branchChangesGridViewFinal',

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

            store: {
                type: 'branchesGeneralChanges'
            },

            tools: [
                {
                    xtype: 'panel',
                    flex: 0,
                    bodyStyle: 'background-color: transparent;',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-cloud-download-alt',
                            cls: 'finaSecondaryBtn toolsBtn',
                            text: i18n.representativeLetterDownload,
                            handler: 'onLetterToTheRepresentativeDownloadClick',
                            disabled: true,
                            bind: {
                                disabled: '{!existingLetterToTheRepresentative.id}'
                            }
                        }],
                    bind: {
                        disabled: '{!isRegistryActionEditor}'
                    },
                    disabledTooltip: i18n.pleaseGeneratePrescriptionDisabledTooltip,
                }
            ],

            columns: [{
                flex: 0,
                xtype: 'rownumberer'
            }, {
                xtype: 'actioncolumn',
                width: 40,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                align: 'center',
                items: [{
                    iconCls: 'x-fa fa-eye',
                    tooltip: i18n.view,
                    handler: 'onViewClick'
                }]
            }, {
                text: i18n.branchChangeDecreeGridColumnBranch,
                flex: 1,
                dataIndex: 'fina_branch',
                renderer: 'branchNameRenderer'
            }, {
                text: i18n.status,
                flex: 0,
                dataIndex: 'fina_fiBranchesChangeStatus',
                renderer: function (content, cell, record) {
                    return i18n[content];
                }
            }, {
                text: i18n.finalStatus,
                flex: 0,
                dataIndex: 'fina_fiBranchesChangeFinalStatus',
                renderer: function (content) {
                    return content ? i18n[content] : '';
                }
            }, {
                xtype: 'actioncolumn',
                text: i18n.branchChangeDecreeGridColumnReportCardGapLetter,
                flex: 1,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                align: 'center',
                items: [{
                    iconCls: 'x-fa fa-cloud-download-alt',
                    tooltip: i18n.download,
                    handler: 'onDownloadDocumentClick',
                    isActionDisabled: 'isDecreeGridReportCardDisabled'
                }]
            }, {
                text: i18n.branchChangeDecreeGridColumnDocumentCard,
                flex: 3,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                bind: {
                    hidden: '{!isGapSelected && !(fiAction.fina_fiSendToControllerEnable)}'
                },
                columns: [{
                    xtype: 'actioncolumn',
                    text: i18n.branchChangeDecreeGridColumnGenerateDownload,
                    flex: 1,
                    menuDisabled: true,
                    sortable: false,
                    hideable: false,
                    align: 'center',
                    items: [{
                        iconCls: 'x-fa fa-cog',
                        tooltip: i18n.generate,
                        handler: 'onGenerateDocumentClick',
                        isActionDisabled: 'isGenerateDecreeCardDisabled'
                    }, '', {
                        iconCls: 'x-fa fa-cloud-download-alt',
                        tooltip: i18n.download,
                        handler: 'onDownloadDecreeCardClick',
                        isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                            let properties = record.get('properties');
                            if (record.get('fina_fiBranchesChangeFinalStatus') === 'GAP') {
                                return !(properties && properties['fina:fiDocument'] && properties['fina:fiDocument'].id);
                            }
                            return !(properties && properties['fina:fiBranchDecreeDocument'] && properties['fina:fiBranchDecreeDocument'].id);
                        }
                    }, '', {
                        iconCls: 'x-fa fa-cloud-upload-alt',
                        tooltip: i18n.upload,
                        handler: 'onUploadDecreeCardClick',
                        isActionDisabled: 'isUploadDecreeCardDisabled'
                    }]
                }, {
                    text: i18n.branchChangeDecreeGridColumnGenerationStatus,
                    flex: 0,
                    dataIndex: 'fina_branchDocumentGenerateStatus',
                    align: 'center',
                    renderer: function (content, cell, record, rowIndex, colIndex, store, view) {
                        let document;
                        if (record.get('fina_fiBranchesChangeFinalStatus') === 'GAP') {
                            document = record.get('properties')['fina:fiDocument'];
                        } else {
                            document = record.get('properties')['fina:fiBranchDecreeDocument'];
                        }

                        let fiAction = view.grid.up().up().up().getViewModel().get('fiAction'),
                            sendToController = fiAction['fina_fiSendToControllerEnable'],
                            statusText = '';

                        if (!document) {
                            if (sendToController) {
                                statusText = '<b style="color: red">' + i18n.decreeIsNotGenerated + '</b>';
                            }
                        } else {
                            statusText = '<b style="color: green">' + i18n.decreeIsGenerated + '</b>';
                        }

                        return statusText;
                    }
                }, {
                    text: i18n.branchChangeDecreeGridColumnGenerationDate,
                    flex: 1,
                    dataIndex: 'fina_branchDocumentGenerateDate',
                    renderer: function (content, cell, record) {
                        let status = record.get('properties')['fina:fiBranchesChangeFinalStatus'];
                        let document = status === 'GAP' ? record.get('properties')['fina:fiDocument'] : record.get('properties')['fina:fiBranchDecreeDocument'];
                        return !document ? '' : Ext.Date.format(new Date(Number(document['modifiedAt'])), first.config.Config.timeFormat);
                    }
                }, {
                    flex: 0,
                    text: i18n.branchChangeDecreeGridColumnDocumentDate,
                    dataIndex: 'fina_fiDocumentDate',
                    xtype: 'datecolumn',
                    format: first.config.Config.dateFormat,
                    editor: {
                        disabled: true,
                        xtype: 'datefield',
                        format: first.config.Config.dateFormat,
                        bind: {
                            disabled: '{!isRegistryActionEditor}'
                        }
                    }
                }, {
                    flex: 1,
                    text: i18n.branchChangeDecreeGridColumnDocumentNumber,
                    dataIndex: 'fina_fiDocumentNumber',
                    editor: {
                        disabled: true,
                        minChars: 1,
                        bind: {
                            disabled: '{!isRegistryActionEditor}'
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
            }
        }, {
            xtype: 'panel',
            flex: 0,
            hidden: true,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            defaults: {
                labelWidth: '100%',
            },
            bodyPadding: 5,
            items: [
                {
                    xtype: 'datefield',
                    format: first.config.Config.dateFormat,
                    fieldLabel: i18n.correctionDeadline,
                    flex: 1,
                    minValue: new Date(),
                    bind: {
                        value: '{branchesCorrection.deadline}',
                        disabled: '{workflowVariables.bpm_outcome =="Reject"}'
                    },
                    listeners: {
                        select: 'onGapCorrectionDeadlineSelect'
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: i18n.correctionDeadlineDays,
                    flex: 1,
                    minValue: 0,
                    bind: {
                        value: '{branchesCorrection.deadlineDays}',
                        disabled: '{workflowVariables.bpm_outcome =="Reject"}'
                    }
                }
            ],
            bind: {
                hidden: '{!isAccepted||isController||!isGapSelected}'
            }
        }]
    }],

    bbar: ['->', {
        reference: 'finishChangeBranch',
        iconCls: 'x-fa fa-check',
        cls: 'finaPrimaryBtn',
        text: i18n.finishChange,
        handler: 'onFinishChangeBranchClick',
        disabled: true,
        bind: {
            disabled: '{!isAllDecreeGenerated || theFi.fina_fiRegistryStatus != "IN_PROGRESS" || !isRegistryActionEditor ' +
                '|| (isGapSelected && (!branchesCorrection.deadline || !branchesCorrection.deadlineDays))}'
        }
    }]
});

