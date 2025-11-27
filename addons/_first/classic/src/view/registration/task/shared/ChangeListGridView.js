Ext.define('first.view.registration.task.shared.ChangeListGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'changeListGrid',

    requires: [
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'first.store.change.ChangesStore',
        'first.view.registration.task.shared.ChangeListGridController'
    ],
    controller: 'changeListGrid',
    flex: 1,
    title: i18n.changesGridTitle,
    reference: 'changesGrid',
    store: {
        type: 'generalChanges'
    },
    style: {
        margin: '10px',
        border: '1px solid lightgrey'
    },
    columnLines: true,

    tools: [{
        iconCls: 'x-fa fa-sync',
        tooltip: i18n.refresh,
        handler: 'onRefreshClick'
    }],

    columns: [
        {
            xtype: 'rownumberer',
            flex: 0
        },
        {
            xtype: 'actioncolumn',
            flex: 0,
            width: 45,
            align: 'center',
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            items: [{
                iconCls: 'x-fa fa-eye',
                handler: 'onViewClick'
            }]
        },
        {
            header: i18n.changeObject,
            dataIndex: 'fina_fiManagementChangeObject',
            flex: 1,
            renderer: function (content, cell, record) {
                switch (record.get('fina_fiManagementChangeType')) {
                    case 'fiAuthorizedPerson':
                        return i18n[record.get('fina_fiManagementChangeObject')];
                    case 'fiBeneficiary':
                        return i18n[record.get('fina_fiManagementChangeObject').toLowerCase()];
                }
                return '';
            }
        },
        {
            header: i18n.changeType,
            dataIndex: 'fina_fiManagementChangeType',
            flex: 1,
            renderer: function (content, cell, record) {
                return i18n[record.get('fina_fiManagementChangeStatus')];
            }
        },
        {
            header: i18n.changeName,
            dataIndex: 'fina_fiManagementChangeName',
            flex: 1
        },
        {
            header: i18n.isInSanctionedPeopleChecklist,
            dataIndex: 'fina_fiManagementChangeObjectIsSanctioned',
            flex: 1,
            renderer: function (v, meta, record) {
                if (record.get('fina_fiManagementChangeStatus') !== 'ADDED') {
                    return '';
                }
                return v ? i18n.yes : i18n.no;
            }
        },
        {
            header: i18n.dateChecked,
            dataIndex: 'fina_fiManagementChangeObjectSanctionedCheckDate',
            flex: 1,
            renderer: function(v, meta, record) {
                if (v) {
                    let date = new Date(v);
                    let formattedDate = Ext.Date.format(date, first.config.Config.dateFormat);
                    return formattedDate
                }
                return '';
            }
        }
    ],

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }
});
