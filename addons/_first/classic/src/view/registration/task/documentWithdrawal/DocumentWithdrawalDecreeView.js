Ext.define('first.view.registration.task.documentWithdrawal.DocumentWithdrawalDecreeView', {
    extend: 'Ext.panel.Panel',

    xtype: 'documentWithdrawalDecreeView',

    requires: [
        'Ext.button.Button',
        'Ext.form.FieldSet',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'first.view.registration.task.documentWithdrawal.DocumentWithdrawalDecreeController'
    ],

    controller: 'documentWithdrawalDecree',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
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
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
            defaults: {
                flex: 1,
                xtype: 'textfield',
                editable: false
            },
            items: [{
                fieldLabel: i18n.status,
                margin: '5 0 5 0',
                bind: {
                    value: '{decreeFiAction.fina_fiRegistryActionControlStatusI18n}'
                }
            }, {
                fieldLabel: i18n.comment,
                margin: '5 0 5 5',
                bind: {
                    value: '{fiAction.fina_fiRegistryActionControllerComment}'
                }
            }]
        }]
    }, {
        xtype: 'fieldset',
        title: i18n.decreeGenerationTitle,
        flex: 0,
        margin: '10 10 10 10',
        items: [
            {
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
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.decreeNumber,
                        bind: {
                            value: '{decreeDocumentNumber}',
                            disabled: '{!isRegistryActionEditor}'
                        },
                        listeners: {
                            blur: 'updateDecreeDocumentDetails'
                        }
                    },
                    {
                        xtype: 'datefield',
                        format: first.config.Config.dateFormat,
                        fieldLabel: i18n.decreeDate,
                        bind: {
                            value: '{decreeDocumentDate}',
                            disabled: '{!isRegistryActionEditor}'
                        },
                        listeners: {
                            blur: 'updateDecreeDocumentDetails'
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
                                text: i18n.decreeGenerationTitle,
                                handler: 'onGenerateDecreeButtonClick',
                                bind: {
                                    disabled: '{!isRegistryActionEditor || inReview || !isAccepted}'
                                },
                            },
                            {
                                xtype: 'button',
                                margin: '0 5 0 5',
                                iconCls: 'x-fa fa-cloud-download-alt',
                                cls: 'finaSecondaryBtn',
                                text: i18n.decreeDownload,
                                handler: 'onDecreeCardDownloadClick',
                                disabled: true,
                                bind: {
                                    disabled: '{!decreeDocument}'
                                }
                            },
                            {
                                xtype: 'button',
                                iconCls: 'x-fa fa-cloud-upload-alt',
                                cls: 'finaSecondaryBtn',
                                text: i18n.uploadDecree,
                                handler: 'onDecreeCardUploadClick',
                                disabled: true,
                                bind: {
                                    disabled: '{!isRegistryActionEditor}'
                                }
                            },
                            {
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
                            }
                        ]
                    }
                ],
                bind: {
                    disabled: '{!headOfficeBranch}'
                }
            }]
    }],

    buttons: [{
        reference: 'finishRegistration',
        iconCls: 'x-fa fa-check',
        cls: 'finaPrimaryBtn',
        text: i18n.finishProcess,
        handler: 'onFinishRegistrationClick',
        disabled: true,
        bind: {
            disabled: '{!(isRegistryActionEditor && decreeDocumentNumber && decreeDocumentDate && decreeDocument)}'
        }
    }]

});
