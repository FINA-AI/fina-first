Ext.define('first.view.registration.task.branchChange.BranchChangeGapFinalCardView', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.form.FieldSet',
        'Ext.form.field.Date',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.Date',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Grouping',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.selection.CellModel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.registration.FiGapStore',
        'first.view.registration.task.branchChange.BranchChangeGapFinalCardController',
        'first.view.registration.task.shared.CardHeaderView'
    ],

    xtype: 'branchChangeFinalGapView',

    controller: 'branchChangeFinalGapController',


    layout: {
        type: 'vbox',
        align: 'stretch'
    },


    items: [
        {
            xtype: 'cardHeader',
            bind: {
                hidden: '{fiAction.fina_fiRegistryActionType === "REGISTRATION"}'
            }
        },
        {
            xtype: 'grid',
            flex: 1,
            reference: 'gapFinalGridView',
            columnLines: true,

            store: {
                type: 'fiGapStore',
                groupField: 'branchGroupingTitle',
            },

            features: [{
                ftype: 'grouping',
                startCollapsed: false,
                groupHeaderTpl: '{name}'
            }],

            columns: [{
                xtype: 'rownumberer'
            }, {
                flex: 2,
                hidden: true,
                text: i18n.gapObjectColumnTitle,
                dataIndex: 'branchGroupingTitle',
            }, {
                text: i18n.gapReasonColumnTitle,
                flex: 2,
                dataIndex: 'fina_fiGapReason',
                renderer: function (content, cell, record) {
                    let value = record.get('properties')['fina:fiGapReason'];
                    let translatedValue;

                    if(!record.get('fina_fiGapIsBasedOnQuestionnaire')){
                         translatedValue = i18n.generalGap;
                    } else if (value) {
                       translatedValue = i18n[value] ? i18n[value] : value;
                    }

                    if (translatedValue) {
                        let status = record.data.properties['fina:fiGapCorrectionStatus'];

                        switch (status) {
                            case 'CORRECTED':
                                return '<div style="color: green">' + translatedValue + '</div>';
                            case 'NOT_CORRECTED':
                                return '<div style="color: red">' + translatedValue + '</div>';
                            default:
                                break;
                        }

                        return translatedValue;
                    }
                    return "";
                }
            }, {
                text: i18n.gapCorrectionCommentTitle,
                flex: 1,
                dataIndex: 'fina_fiGapCorrectionComment',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                text: i18n.gapLetterColumnTitle,
                flex: 1,
                columns: [{
                    text: i18n.gapLetterNumber,
                    flex: 1,
                    renderer: function (content, cell, record) {
                        return record.get('document').properties['fina:fiDocumentNumber'];
                    }
                }, {
                    xtype: 'actioncolumn',
                    width: 30,
                    align: 'center',
                    menuDisabled: true,
                    sortable: false,
                    hideable: false,
                    resizable: false,
                    items: [{
                        iconCls: 'x-fa fa-cloud-download-alt',
                        handler: 'onDownloadDocumentClick'
                    }]
                }]
            }, {
                xtype: 'actioncolumn',
                width: 80,
                menuDisabled: true,
                sortable: false,
                resizable: false,
                items: [{
                    iconCls: 'x-fa fa-check green icon-margin',
                    handler: 'onCorrected',
                    isActionDisabled: 'isDisabled'
                }, {
                    iconCls: 'x-fa fa-ban red icon-margin',
                    handler: 'onNotCorrected',
                    isActionDisabled: 'isDisabled'
                }, {
                    iconCls: 'x-fa fa-eraser',
                    handler: 'onErase',
                    isActionDisabled: 'isDisabled'
                }]
            }, {
                xtype: 'datecolumn',
                text: i18n.gapCorrectionDateColumnTitle,
                flex: 1,
                dataIndex: 'fina_fiGapCorrectionDate',
                format: first.config.Config.dateFormat,
                editor: {
                    xtype: 'datefield',
                    format: first.config.Config.dateFormat,
                    allowBlank: false
                }
            }, {
                text: i18n.gapCorrectionLetterNumberColumnTitle,
                flex: 1,
                dataIndex: 'fina_fiGapCorrectionLetterNumber',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }],

            selModel: {
                type: 'cellmodel'
            },

            plugins: [{
                ptype: 'cellediting',
                clicksToEdit: 1,
                listeners: {
                    beforeedit: 'beforeCellEdit',
                    edit: 'cellEdit'
                }
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
        },
        {
            xtype: 'fieldset',
            flex: 0,
            margin: '5',
            items: [{
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    align: 'stretch',
                },
                defaults: {
                    labelWidth: '100%',
                    readOnly: true,
                    flex: 1
                },
                padding: 'auto',
                items: [{
                    xtype: 'datefield',
                    format: first.config.Config.dateFormat,
                    margin: '5 0 5 0',
                    fieldLabel: i18n.correctionDeadline,
                    bind: {
                        value: '{branchesCorrection.deadline}'
                    }
                }, {
                    xtype: 'numberfield',
                    fieldLabel: i18n.correctionDeadlineDays,
                    minValue: 0,
                    bind: {
                        value: '{branchesCorrection.deadlineDays}',
                    }
                }]
            }]
        }
    ],

    bbar: {
        style: 'background-color:#f2efef',
        items: ['->',
            {
                itemId: 'card-continue-registration',
                cls: 'finaPrimaryBtn',
                handler: 'onResumeRegistration',
                disabled: true,
                text: i18n.changeResume,
                bind: {
                    disabled: '{inReview}',
                    hidden: '{!isRegistryActionEditor}'
                }
            }]
    }
});
