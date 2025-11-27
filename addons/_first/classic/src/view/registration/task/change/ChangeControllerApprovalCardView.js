Ext.define('first.view.registration.task.change.ChangeControllerApprovalCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'changeControllerApprovalCard',

    requires: [
        'first.view.registration.task.change.ChangeControllerApprovalCardController'
    ],

    controller: 'changeControllerApprovalCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'cardHeader'
        }, {
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                flex: 1,
                margin: 10
            },
            items: [{
                xtype: 'label',
                hidden: true,
                bind: {
                    html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToRedactor + "</br></br></br><b><i>" + ' " {redactorName} "' + '</b></i></p>',
                    hidden: '{!showTaskStatusMessage}'
                }
            }, {
                xtype: 'fieldset',
                defaults: {
                    anchor: '100%',
                    labelAlign: 'left'
                },
                items: [{
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'textfield',
                        margin: '10 0 0 0',
                        flex: 1,
                        editable: false,
                        inputWrapCls: '',
                        triggerWrapCls: '',
                        bind: {
                            value: '{existingDocument.infoText}',
                            emptyText: '{documentStatusEmptyText}'
                        }
                    }, {
                        xtype: 'button',
                        iconCls: 'x-fa fa-cloud-download-alt',
                        cls: 'finaSecondaryBtn',
                        text: i18n.confirmationLetterDownload,
                        disabled: true,
                        handler: 'onConfirmationLetterDownloadClick',
                        bind: {
                            disabled: '{!existingDocument.id}',
                            text: '{documentViewText}'
                        }
                    }]
                }, {
                    xtype: 'textfield',
                    fieldLabel: i18n.editorComment,
                    margin: '10 0 10 0',
                    editable: false,
                    bind: {
                        value: '{fiAction.fina_fiRegistryActionEditorComment}'
                    }
                }],
                bind: {
                    title: '{documentTitle}'
                }
            },]
        },
        {
            xtype: 'changeListGrid',
            layout: 'fit',
            bind: {
                hidden: '{fiAction.fina_fiChangeFormType === "organizationalForm"}'
            }
        }, {
            xtype: 'fieldset',
            title: i18n.changesGridTitle,
            flex: 0,
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
            }],
            bind: {
                hidden: '{fiAction.fina_fiChangeFormType !== "organizationalForm"}'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: i18n.approvalLetterComment,
            margin: '10',
            bind: {
                value: '{fiAction.fina_fiRegistryActionControllerComment}',
                disabled: '{!inReview}'
            }
        }, {
            xtype: 'editorGapsGrid',
        }
    ],

    bbar: {
        cls: 'firstFiRegistryTbar',
        items: ['->', {
            xtype: 'button',
            cls: 'finaSecondaryBtn',
            text: i18n.sendErrors,
            handler: 'onGap',
            bind: {
                disabled: '{isControllerButtonDisabled}'
            }
        }, {
            xtype: 'button',
            cls: 'finaPrimaryBtn',
            text: i18n.accept,
            handler: 'onApprove',
            bind: {
                disabled: '{isControllerButtonDisabled}'
            }
        }]
    }

});
