Ext.define('first.view.registration.FiProfileDetailView', {
    extend: 'Ext.window.Window',

    xtype: 'fiProfileDetailEcm',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'first.view.registration.FiProfileDetailController',
        'first.view.registration.FiProfileModel'
    ],

    controller: 'fiProfileDetailEcm',

    viewModel: {
        type: 'fiProfile'
    },

    bind: {
        title: i18n.fiProfileAddEdit + ' - {type}',
    },

    scrollable: true,

    maximizable: true,

    height: Ext.getBody().getViewSize().height - 120,
    width: Ext.getBody().getViewSize().width - 120,

    modal: true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'form',
        reference: 'formItems',
        scrollable: true,
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

    buttons: [{
        text: i18n.cancel,
        iconCls: 'x-fa fa-times',
        handler: 'onCancelButtonClick',
        cls: 'finaSecondaryBtn'
    }, {
        text: i18n.save,
        iconCls: 'x-fa fa-save',
        reference: 'submitButton',
        handler: 'onSubmitButtonClick',
        cls: 'finaPrimaryBtn'
    },],

    listeners: {
        resize: 'onResize'
    }
});
