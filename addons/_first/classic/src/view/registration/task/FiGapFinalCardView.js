Ext.define('first.view.registration.task.FiGapFinalCardView', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.button.Button',
        'Ext.form.FieldSet',
        'Ext.form.Label',
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
        'first.view.registration.task.FiGapFinalCardController',
        'first.view.registration.task.shared.CardHeaderView'
    ],

    xtype: 'fiFinalGapView',

    controller: 'finalGapController',


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
                type: 'fiGapStore'
            },

            features: [{
                ftype: 'grouping',
                enableGroupingMenu: false,
                enableNoGroups: false
            }],

            columns: [{
                xtype: 'rownumberer'
            }, {
                text: i18n.gapReasonColumnTitle,
                flex: 2,
                dataIndex: 'fina_fiGapReason',
                renderer: function (content, cell, record) {
                    let value = record.get('properties')['fina:fiGapReason'],
                        status = record.data.properties['fina:fiGapCorrectionStatus'],
                        translatedValue = i18n[value] ? i18n[value] : value;

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
            }, {
                text: i18n.gapCorrectionCommentTitle,
                flex: 1,
                dataIndex: 'fina_fiGapCorrectionComment',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
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
            items: [
                {
                    xtype: 'panel',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    defaults: {
                        labelWidth: '100%',
                    },
                    padding: 'auto',
                    items: [
                        {
                            xtype: 'panel',
                            margin: '5 0 5 0',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                            },
                            defaults: {
                                labelWidth: '100%'
                            },
                            padding: 'auto',
                            items: [
                                {
                                    xtype: 'label',
                                    bind: {
                                        text: '{gapLetter.modificationTime} / {gapLetter.status}'
                                    },
                                    flex: 1
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.downloadGapLetter,
                                    iconCls: 'x-fa fa-cloud-download-alt',
                                    cls: 'finaSecondaryBtn',
                                    tooltip: i18n.downloadGapLetter,
                                    flex: 0,
                                    handler: 'onDownloadGapLetterClick',
                                    bind: {
                                        text: '{!isRefusalSelected ? "' + i18n.downloadGapLetter + '" : "' + i18n.downloadRefusalReportCard + '"}',
                                        tooltip: '{!isRefusalSelected ? "' + i18n.downloadGapLetter + '" : "' + i18n.downloadRefusalReportCard + '"}'
                                    }
                                }
                            ],
                            bind: {
                                hidden: '{!isAccepted||isController}'
                            }
                        },
                        {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            margin: '5 0 5 0',
                            fieldLabel: i18n.gapLetterDate,
                            flex: 1,
                            readOnly: true,
                            bind: {
                                value: '{gapInfo.letterDate}',
                            }
                        },
                        {
                            xtype: 'textfield',
                            margin: '5 0 0 0',
                            fieldLabel: i18n.gapLetterNumber,
                            flex: 1,
                            readOnly: true,
                            bind: {
                                value: '{gapInfo.letterNumber}'
                            }
                        },
                        {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            margin: '5 0 5 0',
                            fieldLabel: i18n.correctionDeadline,
                            flex: 1,
                            readOnly: true,
                            bind: {
                                value: '{gapInfo.correctionDeadline}',
                            }
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: i18n.correctionDeadlineDays,
                            flex: 1,
                            minValue: 0,
                            readOnly: true,
                            bind: {
                                value: '{gapInfo.correctionDeadlineDays}',
                            }
                        }
                    ],
                }
            ]
        },
    ],

    bbar: {
        style: 'background-color:#f2efef',
        items: ['->',
            {
                itemId: 'card-reguse-registration',
                cls: 'finaSecondaryBtn',
                handler: 'onRefuseRegistration',
                bind: {
                    hidden: '{!isRegistryActionEditor}',
                    text: '{fiAction.fina_fiRegistryActionType === "REGISTRATION" ? "' + i18n.registrationRefuseButtonText
                        + '" : (fiAction.fina_fiRegistryActionType === "CANCELLATION" ? "' + i18n.cancellationRefuseButtonText + '" : "' + i18n.changeRefuseButtonText + '")}'
                }
            },
            {
                itemId: 'card-continue-registration',
                cls: 'finaPrimaryBtn',
                handler: 'onResumeRegistration',
                disabled: true,
                bind: {
                    disabled: '{inReview || !finalGap.isEveryGapCorrected}',
                    hidden: '{!isRegistryActionEditor}',
                    text: '{fiAction.fina_fiRegistryActionType === "REGISTRATION" ? "' + i18n.registrationResume
                        + '" : (fiAction.fina_fiRegistryActionType === "CANCELLATION" ? "' + i18n.cancellationResume + '" : "' + i18n.changeResume + '")}'
                }
            }]
    }
});
