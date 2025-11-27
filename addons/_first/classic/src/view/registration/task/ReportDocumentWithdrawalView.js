Ext.define('first.view.registration.task.ReportDocumentWithdrawalView', {
    extend: 'Ext.panel.Panel',

    xtype: 'reportDocumentWithdrawal',

    requires: [
        'Ext.button.Button',
        'Ext.form.FieldSet',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'first.view.registration.task.shared.ActionLiquidatorView',
        'first.view.registration.task.shared.GapsForRedactorGridView'
    ],

    controller: 'reportDocumentWithdrawal',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

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
            bind: {
                html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToController + "</br></br></br><b><i>" + ' " {controllerName} "' + '</b></i></p>',
                hidden: '{!inReview}'
            }
        }, {
            xtype: 'fieldset',
            title: i18n.reportCardTitle,
            defaults: {
                anchor: '100%',
                labelAlign: 'top'
            },
            items: [{
                xtype: 'textfield',
                emptyText: i18n.reportCardInfoEmpty,
                inputAttrTpl: " data-qtip='" + i18n.reportCardInfoEmpty + "' ",
                editable: false,
                inputWrapCls: '',
                triggerWrapCls: '',
                margin: '10 0 0 0',
                flex: 1,
                bind: {
                    value: '{existingWithdrawalReportCard.infoText}'
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
                    text: i18n.reportCardGenerate,
                    handler: 'onReportCardGenerationClick',
                    bind: {
                        hidden: '{!editMode}'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-cloud-download-alt',
                    cls: 'finaSecondaryBtn',
                    text: i18n.downloadReportCard,
                    handler: 'onReportCardDownloadClick',
                    disabled: true,
                    bind: {
                        disabled: '{!existingWithdrawalReportCard.id}'
                    },
                    disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-cloud-upload-alt',
                    cls: 'finaSecondaryBtn',
                    text: i18n.uploadReportCard,
                    handler: 'onReportCardUploadClick',
                    disabled: true,
                    bind: {
                        disabled: '{!existingWithdrawalReportCard.id || !isRegistryActionEditor}',
                        hidden: '{!editMode}'
                    },
                    disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
                }]
            }]
        }, {
            xtype: 'textfield',
            fieldLabel: i18n.reportCardComment,
            editable: false,
            bind: {
                value: '{fiAction.fina_fiRegistryActionEditorComment}',
                editable: '{!inReview && isRegistryActionEditor}'
            }
        }]
    }, {
        flex: 1,
        title: i18n.liquidators,
        xtype: 'actionLiquidatorView',
        hidden: true,
        bind: {
            hidden: '{!fiAction.fina_fiCancellationIsLiquidatorRequired}'
        }
    }, {
        xtype: 'panel',
        flex: 1,
        margin: '10 10 0 10',
        layout: 'fit',
        items: [{
            xtype: 'gapsForRedactorGrid',
        }],
        bind: {
            hidden: '{!isDeclined||isGridHidden||!redactingStatusIsWithdrawal}'
        }
    }],

    bbar: {
        style: 'background-color:#f2efef',
        bind: {
            hidden: '{!isRegistryActionEditor}'
        },
        items: ['->',
            {
                text: i18n.registrationResume,
                handler: 'onRegistrationResume',
                cls: 'finaSecondaryBtn',
                bind: {
                    hidden: '{!editMode}'
                }
            }, {
                text: i18n.sendToController,
                handler: 'onSendToInspectorClick',
                cls: 'finaPrimaryBtn',
                disabled: true,
                bind: {
                    disabled: '{!existingWithdrawalReportCard.infoText}',
                    hidden: '{!editMode}'
                },
                disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
            }]
    }
});

