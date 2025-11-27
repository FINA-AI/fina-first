/**
 * Created by meryc on 12.05.2020.
 */
Ext.define('first.view.registration.reassign.ReassignTaskView', {
    extend: 'Ext.window.Window',

    xtype: 'reassignTask',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.layout.container.Center',
        'Ext.layout.container.VBox',
        'first.store.registration.EditorUsersStore',
        'first.view.registration.reassign.ReassignTaskController'
    ],

    controller: 'reassignTask',

    title: i18n.changeTaskAssignee,
    width: 350,
    height: 180,

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },

    items: [{
        xtype: 'form',
        layout: 'center',
        items: [
            {
                xtype: 'combobox',
                fieldLabel: i18n.chooseNewAssignee,
                labelAlign: 'top',
                width: '80%',
                align: 'center',
                valueField: 'id',
                displayField: 'displayName',
                typeAhead: true,
                minChars: 2,
                anyMatch: true,
                queryMode: 'local',
                bind: {
                    selection: '{selectedUser}'
                },
                store: {
                    type: 'editorUsersStore'
                }
            }
        ]
    }],

    buttons: [{
        text: i18n.cancel,
        iconCls: 'x-fa fa-times',
        handler: 'onCancelButtonClick',
        cls: 'finaSecondaryBtn'
    }, {
        text: i18n.proceed,
        iconCls: 'x-fa fa-save',
        reference: 'submitButton',
        handler: 'onProceedButtonClick',
        cls: 'finaPrimaryBtn',
        bind: {
            disabled: '{!selectedUser}'
        }
    }]

});