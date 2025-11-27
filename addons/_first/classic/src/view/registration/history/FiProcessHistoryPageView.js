Ext.define('first.view.registration.history.FiProcessHistoryPageView', {
    extend: 'Ext.panel.Panel',

    xtype: 'fiProcessHistoryPage',

    requires: [
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.resizer.Splitter',
        'first.view.registration.history.FiProcessHistoryPageController',
        'first.view.registration.history.FiProcessHistoryItemView',
        'first.view.registration.history.FiProcessHistoryItemDetailView'
    ],

    controller: 'fiProcessHistoryPageController',

    layout: 'fit',

    items: [{
        layout: {
            type: 'hbox',
            align: 'stretch'
        },

        defaults: {
            collapsible: true
        },

        items: [{
            flex: 1,
            xtype: 'fiProcessHistoryItem',
            collapsible: true,
            collapseDirection: 'left'
        }, {
            flex: 0,
            xtype: 'splitter',
            collapseTarget: 'prev',
            width: '2px',
            border: '4',
            style: {
                color: 'rgb(236, 236, 236)',
                borderStyle: 'solid'
            }
        }, {
            flex: 3,
            xtype: 'fiProcessHistoryItemDetail',
            collapsible: false
        }]
    }]
});