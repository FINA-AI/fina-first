Ext.define('first.view.registration.task.change.ChangeGapCardView', {
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
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.registration.FiGapStore',
        'first.view.registration.task.change.ChangeGapCardController',
        'first.view.registration.task.shared.CardHeaderView',
        'first.view.registration.task.shared.GapsForRedactorGridView'
    ],

    xtype: 'changeGapCard',

    controller: 'changeGapCard',


    layout: {
        type: 'vbox',
        align: 'stretch'
    },


    items: [
        {
            xtype: 'cardHeader'
        },
        {
            xtype: 'label',
            bind: {
                html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToRedactor + "</br></br></br><b><i>" + ' " {redactorName} "' + '</b></i></p>',
                hidden: '{!isController||inReview}'
            }
        },
        {
            xtype: 'label',
            bind: {
                html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToController + "</br></br></br><b><i>" + ' " {controllerName} "' + '</b></i></p>',
                hidden: '{isController||!inReview}'
            }
        },
        {
            xtype: 'grid',
            flex: 1,
            reference: 'gapGridView',
            columnLines: true,
            tbar: {
                items: [{
                    iconCls: 'x-fa fa-plus',
                    cls: 'finaSecondaryBtn',
                    tooltip: i18n.addGapButtonText,
                    text: i18n.addGapButtonText,
                    handler: 'onAddClick',
                }, {
                    iconCls: 'x-fa fa-share',
                    cls: 'finaSecondaryBtn',
                    tooltip: i18n.addFromQuestionnaireButtonText,
                    text: i18n.addFromQuestionnaireButtonText,
                    handler: 'onSyncFromQuestionnaires',
                    bind: {
                        hidden: '{theFi.fina_fiActionType==="CANCELLATION"}'
                    }
                }],
                bind: {
                    disabled: '{!editMode}',
                    hidden: '{editModeController||isAccepted}'
                }
            },

            store: {
                type: 'fiGapStore'
            },

            features: [{
                ftype: 'grouping',
                enableGroupingMenu: false,
                enableNoGroups: false
            }],

            columns: [{
                flex: 0,
                xtype: 'rownumberer'
            }, {
                xtype: 'actioncolumn',
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                width: 50,
                align: 'center',
                items: [{
                    iconCls: 'x-fa fa-edit',
                    tooltip: "Edit",
                    handler: 'onEditClick',
                    isActionDisabled: 'isDisabled'
                }]
            }, {
                text: i18n.gapReasonColumnTitle,
                flex: 2,
                dataIndex: 'fina_fiGapReason',
                renderer: function (content, cell, record) {
                    let value = record.get('properties')['fina:fiGapReason'],
                        status = record.data.properties['fina:fiGapCorrectionStatus'];
                    let translatedValue = i18n[value] ? i18n[value] : value;
                    if (status === 'CORRECTED') {
                        return '<div style="color: green">' + translatedValue + '</div>';
                    }
                    return '<div style="color: red">' + translatedValue + '</div>';
                }
            }, {
                text: i18n.gapCorrectionCommentTitle,
                flex: 1,
                dataIndex: 'fina_fiGapCorrectionComment'
            }, {
                xtype: 'datecolumn',
                text: i18n.gapCorrectionDateColumnTitle,
                flex: 1,
                dataIndex: 'fina_fiGapCorrectionDate',
                format: first.config.Config.dateFormat
            }, {
                text: i18n.gapCorrectionLetterNumberColumnTitle,
                flex: 1,
                dataIndex: 'fina_fiGapCorrectionLetterNumber'
            }, {
                xtype: 'actioncolumn',
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                width: 50,
                align: 'center',
                items: [{
                    iconCls: 'cell-editing-delete-row',
                    tooltip: i18n.delete,
                    handler: 'onRemoveClick',
                    isActionDisabled: 'isDisabledRemoveBtn'
                }],
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
            xtype: 'panel',
            flex: 1,
            layout: 'fit',
            items: [{
                xtype: 'gapsForRedactorGrid',
            }],
            bind: {
                hidden: '{!isDeclined||isGridHidden||!redactingStatusIsDeclined}'
            }
        },
        {
            xtype: 'fieldset',
            flex: 0,
            margin: '5',
            items: [
                {
                    xtype: 'panel',
                    margin: '5 0 5 0',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    defaults: {
                        labelWidth: '100%',
                    },
                    padding: 'auto',
                    items: [
                        {
                            xtype: 'label',
                            flex: 1,
                            bind: {
                                text: '{gapLetter.modificationTime} / {gapLetter.status}'
                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.generateGapletterButtonText,
                            iconCls: 'x-fa fa-cog',
                            cls: 'finaSecondaryBtn',
                            tooltip: i18n.generateGapletterButtonText,
                            flex: 0,
                            bind: {
                                text: '{!isRefusalSelected ? "' + i18n.generateGapletterButtonText + '" : fiAction.fina_fiChangeFormType==="managementPersonal" ? "' + i18n.generateRefusalLetterButtonText + '" : "' + i18n.refusalDecreeGenerationTitle + '"}',
                                disabled: '{noGapPresented || inReview || !isRegistryActionEditor}',
                                iconCls: '{!gapLetter.isLatestVersion?"x-fa fa-exclamation-triangle orange":"x-fa fa-cog"}',
                                tooltip: '{!gapLetter.isLatestVersion?"' + i18n.reGenerateLetterButtonText + '":"' + i18n.generateDocument + '"}'
                            },
                            handler: 'onGenerateGapLetterClick'
                        },
                        {
                            xtype: 'button',
                            text: i18n.downloadGapLetter,
                            iconCls: 'x-fa fa-cloud-download-alt',
                            cls: 'finaSecondaryBtn',
                            tooltip: i18n.downloadGapLetter,
                            flex: 0,
                            disabled: true,
                            bind: {
                                disabled: '{!gapLetter || !isChangeGapLetterGenerated}',
                                text: '{!isRefusalSelected ? "' + i18n.downloadGapLetter + '" : "' + i18n.downloadRefusalLetter + '"}',
                                tooltip: '{!isRefusalSelected ? "' + i18n.downloadGapLetter + '" : "' + i18n.downloadRefusalLetter + '"}'
                            },
                            handler: 'onDownloadGapLetterClick'
                        },
                        {
                            xtype: 'button',
                            text: i18n.uploadGapLetter,
                            flex: 0,
                            iconCls: 'x-fa fa-cloud-upload-alt',
                            cls: 'finaSecondaryBtn',
                            disabled: true,
                            bind: {
                                disabled: '{!gapLetter || inReview}',
                                text: '{!isRefusalSelected ? "' + i18n.uploadGapLetter + '" : "' + i18n.uploadRefusalLetter + '"}',
                                tooltip: '{!isRefusalSelected ? "' + i18n.uploadGapLetter + '" : "' + i18n.uploadRefusalLetter + '"}'
                            },
                            handler: 'onUploadGapLetterClick'
                        }
                    ],
                }
            ],
            bind: {
                hidden: '{editModeController||isController||isAccepted}'
            }
        },
        {
            xtype: 'fieldset',
            flex: 0,
            margin: '5',
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
                            iconCls: 'x-fa fa-cloud-download-alt',
                            cls: 'finaSecondaryBtn',
                            tooltip: i18n.downloadGapLetter,
                            flex: 0,
                            handler: 'onDownloadGapLetterClick',
                            bind: {
                                text: '{!isRefusalSelected ? "' + i18n.downloadGapLetter + '" : "' + i18n.downloadRefusalLetter + '"}',
                                tooltip: '{!isRefusalSelected ? "' + i18n.downloadGapLetter + '" : "' + i18n.downloadRefusalLetter + '"}'
                            },
                        }
                    ],
                },
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
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            fieldLabel: i18n.gapLetterDate,
                            flex: 1,
                            bind: {
                                value: '{gapLetter.letterDate}',
                                disabled: '{workflowVariables.bpm_outcome =="Reject"}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.gapLetterNumber,
                            flex: 1,
                            bind: {
                                value: '{gapLetter.letterNumber}',
                                disabled: '{workflowVariables.bpm_outcome =="Reject"}'
                            }
                        },
                        {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            fieldLabel: i18n.correctionDeadline,
                            flex: 1,
                            minValue: new Date(),
                            bind: {
                                value: '{fiAction.fina_fiRegistryActionGapCorrectionDeadline}',
                                disabled: '{workflowVariables.bpm_outcome =="Reject"}'
                            },
                            listeners: {
                                'select': 'onGapCorrectionDeadlineDateSelect'
                            }
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: i18n.correctionDeadlineDays,
                            flex: 1,
                            minValue: 0,
                            bind: {
                                value: '{fiAction.fina_fiRegistryActionNumDaysToCorrectGaps}',
                                disabled: '{workflowVariables.bpm_outcome =="Reject"}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{isRefusalSelected || !isAccepted || isController}'
                    }
                },
                {
                    xtype: 'panel',
                    margin: '5 0 5 0',

                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults: {
                        labelWidth: '100%',
                    },
                    padding: 'auto',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.documentNumber,
                            bind: {
                                fieldLabel: '{fiAction.fina_fiChangeFormType==="managementPersonal" ? "' + i18n.documentNumber + '" : "' + i18n.refusalDecreeNumber + '"}',
                                value: '{refusalDecree.documentNumber}',
                                disabled: '{!isRegistryActionEditor || !refusalDecree}'
                            },
                            listeners: {
                                blur: 'updateRefusalDecreeDetails'
                            }
                        },
                        {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            fieldLabel: i18n.documentDate,
                            bind: {
                                fieldLabel: '{fiAction.fina_fiChangeFormType==="managementPersonal" ? "' + i18n.documentDate + '" : "' + i18n.refusalDecreeDate + '"}',
                                value: '{refusalDecree.documentDate}',
                                disabled: '{!isRegistryActionEditor || !refusalDecree}'
                            },
                            listeners: {
                                blur: 'updateRefusalDecreeDetails'
                            }
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 0',
                                    iconCls: 'x-fa fa-cog',
                                    cls: 'finaSecondaryBtn',
                                    handler: 'onGenerateRefusalDecreeButtonClick',
                                    bind: {
                                        text: '{fiAction.fina_fiChangeFormType==="managementPersonal" ? "' + i18n.generateRefusalLetterButtonText + '" : "' + i18n.refusalDecreeGenerationTitle + '"}',
                                        disabled: '{!isRegistryActionEditor || inReview || !isAccepted}'
                                    },
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 5 0 5',
                                    iconCls: 'x-fa fa-cloud-download-alt',
                                    cls: 'finaSecondaryBtn',
                                    text: i18n.download,
                                    handler: 'onRefusalDecreeCardDownloadClick',
                                    disabled: true,
                                    bind: {
                                        disabled: '{!refusalDecree}'
                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'x-fa fa-cloud-upload-alt',
                                    cls: 'finaSecondaryBtn',
                                    text: i18n.upload,
                                    handler: 'onRefusalDecreeCardUploadClick',
                                    disabled: true,
                                    bind: {
                                        disabled: '{!isRegistryActionEditor || !refusalDecree}'
                                    }
                                }
                            ]
                        }
                    ],

                    bind: {
                        hidden: '{!(isAccepted&&isRefusalSelected)}'
                    }
                },
            ],
            bind: {
                hidden: '{!editModeController&&!(isAccepted&&!isController)}'
            }
        },
        {
            xtype: 'panel',
            padding: 5,
            items: [{
                xtype: 'textfield',
                name: 'comment',
                fieldLabel: i18n.comment,
                width: '100%',
                bind: {
                    value: '{fiAction.fina_fiRegistryActionControllerComment}',
                }
            }],
            bind: {
                hidden: '{!(isController&&inReview)}'
            }
        }
    ],

    bbar: {
        items: ['->',
            {
                itemId: 'card-next',
                cls: 'finaSecondaryBtn',
                text: i18n.goBack,
                handler: 'showNext',
                bind: {
                    disabled: '{inReview}',
                    hidden: '{isAccepted||isController}'
                }
            },
            {
                itemId: 'card-send-gaps',
                cls: 'finaPrimaryBtn',
                text: i18n.sendGapToController,
                handler: 'onSendGapToControllerClick',
                disabled: true,
                bind: {
                    disabled: '{!gapLetter || !isGapsCreated || !isChangeGapLetterGenerated}',
                    hidden: '{!editMode||editModeController||isController||isAccepted}'
                },
                disabledTooltip: i18n.sendGapToControllerDisabledTooltip,
            },
            {
                xtype: 'button',
                cls: 'finaSecondaryBtn',
                text: i18n.sendErrors,
                handler: 'onGap',
                bind: {
                    hidden: '{!editModeController&&!isController}',
                    disabled: '{!inReview}'
                }
            },
            {
                xtype: 'button',
                cls: 'finaPrimaryBtn',
                text: i18n.accept,
                handler: 'onApprove',
                bind: {
                    hidden: '{!editModeController&&!isController}',
                    disabled: '{!inReview}'
                }
            },
            {
                xtype: 'button',
                cls: 'finaPrimaryBtn',
                text: i18n.makeGap,
                handler: 'onMoveProcessToGappedState',
                disabled: true,
                disabledTooltip: i18n.pleaseGeneratePrescriptionDisabledTooltip,
                bind: {
                    hidden: '{isRefusalSelected || !(isAccepted&&!isController)||!isRegistryActionEditor}',
                    disabled: '{(!(gapLetter.letterNumber && fiAction.fina_fiRegistryActionGapCorrectionDeadline && fiAction.fina_fiRegistryActionNumDaysToCorrectGaps))}'
                }
            },
            {
                xtype: 'button',
                cls: 'finaPrimaryBtn',
                text: i18n.changeRefusal,
                handler: 'onRefuseRegistration',
                disabled: true,
                disabledTooltip: i18n.pleaseGeneratePrescriptionDisabledTooltip,
                bind: {
                    hidden: '{!isRefusalSelected || !(isAccepted&&!isController)||!isRegistryActionEditor}',
                    disabled: '{!isRefusalSelected || !(refusalDecree && refusalDecree.documentNumber && refusalDecree.documentDate)}',
                }
            }]
    },

    listeners: {
        show: 'onShow'
    }
});
