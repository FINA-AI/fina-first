Ext.define('first.view.registration.task.change.ChangeGeneralInfoCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'changeGeneralInfoCard',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'first.view.registration.task.change.ChangeGeneralInfoCardController',
        'first.view.registration.task.shared.CardHeaderView',
        'first.view.registration.task.shared.GapsForRedactorGridView'
    ],

    controller: 'changeGeneralInfoCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    margin: 5,

    items: [
        {
            xtype: 'cardHeader'
        },
        {
            xtype: 'form',
            flex: 0,
            scrollable: true,
            margin: '0 10 0 10',
            reference: 'generalInfoForm',
            defaults: {
                flex: 1,
                width: '100%'
            },
            tbar: {
                margin: '0 0 10 0',
                items: [{
                    xtype: 'button',
                    cls: 'finaSecondaryBtn',
                    text: i18n.changesSaveGeneralInfo,
                    handler: 'onSaveClick',
                    bind: {
                        disabled: '{!isRegistryActionEditor}'
                    }
                }]
            },
            items: [],
        }, {
            xtype: 'panel',
            flex: 1,
            margin: '10 10 0 10',
            layout: 'fit',
            items: [{
                xtype: 'gapsForRedactorGrid',
            }],
            bind: {
                hidden: '{!isDeclined||isGridHidden||!redactingStatusIsAccepted}'
            }
        }],


    bbar: {
        bind: {
            hidden: '{!isRegistryActionEditor}'
        },
        items: ['->',
            {
                text: i18n.makeGap,
                handler: 'onGap',
                cls: 'finaSecondaryBtn',
            },
            {
                text: i18n.changesGoToReportCard,
                handler: 'onGenerateReportCard',
                cls: 'finaPrimaryBtn',
                disabled: true,
                bind: {
                    disabled: '{theFi.fina_fiRegistryLegalFormType===changedData.fina_fiOrganisationalFormAndNameChangeLegalFormType ' +
                        '&& theFi.fina_fiRegistryName===changedData.fina_fiOrganisationalFormAndNameChangeName}'
                },
                disabledTooltip: i18n.changesMakeChangeDisabledTooltip,
            },
        ]
    }

});
