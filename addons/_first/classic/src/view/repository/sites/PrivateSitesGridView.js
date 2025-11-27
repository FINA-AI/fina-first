/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.view.repository.sites.PrivateSitesGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'personalsitesgrid',

    requires: [
        'Ext.data.TreeModel',
        'Ext.grid.column.Action',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Breadcrumb',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.util.Format',
        'first.config.Config',
        'first.store.repository.RepositoryBreadcrumbStore',
        'first.store.repository.sites.SitesStore',
        'first.view.repository.sites.PrivateSitesController'
    ],

    controller: 'sites',

    viewModel: {
        formulas: {
            isRootLibrary: {
                get: function (get) {
                    return get('isRoot');
                }
            },
            isUserNodeOwner: {
                get: function (get) {
                    let doc = get('selectedDocument');
                    return doc && doc.data.createdBy['id'] === first.config.Config.conf.properties.currentUser.id;
                }
            },
            isUserAdministrator: {
                get: function (get) {
                    return first.config.Config.conf.properties.currentUser.capabilities.admin;
                }
            }
        }
    },


    loadMask: true,

    columnLines: true,

    store: {
        type: 'sites'
    },

    bind: {
        selection: '{selectedDocument}'
    },

    getBreadcrumb: function () {
        return this.lookupReference('sitesbreadcrumb');
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
            reference: 'sitesbreadcrumb',
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
        }, '->']
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
            dataIndex: 'description',
            renderer: function (value, cell, record) {
                cell.tdCls = 'underlineTextDec';
                value = record.get('site') ? record.get('site')['id'] : record.get('name');
                return '<text style="cursor: pointer;r:pointer;">' + value + '</text>';
            }
        }, {
            text: i18n.columnMyRoleName,
            dataIndex: 'role',
            bind: {
                hidden: '{!isRoot}'
            },
            renderer: function (value, cell, record) {
                return record.get('site') ? record.get('site')['role'] : '';
            }

        }, {
            text: i18n.columnVisibility,
            dataIndex: 'visibility',
            bind: {
                hidden: '{!isRoot}'
            },
            renderer: function (value, cell, record) {
                if (record.get('site')) {
                    return record.get('site')['visibility']
                }
                return '';
            }

        }, {
            text: 'size',
            dataIndex: 'size',
            bind: {
                hidden: '{isRoot}'
            },
            renderer: function (value, cell, record) {
                if (value) {
                    return Ext.util.Format.fileSize(value);
                }
                return '';
            }
        }, {
            flex: 1,
            text: 'Modified',
            dataIndex: 'modifiedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat),
            bind: {
                hidden: '{isRoot}'
            }
        }, {
            flex: 1,
            text: 'Modified By',
            dataIndex: 'modifiedByUserDescription',
            bind: {
                hidden: '{isRoot}'
            }

        }, {
            menuDisabled: true,
            sortable: false,
            resizable: false,
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-cloud-download-alt',
                tooltip: i18n.download,
                handler: 'onDownloadCtionButtonClick'
            }, '', {
                iconCls: 'x-fa fa-eye',
                tooltip: i18n.view,
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
        drop: {
            element: 'el',
            fn: 'drop'
        },

        dragstart: {
            element: 'el',
            fn: 'addDropZone'
        },

        dragenter: {
            element: 'el',
            fn: 'addDropZone'
        },

        dragover: {
            element: 'el',
            fn: 'addDropZone'
        },

        dragleave: {
            element: 'el',
            fn: 'removeDropZone'
        },

        dragexit: {
            element: 'el',
            fn: 'removeDropZone'
        }
    }
});
