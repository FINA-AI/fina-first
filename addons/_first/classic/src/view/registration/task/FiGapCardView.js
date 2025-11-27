Ext.define('first.view.registration.task.FiGapCardView', {
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
        'first.view.registration.task.FiGapCardController',
        'first.view.registration.task.shared.GapsForRedactorGridView'
    ],

    xtype: 'fiGapView',

    controller: 'gapController',


    layout: {
        type: 'vbox',
        align: 'stretch'
    },


    items: [
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
            features: [{
                ftype: 'grouping',
                enableGroupingMenu: false,
                enableNoGroups: false
            }],

            columnLines: true,
            tbar: {
                items: [{
                    iconCls: 'x-fa fa-plus',
                    cls: 'finaSecondaryBtn',
                    tooltip: i18n.addGapButtonText,
                    text: i18n.addGapButtonText,
                    handler: 'onAddClick',
                }, {
                    iconCls: 'x-fa fa-sign-in-alt',
                    cls: 'finaSecondaryBtn',
                    tooltip: i18n.addFromQuestionnaireButtonText,
                    text: i18n.addFromQuestionnaireButtonText,
                    handler: 'onSyncFromQuestionnaires'
                }],
                bind: {
                    disabled: '{!editMode}',
                    hidden: '{editModeController||isAccepted}'
                }
            },

            store: {
                type: 'fiGapStore'
            },

            columns: [{
                flex: 0,
                xtype: 'rownumberer'
            }, {
                xtype: 'actioncolumn',
                width: 40,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                items: [{
                    iconCls: 'x-fa fa-edit',
                    tooltip: i18n.edit,
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
                width: 40,
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
                                text: '{reportDocument.modificationTime} / {reportDocument.status}'
                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.generateGapletterButtonText,
                            iconCls: 'x-fa fa-cog',
                            cls: 'finaSecondaryBtn',
                            flex: 0,
                            disabled: true,
                            bind: {
                                text: '{!isRefusalSelected ? "' + i18n.generateGapletterButtonText + '" : "' + i18n.generateRefusalReportCardButtonText + '"}',
                                disabled: '{inReview || !isRegistryActionEditor|| !isGapsCreated}',
                                iconCls: '{!reportDocument.isLatestVersion?"x-fa fa-exclamation-triangle orange":"x-fa fa-cog"}',
                                tooltip: '{!reportDocument.isLatestVersion?"' + i18n.regenerateDocument + '":"' + i18n.generateDocument + '"}'
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
                                disabled: '{!isReportDocumentGenerated}',
                                text: '{!isRefusalSelected ? "' + i18n.downloadGapLetter + '" : "' + i18n.download + '"}',
                                tooltip: '{!isRefusalSelected ? "' + i18n.downloadGapLetter + '" : "' + i18n.downloadRefusalReportCard + '"}'
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
                                disabled: '{!reportDocument || inReview}',
                                text: '{!isRefusalSelected ? "' + i18n.uploadGapLetter + '" : "' + i18n.upload + '"}',
                                tooltip: '{!isRefusalSelected ? "' + i18n.uploadGapLetter + '" : "' + i18n.uploadRefusalReportCard + '"}'
                            },
                            handler: 'onUploadGapLetterClick'
                        }
                    ],
                }
            ],
            bind: {
                hidden: '{editModeController||isController||isAccepted||!isRegistryActionEditor}'
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
                                text: '{reportDocument.modificationTime} / {reportDocument.status}'
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
                    ]
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
                                value: '{reportDocument.letterDate}',
                                disabled: '{workflowVariables.bpm_outcome =="Reject"}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.gapLetterNumber,
                            flex: 1,
                            bind: {
                                value: '{reportDocument.letterNumber}',
                                disabled: '{workflowVariables.bpm_outcome =="Reject"}'
                            }
                        },
                        {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            fieldLabel: i18n.correctionDeadline,
                            flex: 1,
                            minValue: (new Date()),
                            bind: {
                                value: '{fiAction.fina_fiRegistryActionGapCorrectionDeadline}',
                                disabled: '{workflowVariables.bpm_outcome =="Reject"}'
                            },
                            listeners: {
                                select: 'onGapCorrectionDeadlineDateSelect'
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
                        hidden: '{!isAccepted||isController||isRefusalSelected}'
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
                            fieldLabel: i18n.refusalDecreeNumber,
                            bind: {
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
                            fieldLabel: i18n.refusalDecreeDate,
                            bind: {
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
                                    iconCls: 'x-fa fa-cog',
                                    cls: 'finaSecondaryBtn',
                                    text: i18n.refusalDecreeGenerationTitle,
                                    handler: 'onGenerateRefusalDecreeButtonClick',
                                    bind: {
                                        disabled: '{!isRegistryActionEditor || inReview || !isAccepted}'
                                    },
                                },
                                {
                                    xtype: 'button',
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
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'x-fa fa-cloud-download-alt',
                                    cls: 'finaSecondaryBtn',
                                    text: i18n.representativeLetterDownload,
                                    handler: 'onLetterToTheRepresentativeDownloadClick',
                                    disabled: true,
                                    bind: {
                                        disabled: '{!existingLetterToTheRepresentative.id}'
                                    }
                                },
                            ]
                        }
                    ],

                    bind: {
                        hidden: '{!(isAccepted&&isRefusalSelected)}'
                    }
                }
            ],
            bind: {
                hidden: '{!editModeController&&!(isAccepted&&!isController)||!isRegistryActionEditor}'
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
        cls: 'firstFiRegistryTbar',
        items: ['->',
            {
                itemId: 'card-next',
                cls: 'finaSecondaryBtn',
                text: i18n.goBack,
                handler: 'showNext',
                bind: {
                    disabled: '{inReview || !isRegistryActionEditor}',
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
                    disabled: '{!reportDocument || !isGapsCreated}',
                    hidden: '{!editMode||editModeController||isController||isAccepted}'
                },
                disabledTooltip: i18n.sendGapToControllerDisabledTooltip,
            },

            {
                xtype: 'button',
                text: i18n.sendErrors,
                cls: 'finaSecondaryBtn',
                handler: 'onGap',
                bind: {
                    hidden: '{!editModeController&&!isController}',
                    disabled: '{!inReview}'
                }
            },
            {
                xtype: 'button',
                text: i18n.accept,
                cls: 'finaPrimaryBtn',
                handler: 'onApprove',
                bind: {
                    hidden: '{!editModeController&&!isController}',
                    disabled: '{!inReview}'
                }
            },
            {
                xtype: 'button',
                text: i18n.makeGap,
                cls: 'finaPrimaryBtn',
                handler: 'onFinishClick',
                bind: {
                    hidden: '{!(isAccepted&&!isController)||!isRegistryActionEditor}',
                    text: '{finishButtonText}'
                }
            }]
    },

    listeners: {
        show: 'onShow'
    }
});
