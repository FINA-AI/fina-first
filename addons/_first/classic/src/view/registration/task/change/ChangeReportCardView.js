Ext.define('first.view.registration.task.change.ChangeReportCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'changeReportCard',

    requires: [
        'first.view.registration.task.change.ChangeReportCardController'
    ],

    controller: 'changeReportCard',

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
            title: i18n.reportCardTitle,
            defaults: {
                anchor: '100%',
                margin: 3,
                labelAlign: 'top'
            },
            items: [{
                xtype: 'textfield',
                emptyText: i18n.reportCardInfoEmpty,
                inputAttrTpl: " data-qtip='" + i18n.reportCardInfoEmpty + "' ",
                editable: false,
                inputWrapCls: '',
                triggerWrapCls: '',
                bind: {
                    value: '{existingReportCard.infoText}'
                }
            }, {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
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
                    handler: 'onDownloadReportCardClick',
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
                    handler: 'onReportCardUploadClick',
                    disabled: true,
                    bind: {
                        disabled: '{!existingReportCard.id || !isRegistryActionEditor}',
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
    }],

    bbar: {
        bind: {
            hidden: '{!isRegistryActionEditor}'
        },
        items: ['->', {
            text: i18n.changesGoToEditInfoCard,
            handler: 'showPrevious',
            cls: 'finaSecondaryBtn',
            disabled: true,
            bind: {
                disabled: '{inReview}'
            }
        }, {
            text: i18n.sendToController,
            cls: 'finaPrimaryBtn',
            handler: 'onSendToInspectorClick',
            disabled: true,
            bind: {
                disabled: '{!existingReportCard.id}',
                hidden: '{!editMode}'
            },
            disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
        }]
    }

});
