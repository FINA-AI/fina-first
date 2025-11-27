Ext.define('first.view.registration.task.branchChange.BranchChangeGeneralCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'branchChangeGeneralCard',

    requires: [
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.column.Widget',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.selection.CellModel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.change.BranchesGeneralChangeStore',
        'first.view.registration.task.branchChange.BranchChangeGeneralCardController',
        'first.view.registration.task.shared.CardHeaderView',
        'first.view.registration.task.shared.GapsForRedactorGridView'
    ],

    controller: 'branchChangeGeneralCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'cardHeader'
    }, {
        xtype: 'form',
        flex: 1,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            flex: 1,
            margin: 0
        },
        items: [{
            xtype: 'label',
            flex: 0,
            bind: {
                html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToController + "</br></br></br><b><i>" + ' " {controllerName} "' + '</b></i></p>',
                hidden: '{!inReview}'
            }
        }, {
            xtype: 'grid',

            viewModel: {},
            selModel: {
                type: 'cellmodel'
            },

            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
                listeners: {
                    edit: 'onCellEditClick'
                }
            },

            viewConfig: {
                stripeRows: true,
                enableTextSelection: false
            },
            trackMouseOver: false,
            disableSelection: true,

            bind: {
                selection: '{selectedRecord}'
            },

            flex: 1,
            title: i18n.changesGridTitle,
            columnLines: true,
            reference: 'branchChangesGridView',
            store: {
                type: 'branchesGeneralChanges'
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
                align: 'center',
                width: 40,
                items: [{
                    iconCls: 'x-fa fa-eye',
                    tooltip: i18n.view,
                    handler: 'onViewClick'
                }]
            }, {
                text: i18n.SUBDIVISION,
                flex: 2,
                dataIndex: 'fina_branch',
                renderer: 'branchNameRenderer'
            }, {
                text: i18n.branchActionType,
                flex: 1,
                dataIndex: 'fina_fiBranchesChangeStatus',
                renderer: function (content, cell, record) {
                    return i18n[content];
                }
            }, {
                text: i18n.branchActionStatus,
                flex: 1,
                xtype: 'widgetcolumn',
                widget: {
                    xtype: 'combo',
                    bind: {
                        value: '{record.fina_fiBranchesChangeFinalStatus}',
                        disabled: '{isController || !sendToControllerEnable || inReview}'
                    },
                    valueField: 'fina_fiBranchesChangeFinalStatus',
                    displayField: 'value',

                    store: {
                        data: [
                            {value: i18n["ACCEPTED"], fina_fiBranchesChangeFinalStatus: 'ACCEPTED'},
                            {value: i18n["GAP"], fina_fiBranchesChangeFinalStatus: "GAP"},
                            {value: i18n["DECLINED"], fina_fiBranchesChangeFinalStatus: "DECLINED"}
                        ]
                    },

                    listeners: {
                        change: "finalStatusChange"
                    }
                }
            }, {
                xtype: 'actioncolumn',
                bind: {
                    text: '{fiAction.fina_fiSendToControllerEnable?"' + i18n.reportCardGapletter + '":"' + i18n.GAP_LETTER + '"}',
                },
                flex: 2,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                align: 'center',
                items: [{
                    iconCls: 'x-fa fa-cog',
                    tooltip: i18n.generate,
                    handler: 'onGenerateClick',
                    isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                        let vm = view.grid.getViewModel(),
                            fiAction = vm.get('fiAction');

                        if (!fiAction['fina_fiSendToControllerEnable'] && record.get('fina_fiBranchesChangeFinalStatus') === "ACCEPTED") {
                            return true;
                        }

                        return !record.get('fina_fiBranchesChangeFinalStatus') || record.get('disable') || vm.get('inReview') || !vm.get('isRegistryActionEditor');
                    },
                    getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                        return record.dirty ? 'x-fa fa-cog redColor' : 'x-fa fa-cog';
                    }
                }, '', {
                    iconCls: 'x-fa fa-cloud-download-alt',
                    tooltip: i18n.download,
                    handler: 'onDownloadDocumentClick',
                    isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                        let properties = record.get('properties');
                        return !(properties && properties['fina:fiDocument'] && properties['fina:fiDocument'].id);
                    }
                }, '', {
                    iconCls: 'x-fa fa-cloud-upload-alt',
                    tooltip: i18n.upload,
                    handler: 'onDocumentUploadClick',
                    isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                        let properties = record.get('properties'),
                            vm = view.grid.getViewModel();
                        return !(properties && properties['fina:fiDocument'] && properties['fina:fiDocument'].id) || vm.get('inReview') || !vm.get('isRegistryActionEditor');
                    }
                }]
            }, {
                text: i18n.generateStatus,
                flex: 1,
                dataIndex: 'fina_branchDocumentGenerateStatus',
                align: 'center',
                renderer: function (content, cell, record, rowIndex, colIndex, store, view) {
                    if (record.get('disable')) {
                        return '';
                    }

                    let document = record.get('properties')['fina:fiDocument'],
                        fiAction = view.grid.getViewModel().get('fiAction'),
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
                },
            }, {
                text: i18n.generateTime,
                flex: 1,
                dataIndex: 'fina_branchDocumentGenerateDate',
                renderer: function (content, cell, record) {
                    let document = record.get('properties')['fina:fiDocument'];
                    return !document ? '' : Ext.Date.format(new Date(Number(document['modifiedAt'])), first.config.Config.timeFormat);
                }
            }, {
                text: i18n.comment,
                flex: 1,
                dataIndex: 'fina_fiBranchesChangeFinalStatusNote',
                editor: {
                    bind: {
                        disabled: '{inReview}'
                    },
                    minChars: 1
                }
            }],


            bbar: {
                xtype: 'pagingtoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                }
            }
        },
            {
                xtype: 'panel',
                flex: 1,
                layout: 'fit',
                items: [{
                    xtype: 'gapsForRedactorGrid',
                }],
                bind: {
                    hidden: '{!isDeclined||isGridHidden}'
                }
            }]
    }],

    bbar: {
        items: ['->',
            {
                text: i18n.sendToController,
                disabled: true,
                cls: 'finaPrimaryBtn',
                bind: {
                    text: '{sendToControllerEnable?"' + i18n.sendToController + '":"' + i18n.finishChange + '"}',
                    handler: '{sendToControllerEnable?"onSendToInspectorClick":"onFinishChangeBranchClick"}',
                    disabled: '{!isGeneratedBranchDocuments || !isRegistryActionEditor}',
                    hidden: '{isController || inReview}'
                },
                disabledTooltip: i18n.sendToControllerDisabledTooltip,
            }
        ]
    }
});