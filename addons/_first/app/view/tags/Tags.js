/**
 * Created by nikoloz on 2019-06-28.
 */
Ext.define('first.view.tags.Tags', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.selection.CellModel',
        'first.store.Tag',
        'first.view.tags.TagsController',
        'first.view.tags.TagsModel'
    ],

    xtype: 'tags',

    viewModel: {
        type: 'tags'
    },

    controller: 'tags',

    title: i18n.menuTags,

    store: {
        type: 'tags',
    },

    loadMask: true,

    selModel: {
        type: 'cellmodel'
    },

    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },

    listeners: {
        edit: 'onEdit'
    },

    tbar: [{
        text: i18n.addTag,
        iconCls: 'x-fa fa-tag',
        handler: 'onAddClick'
    }, {
        iconCls: 'x-fa fa-sync',
        text: i18n.refresh,
        handler: 'onRefreshClick'
    }],

    columns: [{
        header: i18n.tagName,
        dataIndex: 'name',

        flex: 1,
        editor: {
            allowBlank: false
        }
    }, {
        xtype: 'actioncolumn',

        width: 30,
        sortable: false,
        menuDisabled: true,
        resizable: false,
        items: [{
            iconCls: 'cell-editing-delete-row',
            tooltip: 'Delete Tag',
            handler: 'onRemoveClick'
        }]
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }
});