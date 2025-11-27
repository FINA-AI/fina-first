Ext.define('first.view.registration.task.cancellation.CancellationDecreeCardLiquidatorView', {
    extend: 'Ext.panel.Panel',

    xtype: 'cancellationDecreeCardLiquidatorView',

    requires: [
        'first.view.registration.task.cancellation.CancellationDecreeCardLiquidatorController'
    ],

    controller: 'cancellationDecreeCardLiquidatorController',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'cardHeader'
    }, {
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
        margin: '5 5 5 5',
        title: '<b>' + i18n.reportCardTitle + '</b>',
        items: [{
            xtype: 'form',
            margin: '5 0 5 0',
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
            items: [{
                xtype: 'textfield',
                editable: false,
                inputWrapCls: '',
                triggerWrapCls: '',
                flex: 1,
                bind: {
                    value: '{existingReportCard.infoText}'
                }
            }, {
                xtype: 'button',
                margin: '0 0 0 5',
                text: i18n.downloadReportCard,
                iconCls: 'x-fa fa-cloud-download-alt',
                cls: 'finaSecondaryBtn',
                disabled: true,
                bind: {
                    disabled: '{!existingReportCard.infoText}'
                },
                handler: 'onReportCardDownloadClick',
                disabledTooltip: i18n.pleaseGenerateReportCardDisabledTooltip,
            }]
        }]
    }, {
        flex: 1,
        title: i18n.generateDocuments,
        xtype: 'actionGeneratedDocumentView'
    }, {
        flex: 1,
        title: i18n.liquidators,
        xtype: 'actionLiquidatorView'
    }],

    buttons: [{
        reference: 'finishRegistration',
        iconCls: 'x-fa fa-check',
        cls: 'finaPrimaryBtn',
        text: i18n.finishCancellation,
        handler: 'onFinishRegistrationClick',
        disabled: true,
        bind: {
            disabled: '{theFi.fina_fiRegistryStatus != "IN_PROGRESS" || !isRegistryActionEditor}'
        }
    }]

});
