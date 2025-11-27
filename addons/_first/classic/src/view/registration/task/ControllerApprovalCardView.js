Ext.define('first.view.registration.task.ControllerApprovalCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'controllerApproval',

    requires: [
        'Ext.button.Button',
        'first.view.registration.task.ControllerApprovalController',
        'first.view.registration.task.ReportCardController'
    ],

    controller: 'controllerApproval',

    layout: {
        type: 'fit'
    },

    margin: 1,

    items: [{
        xtype: 'label',
        hidden: true,
        bind: {
            html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToRedactor + "</br></br></br><b><i>" + ' " {redactorName} "' + '</b></i></p>',
            hidden: '{!showTaskStatusMessage}'
        }
    }, {
        xtype: 'panel',

        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        defaults: {
            margin: '5 10 5 10',
        },

        items: [
            {
                xtype: 'fieldset',
                title: i18n.goToSanctionedPeopleChecklist,
                padding: '10',
                items: [
                    {
                        xtype: 'button',
                        cls: 'finaSecondaryBtn',
                        text: i18n.checklistResult,
                        handler: 'onSanctionedPeopleChecklistReviewClick'
                    },
                    {
                        xtype: 'label',
                        html: '<span style="color: red;">' + i18n.pleaseReviewTheChecklist + '</span>',
                        bind: {
                            hidden: '{!isSanctionedPeopleChecklistUpdated}'
                        }
                    }
                ]
            },
            {
                xtype: 'panel',

                controller: 'reportCardController',

                items: [{
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
                                value: '{existingReportCard.infoText}'
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
                                disabled: '{!existingReportCard.id}'
                            },
                            disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
                        }, {
                            xtype: 'button',
                            iconCls: 'x-fa fa-cloud-upload-alt',
                            cls: 'finaSecondaryBtn',
                            text: i18n.uploadReportCard,
                            margin: '10 0 10 5',
                            handler: 'onReportCardUploadClick',
                            disabled: true,
                            bind: {
                                disabled: '{!existingReportCard.id}'
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
            },
            {
                xtype: 'panel',
                items: [{
                    xtype: 'textfield',
                    name: 'comment',
                    fieldLabel: i18n.comment,
                    width: '100%',

                    bind: {
                        value: '{fiAction.fina_fiRegistryActionControllerComment}',
                        disabled: '{!inReview}'
                    }
                }]
            },
            {
                xtype: 'editorGapsGrid',
            }
        ],

        bbar: {
            style: 'background-color:#f2efef',
            items: [
                '->',
                {
                    xtype: 'button',
                    cls: 'finaSecondaryBtn',
                    text: i18n.sendErrors,
                    handler: 'onGap',
                    bind: {
                        disabled: '{isControllerButtonDisabled}'
                    }
                },
                {
                    xtype: 'button',
                    cls: 'finaPrimaryBtn',
                    text: i18n.accept,
                    handler: 'onApprove',
                    bind: {
                        disabled: '{isControllerButtonDisabled}'
                    }
                }
            ]

        }

    }]

});
