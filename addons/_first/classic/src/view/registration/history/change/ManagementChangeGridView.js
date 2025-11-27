Ext.define('first.view.registration.history.change.ManagementChangeGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'managementChangeGridView',

    requires: [
        'first.view.registration.history.change.ManagementChangeGridController'
    ],

    controller: 'managementChangeGridController',

    layout: {
        type: 'fit'
    },

    columnLines: true,

    store: {
        type: 'generalChanges'
    },

    columns: [{
        flex: 0,
        xtype: 'rownumberer'
    }, {
        xtype: 'actioncolumn',
        flex: 1,
        items: [{
            iconCls: 'x-fa fa-eye icon-margin',
            tooltip: "Edit",
            handler: 'onViewClick'
        }]
    }, {
        text: i18n.changeObject,
        flex: 1,
        dataIndex: 'fina_fiGapObject',
        renderer: function (content, cell, record) {
            switch (record.get('fina_fiManagementChangeType')) {
                case 'fiAuthorizedPerson':
                    return i18n[record.get('fina_fiManagementChangeObject')];
                case 'fiBeneficiary':
                    return i18n[record.get('fina_fiManagementChangeObject').toLowerCase()];
            }
            return '';
        }
    }, {
        text: i18n.changeType,
        flex: 1,
        dataIndex: 'fina_fiGapReason',
        renderer: function (content, cell, record) {
            return i18n[record.get('fina_fiManagementChangeStatus')];
        }
    }, {
        text: i18n.changeName,
        flex: 1,
        dataIndex: 'fina_fiGapReason',
        renderer: function (content, cell, record) {
            return record.get('fina_fiManagementChangeName');
        }
    }],


    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        afterrender: 'afterRender'
    }

});