Ext.define('first.view.registration.reassign.ChangeInspectorView', {
    extend: 'first.view.registration.reassign.ReassignTaskView',

    xtype: 'changeInspector',

    requires: [
        'first.store.registration.GroupUsersStore',
        'first.view.registration.reassign.ChangeInspectorController'
    ],

    controller: 'changeInspector',

    title: i18n.changeControllerWindowTitle,
    modal: true,

    items: [{
        xtype: 'form',
        layout: 'center',
        items: [
            {
                xtype: 'combobox',
                reference: 'userCombo',
                fieldLabel: i18n.changeControllerWindowChooseNewController,
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
                    type: 'groupUsersStore'
                }
            }
        ]
    }]

});