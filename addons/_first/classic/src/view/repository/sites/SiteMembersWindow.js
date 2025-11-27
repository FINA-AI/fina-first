/**
 * Created by oto on 27.04.20.
 */
Ext.define('first.view.repository.sites.SiteMembersWindow', {
    extend: 'Ext.window.Window',

    xtype: 'siteMembersWindow',

    requires: [
        'Ext.layout.container.Card',
        'Ext.layout.container.Fit',
        'first.view.repository.permission.UserAndGroupGridView',
        'first.view.repository.sites.SiteMembersController',
        'first.view.repository.sites.SiteMembersGridView'
    ],

    controller: 'sitemembersController',

    modal: true,

    width: 600,
    height: 400,
    scrollable: true,
    constrain: true,
    maximizable: true,
    closable: true,

    title: i18n.siteMembersWindowTitle,

    viewModel: {},

    layout: 'card',

    items: [
        {
            id: 'card-0',
            reference: 'siteMembersGrid',
            xtype: 'siteMembersGrid'
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
                    text: 'Ok',
                    iconCls: 'x-fa fa-save',
                    handler: 'onAddMembersClick'
                }
            ]
        }
    ]
});