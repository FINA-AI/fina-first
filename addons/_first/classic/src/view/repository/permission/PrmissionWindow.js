Ext.define('first.view.repository.permission.PermissionWindow', {
    extend: 'Ext.window.Window',

    xtype: 'permissionWindow',

    requires: [
        'Ext.layout.container.Fit',
        'first.view.repository.permission.PermissionGridView',
        'first.view.repository.permission.PermissionController'
    ],

    controller: 'permissionController',

    modal: true,

    width: 600,
    height: 400,
    scrollable: true,
    constrain: true,
    maximizable: true,
    closable: true,

    title: i18n.permissions,


    layout: 'card',

    viewModel: {},

    items: [
        {
            id: 'card-0',
            reference: 'permissionGrid',
            xtype: 'permissionGrid'
        },
        {
            id: 'card-1',
            layout: 'fit',
            items: [
                {
                    reference: 'userAndGroupGrid',
                    xtype: 'userAndGroup',
                }
            ],
            buttons: [
                {
                    text: i18n.close,
                    iconCls: 'x-fa fa-times',
                    handler: 'onCloseClick'
                }, {
                    text: i18n.save,
                    iconCls: 'x-fa fa-save',
                    handler: 'onAddUsersClick'
                }
            ]
        }
    ]

});