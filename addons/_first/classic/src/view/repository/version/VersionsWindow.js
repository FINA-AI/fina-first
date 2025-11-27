/**
 * Created by oto on 25.05.20.
 */
Ext.define('first.view.repository.version.VersionsWindow', {
    extend: 'Ext.window.Window',

    xtype: 'versionsWindow',

    requires: [
        'Ext.layout.container.Card',
        'Ext.layout.container.Fit',
        'first.view.repository.fileUpdate.FileUpdateView',
        'first.view.repository.version.VersionGridView',
        'first.view.repository.version.VersionsViewController'
    ],

    controller: 'versions',

    modal: true,

    width: 600,
    height: 400,
    scrollable: true,
    constrain: true,
    maximizable: true,
    closable: true,

    title: i18n.manageVersions,


    layout: 'card',

    viewModel: {},

    items: [
        {
            id: 'card-0',
            reference: 'versiongridView',
            xtype: 'versiongrid'
        },
        {
            id: 'card-1',
            layout: 'fit',
            items: [
                {
                    reference: 'updatefileview',
                    xtype: 'updatefileview',
                }
            ]
        }
    ]
});