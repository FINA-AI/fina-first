Ext.define('first.view.registration.task.ReportCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'reportCardView',

    requires: [
        'Ext.button.Button',
        'Ext.ux.layout.ResponsiveColumn',
        'Ext.grid.column.Date',
        'Ext.form.Label',
        'first.view.registration.task.ReportCardController'
    ],

    controller: 'reportCardController',

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
                    value: '{existingReportCard.infoText}'
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
        items: ['->', {
            text: '<b>' + i18n.goToSanctionedPeopleChecklist + ' </b>',
            handler: 'showPrevious',
            cls: 'finaSecondaryBtn',
            bind: {
                disabled: '{inReview || !isRegistryActionEditor}'
            }
        }, {
            text: i18n.sendToController,
            handler: 'onSendToInspectorClick',
            cls: 'finaPrimaryBtn',
            disabled: true,
            bind: {
                disabled: '{disableSendToControllerButton}',
                hidden: '{!editMode}'
            }, 
            disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
        }]
    }

});
