Ext.define('first.view.questionnaire.QuestionnaireGroupEditView', {
    extend: 'Ext.window.Window',

    xtype: 'questionnaireGroupEditView',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.view.questionnaire.QuestionnaireGroupEditController'
    ],

    controller: 'questionnaireGroupEditController',

    width: 500,
    resizable: false,
    modal: true,
    buttonAlign: 'center',

    items: [{
        xtype: 'form',
        reference: 'questionaireGroupEditForm',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            padding: 5,
            allowBlank: false
        },

        items: [{
            xtype: 'textfield',
            fieldLabel: i18n.questionnaireGroupCode,
            bind: {
                value: '{questionnaireGroup.code}'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: i18n.questionnaireGroupDescription,
            bind: {
                value: '{questionnaireGroup.description}'
            }
        }],

        bbar: {
            items: ['->', {
                xtype: 'button',
                reference: 'saveButton',
                text: i18n.save,
                handler: 'onSaveBtnClick',
                formBind: true
            }, {
                xtype: 'button',
                reference: 'cancelButton',
                text: i18n.cancel,
                handler: 'onCancelBtnClick'
            }]
        }
    }]
});