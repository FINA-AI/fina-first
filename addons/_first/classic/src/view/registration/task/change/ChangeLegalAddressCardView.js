Ext.define('first.view.registration.task.change.ChangeLegalAddressCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'changeLegalAddressCard',

    requires: [
        'first.view.registration.task.change.ChangeLegalAddressCardController',
        'first.config.Config'
    ],

    controller: 'changeLegalAddressCard',

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
        },],


    bbar: {
        bind: {
            hidden: '{!isRegistryActionEditor}'
        },
        items: ['->',
            {
                text: i18n.finishProcess,
                handler: 'onLegalAddressChangeSubmit',
                cls: 'finaPrimaryBtn',
            },
        ]
    }

});
