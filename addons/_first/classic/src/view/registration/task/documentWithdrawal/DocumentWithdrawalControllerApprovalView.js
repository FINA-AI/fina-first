Ext.define('first.view.registration.task.documentWithdrawal.DocumentWithdrawalControllerApprovalView', {
    extend: 'Ext.panel.Panel',

    xtype: 'documentWithdrawalControllerApprovalView',

    requires: [
        'Ext.button.Button',
        'Ext.form.FieldSet',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.view.registration.task.documentWithdrawal.DocumentWithdrawalControllerApprovalController',
        'first.view.registration.task.shared.ActionLiquidatorView',
        'first.view.registration.task.documentWithdrawal.DocumentWithdrawalReportController'
    ],

    controller: 'documentWithdrawalControllerApproval',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    margin: 1,

    items: [{
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
            title: i18n.reportCardTitle,
            defaults: {
                anchor: '100%'
            },
            items: [{
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },

                controller: 'documentWithdrawalReport',

                items: [{
                    xtype: 'textfield',
                    emptyText: i18n.reportCardInfoEmpty,
                    inputAttrTpl: " data-qtip='" + i18n.reportCardInfoEmpty + "' ",
                    editable: false,
                    inputWrapCls: '',
                    triggerWrapCls: '',
                    flex: 1,
                    margin: '10 0 10 0',
                    bind: {
                        value: '{existingWithdrawalReportCard.infoText}'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-cloud-download-alt',
                    cls: 'finaSecondaryBtn',
                    text: i18n.downloadReportCard,
                    margin: '10 0 10 5',
                    handler: 'onReportCardDownloadClick',
                    disabled: true,
                    bind: {
                        disabled: '{!existingWithdrawalReportCard.id}'
                    },
                    disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
                }, {
                    xtype: 'button',
                    margin: '10 0 10 5',
                    iconCls: 'x-fa fa-cloud-upload-alt',
                    cls: 'finaSecondaryBtn',
                    text: i18n.uploadReportCard,
                    handler: 'onReportCardUploadClick',
                    disabled: true,
                    bind: {
                        disabled: '{!existingWithdrawalReportCard.id || !isController}'
                    },
                    disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.editorComment,
                labelWidth: 200,
                margin: '10 0 10 0',
                editable: false,
                bind: {
                    value: '{fiAction.fina_fiRegistryActionEditorComment}'
                }
            }]
        }]
    }, {
        xtype: 'textfield',
        fieldLabel: i18n.approvalLetterComment,
        margin: '10',
        bind: {
            value: '{fiAction.fina_fiRegistryActionControllerComment}',
            disabled: '{!inReview}'
        }
    }, {
        flex: 1,
        title: i18n.liquidators,
        xtype: 'actionLiquidatorView',
        hidden: true,
        bind: {
            hidden: '{!fiAction.fina_fiCancellationIsLiquidatorRequired}'
        }
    }],

    bbar: {
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
