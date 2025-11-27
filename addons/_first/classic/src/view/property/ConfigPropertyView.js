Ext.define('first.view.property.PropertyView', {
    extend: 'Ext.grid.Panel',

    xtype: 'configPropertyView',

    requires: [
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
    ],

    controller: 'configPropertyController',

    loadMask: true,

    columnLines: true,

    store: {
        type: 'configPropertyStore'
    },

    bind: {
        selection: '{selectedProperty}'
    },

    viewModel: {},

    plugins: [{
        ptype: 'rowediting',
        clicksToMoveEditor: 1,
        autoCancel: false,
        saveBtnText:i18n.save,
        cancelBtnText:i18n.cancel,
        listeners: {
            edit: 'onEditClick',
        }
    }],

    tbar: {
        cls:'firstFiRegistryTbar',
        items: [{
            text: i18n.add,
            cls: 'finaPrimaryBtn',
            iconCls: 'x-fa fa-plus-circle',
            handler: 'onAddClick'
        }, {
            text: i18n.delete,
            cls: 'finaSecondaryBtn',
            iconCls: 'x-fa fa-minus-circle',
            handler: 'onDeleteClick',
            disabled: true,
            bind: {
                disabled: '{!selectedProperty}'
            }
        }, {
            text: i18n.refreshConfigCache,
            cls: 'finaSecondaryBtn',
            iconCls: 'x-fa fa-sync',
            handler: 'onRefreshCacheCLick'
        }],
        bind: {
            hidden: '{!hasConfigAmendPermission}'
        }
    },

    columns: {
        defaults: {
            align: 'left',
            flex: 1
        },
        items: [{
            flex: 0,
            xtype: 'rownumberer'
        }, {
            text: i18n.key,
            dataIndex: 'name',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
            text: i18n.value,
            flex: 3,
            dataIndex: 'fina_propertyValue',
            editor: {
                allowBlank: false
            }
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }
});
