Ext.define('first.view.registration.correspondence.FiProfileCorrespondenceEditView', {
    extend: 'Ext.window.Window',
    xtype: 'fiProfileCorrespondenceItemEditEcm',

    controller: 'fiProfileCorrespondenceItemEditEcm',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.form.field.HtmlEditor'
    ],

    viewModel: {
        type: 'fiProfile'
    },

    bind: {
        title: '{title}'
    },

    height: Ext.getBody().getViewSize().height - 120,
    width: Ext.getBody().getViewSize().width - 120,

    modal: true,

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'form',
        scrollable: true,
        defaults: {
            labelWidth: 200,
            xtype: 'textfield',
            anchor: '100%',
            margin: 5
        },
        reference: 'formItems',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        flex: 1,
        items: [
            {
                xtype: 'combobox',
                displayField: 'displayVal',
                valueField: 'actualVal',
                queryMode: 'local',
                store: {
                  fields: ['displayVal', 'actualVal'],
                  data: [
                      {'actualVal': 'CREATED', 'displayVal': i18n['CREATED']},
                      {'actualVal': 'SENT', 'displayVal': i18n['SENT']},
                      {'actualVal': 'SEND_FAILED', 'displayVal': i18n['SEND_FAILED']},
                      {'actualVal': 'DELIVERED', 'displayVal': i18n['DELIVERED']},
                      {'actualVal': 'DELIVERY_FAILED', 'displayVal': i18n['DELIVERY_FAILED']},
                  ]
                },
                fieldLabel: i18n.status,
                disabled: true,
                bind: '{model.fina_smsStatus}'
            },
            {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                fieldLabel: i18n.creationDate,
                disabled: true,
                bind: '{model.fina_smsCreationDate}'
            },
            {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                fieldLabel: i18n.sendDate,
                disabled: true,
                bind: '{model.fina_smsSendDate}'
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.recipients,
                bind: {
                    value: '{model.fina_smsAddress}',
                    editable: '{isRegistryActionEditor}'
                }
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.title,
                bind: {
                    value: '{model.fina_smsTitle}',
                    editable: '{isRegistryActionEditor}'
                }
            },
            {
                xtype: 'textarea',
                fieldLabel: i18n.content,
                bind: {
                    value: '{model.fina_smsContent}',
                    editable: '{isRegistryActionEditor}'
                },
                height: '200px',
            }
        ]
    }],

    buttons: [
        {
            text: i18n.cancel,
            iconCls: 'x-fa fa-times',
            handler: 'onCancelButtonClick',
            cls: 'finaSecondaryBtn'
        },
        {
            text: i18n.save,
            iconCls: 'x-fa fa-save',
            reference: 'saveButton',
            handler: 'onSaveButtonClick',
            cls: 'finaPrimaryBtn',
            bind: {
                hidden: '{!isRegistryActionEditor}'
            }
        },
        {
            text: i18n.saveAndSend,
            iconCls: 'x-fa fa-send',
            reference: 'saveAndSendButton',
            handler: 'onSaveAndSendButtonClick',
            cls: 'finaPrimaryBtn',
            bind: {
                hidden: '{!isRegistryActionEditor}'
            }
        }
    ]
});