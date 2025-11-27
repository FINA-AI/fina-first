/**
 * Created by oto on 6/6/19.
 */
Ext.define('first.view.repository.common.CommonGridView', {
    extend: 'first.view.repository.personalFiles.PersonalFilesGridView',

    xtype: 'commongrid',

    requires: [
        'Ext.data.TreeModel',
        'Ext.grid.column.Action',
        'Ext.layout.container.HBox',
        'Ext.menu.Menu',
        'Ext.menu.Separator',
        'Ext.toolbar.Breadcrumb',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Spacer',
        'Ext.util.Format',
        'first.store.repository.common.CommonStore',
        'first.view.repository.common.CommonController'
    ],


    controller: 'common',

    viewModel: {},

    loadMask: true,
    columnLines: true,
    multiSelect: true,

    store: {
        type: 'commonFilesStore'
    },

    bind: {
        selection: '{selectedDocument}'
    },

    tbar: {
        cls: 'firstFiRegistryTbar',
        minHeight: 30,
        items: [{
            bind: {
                visible: '{enableBreadcrumb}'
            },
            flex: 1,
            xtype: 'breadcrumb',
            reference: 'commonbreadcrumb',
            showIcons: true,
            store: Ext.create('first.store.repository.RepositoryBreadcrumbStore', {
                root: {
                    text: '', expanded: true,
                    expanded: true,
                    children: []
                }
            }),
            listeners: {
                selectionchange: 'onBreadCrumbNavigationClick'
            }
        }, '->',
            {
                iconCls: 'x-fa fa-history',
                hidden: true,
                handler: 'onRecoverButtonClick',
                bind: {
                    hidden: '{isSelectedRow || enableBreadcrumb}'
                }
            }, {
                iconCls: 'x-fa fa-times',
                hidden: true,
                handler: 'onPurgeButtonClick',
                bind: {
                    hidden: '{isSelectedRow || enableBreadcrumb}'
                }
            }, {
                iconCls: 'x-fa fa-cloud-download-alt',
                hidden: true,
                bind: {
                    hidden: '{isSelectedRow || !enableBreadcrumb}'
                }
            },
            {
                xtype: 'tbseparator',
                hidden: true,
                bind: {
                    hidden: '{isSelectedRow || !enableBreadcrumb}'
                }
            },
            {
                iconCls: 'x-fa fa-info',
                enableToggle: true,
                toggleHandler: 'onInfoItemToggle',
                hidden: true,
                bind: {
                    hidden: '{isSelectedRow || !enableBreadcrumb}'
                }
            }]
    },

    columns: {
        defaults: {
            align: 'left'
        },
        items: [{
            width: 50,
            dataIndex: 'content',
            renderer: function (content, cell, record) {
                return first.util.RepositoryUtil.getNodeIcon(record, 'fa-x');
            }
        }, {
            flex: 3,
            text: i18n.repositoryColumnName,
            dataIndex: 'name',
            renderer: function (value, cell, record) {
                cell.tdCls = 'underlineTextDec';
                if (record.get('file') && record.get('properties')['cm:versionLabel']) {
                    return '<text style="cursor:pointer">' + value + '</text>' +
                        ' <span style="border-radius: 2px; background-color: rgba(0,0,0,0.30); padding: 2px; color: #FFFFFF">'
                        + record.get('properties')['cm:versionLabel'] + '</span>';
                }
                return '<text style="cursor:pointer;">' + value + '</text>';
            },
        }, {
            text: i18n.size,
            dataIndex: 'size',
            renderer: function (value, cell, record) {
                if (value) {
                    return Ext.util.Format.fileSize(value)
                }
                return '';
            }
        }, {
            text: i18n.repositoryColumnLocation,
            flex: 1,
            dataIndex: 'location',
            renderer: function (value, cell, record) {
                if (value) {
                    return value.lastIndexOf('/') === 0 ? "Personal Files" : value.substring(value.lastIndexOf('/') + 1, value.length);
                }
                return '';
            }
        }, {
            flex: 1,
            text: i18n.repositoryColumnModifiedAt,
            dataIndex: 'modifiedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            text: i18n.repositoryColumnModifiedBy,
            dataIndex: 'modifiedByUserDescription',
            renderer: function(val) {
                return first.view.registration.MetadataUtil.removeNonameFromName(val);
            },
            flex: 1
        }, {
            bind: {
                hidden: '{!enableBreadcrumb}'
            },
            menuDisabled: true,
            sortable: false,
            hideable: false,
            xtype: 'actioncolumn',
            resizable: false,
            items: [{
                iconCls: 'x-fa fa-cloud-download-alt',
                tooltip: i18n.do,
                handler: 'onDownloadCtionButtonClick'
            }, ' ', {
                iconCls: 'x-fa fa-eye',
                tooltip: 'View',
                handler: 'onPreviewActionButtonClick',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('file') || !record.get('content');
                }
            }]
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        itemcontextmenu: 'showContextMenu',
        cellclick: 'onCellClick',
        selectionchange: 'onSelectionChange',

    }
});
