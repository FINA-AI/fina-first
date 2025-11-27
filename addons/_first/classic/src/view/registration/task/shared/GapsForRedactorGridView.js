Ext.define('first.view.registration.task.shared.GapsForRedactorGridView',{
    extend: 'Ext.grid.Panel',

    xtype: 'gapsForRedactorGrid',
    controller: 'gapsForRedactorGrid',
    flex: 1,
    columnLines: true,

    store: {
        type: 'fiGapStore'
    },

    columns: [{
        flex: 0,
        xtype: 'rownumberer'
    }, {
        text: i18n.errorObjectColumnTitle,
        flex: 1,
        dataIndex: 'fina_fiGapObject',
        renderer: 'objectRenderer'
    }, {
        text: i18n.errorReasonColumnTitle,
        flex: 1,
        dataIndex: 'fina_fiGapReason',
        renderer: 'reasonRenderer'
    }, {
        xtype: 'actioncolumn',
        width: 80,
        menuDisabled: true,
        sortable: false,
        items: [{
            iconCls: 'x-fa fa-check green icon-margin',
            handler: 'onCorrected',
            isDisabled: 'isDisabled'
        }, {
            iconCls: 'x-fa fa-ban red icon-margin',
            handler: 'onNotCorrected',
            isDisabled: 'isDisabled'
        }, {
            iconCls: 'x-fa fa-eraser',
            handler: 'onErase',
            isDisabled: 'isDisabled'
        }]
    }],


    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    bind: {
        hidden: '{isGridHidden}'
    }
});
