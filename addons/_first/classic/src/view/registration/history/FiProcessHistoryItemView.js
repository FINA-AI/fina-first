Ext.define('first.view.registration.history.FiProcessHistoryItemView', {
    extend: 'Ext.grid.Panel',

    xtype: 'fiProcessHistoryItem',

    requires: [
        'first.view.registration.history.FiProcessHistoryItemController',
        'first.store.registration.FiProcessHistoryItemStore'
    ],

    controller: 'fiProcessHistoryItemController',

    layout: 'fit',

    title: i18n.processHistoryItem,
    
    columnLines: true,

    bind: {
        selection: '{selectedFiProcessHistoryItem}'
    },

    store: {
        type: 'fiProcessHistoryItemStore'
    },

    columns: {
        defaults: {
            align: 'left',
            flex: 1
        },
        items: [{
            text: i18n.processHistoryItemColumn,
            dataIndex: 'name',
            sortable: false,
            renderer: function (value) {
                return i18n[value] || value;
            }
        }]
    },

    listeners: {
        select: 'onSelectFiProcessHistoryItem'
    }

});