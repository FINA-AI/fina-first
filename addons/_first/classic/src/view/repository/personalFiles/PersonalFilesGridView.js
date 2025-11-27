Ext.define('first.view.repository.personalFiles.PersonalFilesGridView', {
        extend: 'Ext.grid.Panel',

        xtype: 'personalFiles',

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
            'first.store.repository.RepositoryBreadcrumbStore',
            'first.store.repository.personalFiles.PersonalFilesStore',
            'first.view.repository.PersonalFilesContextMenuController',
            'first.view.repository.personalFiles.PersonalFilesViewController',
            'first.view.repository.personalFiles.PersonalFilesViewModel'
        ],

        controller: 'personalFiles',

        viewModel: {
            type: 'personalFilesViewModel'
        },


        loadMask: true,

        columnLines: true,
        multiSelect: true,
        store: {
            type: 'personalFilesStore',
            autoLoad: false
        },

        bind: {
            selection: '{selectedDocument}'
        },

        allowDeselect: false,

        viewConfig: {
            emptyText: '<div height="300px"width="100%" class="drag-file-label" style="align-content: center;text-align: center;vertical-align: center">' +
                '<i class="fa fa-cloud-upload-alt" aria-hidden="true"></i>' +
                '  ' + i18n.dragAndDRopText +
                '</div>' +
                '<div class="drag-file-icon"></div>',
            deferEmptyText: false
        },

    getBreadcrumb: function () {
        return this.lookupReference('repositorybreadcrumb');
    },

        tbar: {
            cls: 'firstFiRegistryTbar',
            items: [{
                xtype: 'breadcrumb',
                reference: 'repositorybreadcrumb',
                cls: 'bradCrumbCls',
                showIcons: true,
                store: {
                    type: 'repositoryBreadcrumbStore'
                },
                listeners: {
                    selectionchange: 'onBreadCrumbNavigationClick'
                }
            }, '->',
                {
                    iconCls: 'x-fa fa-cloud-download-alt',
                    hidden: true,
                    tooltip: i18n.download,
                    handler: 'onDownloadCtionButtonClick',
                    bind: {
                        hidden: '{isSelectedRow}'
                    }
                },
                {
                    xtype: 'tbseparator',
                    hidden: true,
                    bind: {
                        hidden: '{isSelectedRow}'
                    }
                },
                {
                    iconCls: 'x-fa fa-info',
                    reference: 'infoTogleButton',
                    tooltip: i18n.properties,
                    enableToggle: true,
                    toggleHandler: 'onInfoItemToggle',
                    hidden: true,
                    bind: {
                        hidden: '{isSelectedRow}'
                    }
                }, {
                    iconCls: 'x-fa fa-ellipsis-v',
                    hidden: true,
                    bind: {
                        hidden: '{isSelectedRow}'
                    },
                    arrowCls: '',
                    menu: {
                        controller: 'personalFilesContextmenu',
                        items: [{
                            text: i18n.addTofavorites,
                            handler: 'onFavoritesMenuClick',
                            iconCls: 'x-fa fa-star'
                        }, {
                            text: i18n.edit,
                            handler: "onEditMenuClick",
                            iconCls: 'x-fa fa-edit',
                            bind: {
                                disabled: '{isMultipleRowSelected}'
                            }
                        }, {
                            xtype: 'menuseparator'
                        }, {
                            text: i18n.copy,
                            handler: 'onCopyMenuClick',
                            iconCls: 'x-fa fa-copy'
                        }, {
                            text: i18n.move,
                            handler: 'onMoveMenuClick',
                            iconCls: 'x-fa fa-arrows-alt'
                        }, {
                            text: i18n.delete,
                            handler: 'onDeleteMenuClick',
                            iconCls: 'x-fa fa-times'
                        }, {
                            xtype: 'menuseparator'
                        }, {
                            text: i18n.permissions,
                            handler: 'onPermissionsMenuClick',
                            iconCls: 'x-fa fa-list',
                            bind: {
                                hidden: '{!isUserAdministrator}'
                            }
                        }]
                    }
                }]
        }

        ,

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
            containercontextmenu: 'showContainerContextMenu',
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

    }
);
