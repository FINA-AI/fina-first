Ext.define('first.view.registration.task.change.ChangeApprovalLetterCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'changeApprovalLetterCard',

    requires: [
        'Ext.button.Button',
        'Ext.form.FieldSet',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.view.registration.task.change.ChangeApprovalLetterCardController',
        'first.view.registration.task.shared.CardHeaderView'
    ],

    controller: 'changeApprovalLetterCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
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
            bind: {
                html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToController + "</br></br></br><b><i>" + ' " {controllerName} "' + '</b></i></p>',
                hidden: '{!inReview}'
            }
        }, {
            xtype: 'fieldset',
            title: i18n.approvalLetterTitle,
            defaults: {
                anchor: '100%',
                labelAlign: 'top'
            },
            items: [{
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
            }, {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                margin: '10 0 10 0',
                items: [{
                    xtype: 'button',
                    iconCls: 'x-fa fa-cog',
                    cls: 'finaSecondaryBtn',
                    text: i18n.approvalLetterGeneration,
                    handler: 'onApprovalLetterGenerationClick',
                    bind: {
                        disabled: '{inReview || !isRegistryActionEditor}'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-cloud-download-alt',
                    cls: 'finaSecondaryBtn',
                    text: i18n.confirmationLetterDownload,
                    disabled: true,
                    handler: 'onConfirmationLetterDownloadClick',
                    bind: {
                        disabled: '{!existingApprovalLetter.id}'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-cloud-upload-alt',
                    cls: 'finaSecondaryBtn',
                    text: i18n.uploadConfirmationLetter,
                    handler: 'onConfirmationLetterUploadClick',
                    disabled: true,
                    bind: {
                        disabled: '{!existingApprovalLetter.id || !isRegistryActionEditor}',
                        hidden: '{!editMode}'
                    }
                }]
            }]
        }, {
            xtype: 'textfield',
            fieldLabel: i18n.approvalLetterComment,
            editable: false,
            bind: {
                value: '{fiAction.fina_fiRegistryActionEditorComment}',
                editable: '{!inReview && isRegistryActionEditor}'
            }
        }]
    }],

    bbar: {
        cls:'firstFiRegistryTbar',
        bind: {
            hidden: '{!isRegistryActionEditor}'
        },
        items: ['->', {
            text: i18n.goToSanctionedPeopleChecklist,
            handler: 'onSanctionedPeopleCheck',
            cls: 'finaSecondaryBtn',
            disabled: true,
            bind: {
                disabled: '{inReview}'
            }
        }, {
            text: i18n.sendToController,
            handler: 'onSendToController',
            cls: 'finaPrimaryBtn',
            disabled: true,
            bind: {
                disabled: '{!existingApprovalLetter.id}',
                hidden: '{!editMode}'
            },
            disabledTooltip: i18n.pleaseGenerateApprovalCardDisabledTooltip,
        }]
    }

});
