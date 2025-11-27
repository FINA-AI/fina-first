Ext.define('first.view.licensetype.LicenseTypeEditView', {
    extend: 'Ext.window.Window',

    xtype: 'licenseTypeEditWindow',

    controller: 'licenseTypeEditController',

    width: 600,
    resizable: false,
    modal: true,
    
    title: {
        textAlign: 'center',
        text: i18n.licenseTypeAdd
    },

    items: [{
        xtype: 'form',

        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        defaults: {
            padding: 5,
            allowBlank: false,
            labelWidth: 200,
        },

        items: [{
            xtype: 'combobox',
            fieldLabel: i18n.type,
            displayField: 'type',
            valueField:'id',
                store: {
                    data: [
                        {id:'LICENSE',type: i18n.LICENSE},
                        {id:'CERTIFICATE',type: i18n.CERTIFICATE}
                    ]
                },
            bind: {
                value: '{record.type}'
            },
            forceSelection: true,
           
        },{
            xtype: 'textfield',
            fieldLabel: i18n.licenseTypeIdentifier,
            bind: {
                value: '{record.identifier}'
            }
        },{
            xtype: 'textfield',
            fieldLabel: i18n.licenseName,
            bind: {
                value: '{record.name}'
            }
        },{
            xtype: 'tagfield',
            fieldLabel: i18n.licsnseAllowedOperations,
            displayField: 'description',
            valueField:'code',
            growMax: 120,
            store: {
                data: [
                    {code:'ATTRACTION_OF_DEPOSITS',description: i18n.ATTRACTION_OF_DEPOSITS},
                    {code:'LOANS',description: i18n.LOANS},
                    {code: 'FACTORING', description: i18n.FACTORING},
                    {code: 'FORFEITING', description: i18n.FORFEITING},
                    {code: 'PSMMC', description: i18n.PSMMC},
                    {code: 'BUY_SELL_CURRENCY', description: i18n.BUY_SELL_CURRENCY},
                    {code: 'PURCHASE_SALE_SHARES', description: i18n.PURCHASE_SALE_SHARES},
                    {code: 'PURCHASE_SALE_FUNDS', description: i18n.PURCHASE_SALE_FUNDS},
                    {code: 'BANK_GUARNATEES_PROVISION', description: i18n.BANK_GUARNATEES_PROVISION},
                    {code: 'SETTLEMENTS_MONEY_TRANSFER', description: i18n.SETTLEMENTS_MONEY_TRANSFER},
                    {code: 'MMI', description: i18n.MMI},
                    {code: 'VALUABLE_STORAGE', description: i18n.VALUABLE_STORAGE},
                    {code: 'TSP', description: i18n.TSP},
                    {code: 'ANY_OTHER_OPS', description: i18n.ANY_OTHER_OPS},
                    {code: 'CASH_OPS', description: i18n.CASH_OPS},
                    {code: 'COLLECT_TRANSFER_BANKNOTES', description: i18n.COLLECT_TRANSFER_BANKNOTES},
                    {code: 'ISSUANCE_GUARANTEE_PROVIDING', description: i18n.ISSUANCE_GUARANTEE_PROVIDING},
                    {code: 'FINANCIAL_RENT', description: i18n.FINANCIAL_RENT},
                    {code: 'METAL_STONES_OPS', description: i18n.METAL_STONES_OPS},
                    {code: 'AGENT_SERVICE_PROVISION', description: i18n.AGENT_SERVICE_PROVISION},
                    {code: 'ADVISER_SERVICE_PROVISION', description: i18n.ADVISER_SERVICE_PROVISION},
                    {code: 'FCIS', description: i18n.FCIS},
                ]
            },
            bind: {
                value: '{record.allowedOperations}'
            }
        },{
            xtype: 'textfield',
            fieldLabel: i18n.licenseDocumentNumber,
            allowBlank: true,
            bind: {
                value: '{record.documentNumber}'
            }
        }],

        bbar: {
            items: ['->', {
                xtype: 'button',
                text: i18n.save,
                handler: 'onSaveButtonClick',
                formBind: true,
                cls: 'finaPrimaryBtn'
            }, {
                xtype: 'button',
                text: i18n.cancel,
                handler: 'onCancelButtonClick',
                cls: 'finaSecondaryBtn'
            }]
        }
    }],
    listeners: {
        close: 'onClose'
    }
});