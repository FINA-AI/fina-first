/**
 * Created by oto on 25.05.20.
 */
Ext.define('first.view.repository.version.FileUpdateWindow', {
    extend: 'Ext.window.Window',

    xtype: 'fileupdatewindow',

    requires: [
        'Ext.layout.container.Fit',
        'first.view.repository.version.FileUpdateView',
        'first.view.repository.version.UpdateFileViewController'
    ],

    controller: 'updateFileViewController',


    modal: true,
    width: 520,
    title: i18n.updateFileVersion,
    maximizable: true,
    closable: true,

    bind: {
        title: i18n.updateFileVersion + ' ({fileName})',
    },

    layout: 'fit',

    items: [{
        xtype: 'updatefileview',
        flex: 1
    }],
});