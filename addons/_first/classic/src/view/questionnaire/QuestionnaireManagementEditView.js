Ext.define('first.view.questionnaire.QuestionnaireManagementEditView', {
    extend: 'Ext.window.Window',

    xtype: 'editquestionnaireManagement',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.TextArea',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.store.fi.FiTypeStore',
        'first.store.questionnaire.QuestionnaireGroupStore',
        'first.view.questionnaire.QuestionnaireManagementEditController'
    ],

    controller: 'editquestionnaireManagementController',

    width: 500,
    resizable: false,
    modal: true,
    buttonAlign: 'center',

    title: {
        textAlign: 'center'
    },

    items: [
        {
            xtype: 'form',
            reference: 'questionManagementEditForm',
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
                    value: '{questionnaireGroup.fiType.id}'
                },
                listeners: {
                    select: 'onFiTypeComboSelect'
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
                    value: '{questionnaireGroup.group.id}'
                },
                listeners: {
                    select: 'onGroupComboSelect'
                }
            }, {
                xtype: 'combobox',
                reference: 'questionnaireParentCombo',
                disabled: true,
                fieldLabel: i18n.parent,
                store: {
                    type: 'questionnaireStore',
                    loadMask: true,
                    autoLoad: false
                },
                valueField: 'id',
                displayField: 'question',
                queryMode: 'local',
                forceSelection: true,
                allowBlank: true,
                bind: {
                    value: '{questionnaireGroup.questionnaireParentId}'
                }
            },
                {
                    xtype: 'tagfield',
                    reference: 'questionnaireGroupsCombo',
                    disabled: true,
                    fieldLabel: i18n.groupedQuestions,
                    filterPickList: true,
                    store: {
                        type: 'questionnaireStore',
                        loadMask: true,
                        autoLoad: false
                    },
                    valueField: 'id',
                    displayField: 'question',
                    queryMode: 'local',
                    forceSelection: true,
                    allowBlank: false,
                    bind: {
                        value: '{questionnaireGroup.groupedIds}'
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: i18n.size,
                    minValue: 0,
                    value: 0,
                    disabled: true,
                    bind: {
                        value: '{questionnaireGroup.checkSize}',
                        disabled: '{questionnaireGroup.groupedIds.length<=0}',
                        maxValue: '{questionnaireGroup.groupedIds.length}'
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
        }
    ]


});