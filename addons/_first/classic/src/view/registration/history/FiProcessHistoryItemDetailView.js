Ext.define('first.view.registration.history.FiProcessHistoryItemDetailView', {
    extend: 'Ext.panel.Panel',

    xtype: 'fiProcessHistoryItemDetail',

    requires: [
        'first.view.registration.history.FiProcessHistoryItemDetailController'
    ],

    controller: 'fiProcessHistoryItemDetailController',

    title: i18n.processHistoryItemDetails,

    bind: {
        title: '{title}'
    },

    layout: 'fit',

    items: [{
        margin: 5,
        html: i18n.processHistoryItemDetailEmpty
    }]
});