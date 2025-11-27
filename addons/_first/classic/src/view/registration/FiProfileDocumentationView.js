Ext.define('first.view.registration.FiProfileDocumentationView', {
    extend: 'Ext.grid.Panel',
    xtype: 'fiProfileDocumentationEcm',

    requires: [
        'Ext.grid.column.Action',
        'Ext.grid.column.Date',
        'Ext.grid.column.RowNumberer',
        'Ext.toolbar.Breadcrumb',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.util.Format',
        'first.store.registration.FiRegistrationDocumentationStore',
        'first.store.repository.RepositoryBreadcrumbStore',
        'first.view.registration.FiProfileDocumentationController'
    ],

    store: {
        type: 'registrationDocumentationStoreEcm'
    },

    viewConfig: {
        loadMask: true
    },

    controller: 'documentationControllerEcm',

    border: false,

    columnLines: true,
    header: false,

    emptyText: i18n.fiDocumentEmptyText,

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            text: i18n.fiDocumentCreateFolder,
            iconCls: 'x-fa fa-folder',
            cls: 'finaSecondaryBtn',
            handler: 'onCreateFolderClick',
            bind: {
                hidden: '{!editMode}'
            }
        }, {
            text: i18n.fiDocumentUploadDocument,
            iconCls: 'x-fa fa-cloud-upload-alt',
            cls: 'finaPrimaryBtn',
            handler: 'onUploadFileClick',
            bind: {
                hidden: '{!editMode}'
            }
        }, {
            xtype: 'tbseparator',
            bind: {
                hidden: '{!editMode}'
            }
        }, {
            xtype: 'breadcrumb',
            showMenuIcons: true,
            showIcons: false,
            reference: 'documentationBreadcrumb',
            store: {
                type: 'repositoryBreadcrumbStore',
                root: {
                    text: i18n['Documents'],
                    expanded: true,
                    children: []
                }
            },
            listeners: {
                selectionchange: 'reloadDocumentationGrid'
            }
        }, '->',
            {
                xtype: 'combobox',
                width: '35%',
                fieldStyle: 'font-family: FontAwesome',
                hideTrigger: true,
                emptyText: i18n.Search,
                idField: 'id',
                displayField: 'name',
                minChars: 2,
                pageSize: 15,
                enablePaging: true,
                store: {
                    model: 'first.model.search.SearchModel',
                    autoLoad: false,
                    proxy: {
                        type: 'rest',
                        url: first.config.Config.remoteRestUrl + "ecm/search/personalFiles",
                        headers: {
                            'Accept-Language': '*'
                        },
                        reader: {
                            type: 'json',
                            rootProperty: 'list',
                            totalProperty: 'totalResults'
                        }
                    }
                },
                listConfig: {
                    itemTpl: [
                        '<div data-qtip="{id:this.setName}" style="font-size: 16px;font-weight: bold;">{id:this.setIcon} {id:this.setName}</div>',
                        '<div class="paragraphStyle">Location : {path:this.setLocation}</div>',
                        {
                            setIcon: function (id) {
                                let record = this.owner.getStore().findRecord('id', id);
                                return first.util.RepositoryUtil.getNodeIcon(record, 'fa-x');
                            },
                            setLocation: function (path) {

                                if (path.name) {
                                    return path.name.substring(path.name.lastIndexOf("/"), path.name.length);
                                }
                                return 'Documents';
                            },
                            setName: function (id) {
                                let record = this.owner.getStore().findRecord('id', id);
                                return this.getFormattedName(record);
                            },

                            getFormattedName:function (record){
                                let value = record.get('name');
                                let displayName = record.get('properties')['fina:fiDocumentDisplayName'];
                                if (displayName) {
                                    value = displayName;
                                } else {
                                    value = (i18n[value] || value);
                                }
                                console.log(value)
                                return value;
                            }
                        }
                    ]
                },
                listeners: {
                    select: 'onSelectSearchItemClick',
                    afterrender: 'afterSearchComboRender'
                }
            }]
    },

    columns: {
        defaults: {
            flex: 1
        },
        items: [{
            flex: 0,
            xtype: 'rownumberer'
        }, {
            xtype: 'actioncolumn',
            flex: 0,
            align: 'center',
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            items: [{
                iconCls: 'x-fa fa-edit icon-margin',
                tooltip: i18n.fiDocumentEditTip,
                handler: 'onEditDocumentClick',
                getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                    if (!view.grid.getViewModel().get('editMode') || (!record.get('fina_fiDocumentType')
                        || (record.get('fina_fiDocumentType') && record.get('fina_fiDocumentType') === 'DOCUMENT'))) {
                        return 'first-action-icon-hidden'
                    }
                    return 'x-fa fa-edit icon-margin';
                }
            }, {
                iconCls: 'x-fa fa-eye icon-margin',
                tooltip: i18n.fiDocumentGoToProcessTip,
                handler: 'onGoToProcessClick',
                getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                    if (record.get('folder') || !record.get('fina_fiDocumentType') || record.get('fina_fiDocumentType') === ''
                        || view.grid.getViewModel().get('isGoToProcessDisabled')) {
                        return 'first-action-icon-hidden';
                    }
                    return 'x-fa fa-eye icon-margin';
                }
            }, {
                iconCls: 'x-fa fa-cloud-download-alt',
                tooltip: i18n.fiDocumentDownloadTip,
                handler: 'onDownloadClick'
            }]
        }, {
            text: i18n.fiDocumentName,
            dataIndex: 'name',
            flex: 2,
            renderer: 'nameColumnRenderer'
        }, {
            xtype: 'datecolumn',
            text: i18n.documentDate,
            dataIndex: 'documentDate',
            format: first.config.Config.dateFormat
        }, {
            text: i18n.documentNumber,
            dataIndex: 'documentNumber'
        }, {
            text: i18n.fiDocumentType,
            dataIndex: 'fina_fiDocumentType',
            hidden: true,
            renderer: function (value) {
                return i18n[value] || value || i18n['DOCUMENT'];
            }
        }, {
            text: i18n.fiDocumentAuthor,
            dataIndex: 'author'
        }, {
            text: i18n.reportCardCreatedAt,
            dataIndex: 'creationDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            text: i18n.reportCardModifiedAt,
            dataIndex: 'modifiedDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            xtype: 'actioncolumn',
            align: 'center',
            flex: 0,
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            items: [{
                iconCls: 'x-fa fa-minus-circle removeButtonStyle',
                tooltip: i18n.fiDocumentDeleteTip,
                handler: 'onDeleteDocumentClick',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !view.grid.getViewModel().get('editMode')
                }
            }]
        }]
    },

    listeners: {
        cellclick: 'onCellClick',
        afterrender: 'onDocumentationViewRender'
    },

    bbar: {
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        displayInfo: true,
        items: ['->'],
        prependButtons: true
    }

});
