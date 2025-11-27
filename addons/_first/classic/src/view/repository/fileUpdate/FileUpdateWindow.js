Ext.define('first.view.repository.fileUpdate.FileUpdateWindow', {
    extend: 'Ext.window.Window',

    xtype: 'fileUpdateWindow',

    requires: [
        'Ext.layout.container.Fit',
        'first.view.repository.fileUpdate.FileUpdateController',
        'first.view.repository.fileUpdate.FileUpdateView'
    ],

    controller: 'fileUpdateController',

    viewModel: {},

    modal: true,
    width: 600,
    height: 400,
    title: i18n.updateFile,
    scrollable: true,
    constrain: true,
    maximizable: true,
    closable: true,
    layout: 'fit',

    items: [{
        xtype: 'fileUpdate'
    }]

});