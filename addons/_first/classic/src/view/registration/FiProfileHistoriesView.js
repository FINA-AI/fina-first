Ext.define('first.view.registration.FiProfileHistoriesView', {
    extend: 'Ext.window.Window',

    xtype: 'fiProfileHistoriesEcm',

    requires: [
        'Ext.layout.container.Fit',
        'first.view.registration.FiProfileHistoriesController'
    ],

    controller: 'fiProfileHistoriesEcm',

    scrollable: true,

    maximizable: true,

    height: Ext.getBody().getViewSize().height - 120,
    width: Ext.getBody().getViewSize().width - 120,

    title: i18n.changeHistory,

    modal: true,

    layout: {
        type: 'fit',
    },

    items: []

});