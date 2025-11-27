Ext.define('first.view.questionnaire.QuestionnaireEditView', {
    extend: 'Ext.window.Window',

    xtype: 'question-edit-window-ecm',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.store.fi.FiTypeStore',
        'first.store.questionnaire.QuestionnaireGroupStore',
        'first.view.questionnaire.QuestionnaireEditController'
    ],

    controller: 'questionnaireEditController',

    width: 500,
    resizable: false,
    modal: true,
    buttonAlign: 'center',

    title: {
        textAlign: 'center'
    },

    items: [{
        xtype: 'form',
        reference: 'questionEditForm',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            padding: 5,
            allowBlank: false
        },

        items: [{
            xtype: 'combobox',
            reference: 'questionnaireEditFiTypeCombo',
            fieldLabel: i18n.questionnaireFiType,
            name: 'fiType',
            store: {
                type: 'fiTypeStore',
                storeId: 'questionnaireEditFiTypeStore'
            },
            valueField: 'id',
            displayField: 'code',
            queryMode: 'local',
            forceSelection: true,
            bind: {
                value: '{questionnaire.fiType.id}'
            },
            listConfig: {
                itemTpl: [
                    '<div data-qtip="{code}: {description}">{code} - {description}</div>'
                ]
            }
        }, {
            xtype: 'combobox',
            fieldLabel: i18n.questionnaireGroup,
            name: 'group',
            store: {
                type: 'questionnaireGroupStore',
                storeId: 'questionnaireEditGroupStore'
            },
            valueField: 'id',
            displayField: 'code',
            queryMode: 'local',
            forceSelection: true,
            bind: {
                value: '{questionnaire.group.id}'
            },
            listConfig: {
                itemTpl: [
                    '<div data-qtip="{code}: {description}">{code} - {description}</div>'
                ]
            }
        }, {
            xtype: 'textfield',
            fieldLabel: i18n.questionnaireCode,
            name: 'code',
            allowBlank: true,
            bind: {
                value: '{questionnaire.code}'
            }
        }, {
            xtype: 'combobox',
            fieldLabel: i18n.questionnaireDefaultValue,
            allowBlank: true,
            nameL: 'defaultValue',
            store: {
                data: [{
                    value: 'NONE',
                    text: i18n.NONE
                }, {
                    value: 'OK',
                    text: i18n.OK
                }, {
                    value: 'NO',
                    text: i18n.NO
                }]
            },
            valueField: 'value',
            displayField: 'text',
            queryMode: 'local',
            forceSelection: true,
            bind: {
                value: '{questionnaire.defaultValue}'
            }
        }, {
            xtype: 'textarea',
            fieldLabel: i18n.questionnaireQuestionBody,
            name: 'question',
            bind: {
                value: '{questionnaire.question}'
            }
        }, {
            xtype: 'checkboxfield',
            fieldLabel: i18n.questionnaireObligatory,
            name: 'obligatory',
            bind: {
                value: '{questionnaire.obligatory}'
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