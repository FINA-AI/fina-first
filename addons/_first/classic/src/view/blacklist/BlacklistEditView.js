Ext.define('first.view.blacklist.BlacklistEditView', {
    extend: 'Ext.window.Window',

    xtype: 'blacklistEditView',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.view.blacklist.BlacklistEditController'
    ],

    controller: 'blacklistEdit',

    height: Ext.getBody().getViewSize().height - 120,
    width: Ext.getBody().getViewSize().width - 120,

    modal: true,
    buttonAlign: 'center',

    scrollable: true,
    maximizable: true,

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

        reference:'formItems',


        items: [
            {
                xtype: 'panel',
                layout: 'column',
                defaults: {
                    margin: 5,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults: {
                        labelWidth: 200,
                        xtype: 'textfield',
                        anchor: '100%',
                        margin: '10 5',
                    },
                },
                items: [
                    {
                        columnWidth: 0.1,
                    }, {
                        reference: 'leftColumn',
                        columnWidth: 0.35,
                    }, {
                        columnWidth: 0.1,
                    }, {
                        reference: 'rightColumn',
                        columnWidth: 0.35,
                    }, {
                        columnWidth: 0.1,
                    },
                ]
            },
            {
                reference: 'singleLineField',
                items: []
            },
            {
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                reference: 'questionnaire',
                flex: 1,
                items: []
            }
        ]
    }],

    listeners: {
        beforeClose: 'beforeClose'
    },

    bbar: {
        items: ['->', {
            text: i18n.cancel,
            iconCls: 'x-fa fa-times',
            handler: 'onCancelBtnClick',
            cls: 'finaSecondaryBtn'
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-save',
            text: i18n.save,
            handler: 'onSaveBtnClick',
            cls: 'finaPrimaryBtn',
            formBind: true
        }]
    }
});