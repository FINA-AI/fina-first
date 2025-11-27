Ext.define('first.view.repository.permission.PermissionGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'permissionGrid',

    columnLines: true,
    layout: 'fit',

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [
            {
                xtype: 'button',
                text: i18n.add,
                iconCls: 'x-fa fa-plus',
                handler: 'onAddButtonClick'
            }, '|', {
                xtype: 'button',
                text: i18n.save,
                iconCls: 'x-fa fa-save',
                handler: 'onSavePermissionsClick'
            },  '|', {
                xtype: 'button',
                bind: {
                    text: '{permissionDisableEnableBtnText}',
                    iconCls: '{permissionDisableEnableBtnIcon}'
                },
                handler: 'onDisableEnableInheritance'
            }
        ]
    },

    viewConfig: {
        stripeRows: true,
        enableTextSelection: false,
        markDirty: true
    },

    trackMouseOver: false,
    disableSelection: true,

    store: {
        model: 'first.model.permission.PermissionModel'
    },

    columns: {
        defaults: {
            align: 'left'
        },
        items: [{
            header: i18n.authorityId,
            dataIndex: 'authorityId',
            bind: '{record.authorityId}',
            flex: 1
        }, {
            xtype: 'widgetcolumn',
            header: i18n.role,
            dataIndex: 'name',
            flex: 1,
            widget: {
                xtype: 'combo',
                bind: {
                    value: '{record.name}',
                    disabled: '{record.type==="INHERITED"}'
                },
                store: ["Contributor", "Collaborator", "Coordinator", "Editor", "Consumer"]
            }
        }, {
            header: i18n.type,
            dataIndex: 'type',
            flex: 1,
            renderer: function (content, cell, record) {
                switch (record.get('type')) {
                    case 'INHERITED':
                        cell.style = 'background-color:#0055b8;';
                        return content;
                    case 'LOCALLY':
                        cell.style = 'background-color:#00754a;';
                        return content;
                }

                return content;
            }
        }, {
            menuDisabled: true,
            sortable: false,
            resizable: false,
            xtype: 'actioncolumn',
            width: 30,
            items: [{
                iconCls: 'x-fa fa-minus-circle removeButtonStyle',
                handler: 'onRemoveClick',
                tooltip: i18n.delete,
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('type') === "INHERITED";
                },
                getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                    return record.get('type') === "INHERITED" ?
                        'x-hide-display' :
                        "x-fa fa-minus-circle removeButtonStyle";
                }
            }]
        }]
    },


});
