Ext.define('first.view.registration.task.change.ChangeApprovalLetterAndChangesCardView', {
    extend: 'Ext.panel.Panel',

    requires: [
        'first.view.registration.task.shared.ChangeListGridView'
    ],

    xtype: 'changeApprovalLetterAndChangesCard',
    controller: 'changeApprovalLetterAndChangesCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'cardHeader',
        },
        {
            xtype: 'changeListGrid',
            layout: 'fit'
        },
        {
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
                            value: '{controllerStatusI18n}'
                        }
                    },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.comment,
                            editable: false,
                            inputWrapCls: '',
                            triggerWrapCls:'',
                            flex: 1,
                            bind: {
                                value: '{fiAction.fina_fiRegistryActionControllerComment}'
                            }
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'fieldset',
            reference: 'approvalLetterFieldSet',
            title: i18n.approvalLetterTitle,
            style: {
                margin: '10px'
            },
            defaults: {
                style: {
                    margin: '15px',
                    display: 'block',
                }
            },
            items: [
                {
                    xtype: 'panel',
                    flex: 0,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            emptyText: i18n.approvalLetterStatusEmpty,
                            inputAttrTpl: " data-qtip='" + i18n.approvalLetterStatusTooltip + "' ",
                            editable: false,
                            inputWrapCls: '',
                            triggerWrapCls: '',
                            margin: '10 0 0 0',
                            flex: 1,
                            bind: {
                                value: '{existingApprovalLetter.infoText}'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-cloud-download-alt',
                            cls: 'finaSecondaryBtn',
                            text: i18n.confirmationLetterDownload,
                            disabled: true,
                            handler: 'onConfirmationLetterDownloadClick',
                            bind: {
                                disabled: '{!existingDocument.id}'
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
                            xtype: 'textfield',
                            fieldLabel: i18n.approvalLetterNumber,
                            flex: 1,
                            bind: {
                                value: '{existingApprovalLetter.documentNumber}',
                                disabled: '{!isRegistryActionEditor}'
                            }
                        },
                        {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            fieldLabel: i18n.approvalLetterDate,
                            flex: 1,
                            bind: {
                                value: '{existingApprovalLetter.documentDate}',
                                disabled: '{!isRegistryActionEditor}'
                            }
                        }
                    ]
                }
            ]
        }
    ],

    buttons: [
        {
            xtype: 'button',
            cls: 'finaPrimaryBtn',
            reference: 'finishChange',
            text: i18n.finishChange,
            handler: 'onFinishChangeClick',
            disabled: 'true',
            bind: {
                disabled: '{!isRegistryActionEditor || !existingApprovalLetter.documentNumber || !existingApprovalLetter.documentDate}'
            }
        }
    ]
});
