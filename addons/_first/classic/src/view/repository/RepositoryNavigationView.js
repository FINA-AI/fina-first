/**
 * Created by oto on 5/30/19.
 */
Ext.define('first.view.repository.RepositoryNavigationView', {
    extend: 'Ext.Container',

    xtype: 'repositorynavigation',

    requires: [
        'Ext.container.Container',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Text',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.layout.container.boxOverflow.Menu',
        'Ext.layout.container.boxOverflow.Scroller',
        'Ext.list.Tree',
        'Ext.panel.Panel',
        'Ext.toolbar.Breadcrumb',
        'Ext.toolbar.Separator',
        'first.store.repository.RepositoryBreadcrumbStore',
        'first.store.repository.RepositoryNavigationTree',
        'first.store.repository.RepositorySearchStore',
        'first.store.search.SearchStore',
        'first.util.RepositoryUtil',
        'first.view.repository.RepositorynaNavigationController'
    ],

    controller: 'repositorynanavigation',

    layout: 'fit',

    viewModel: {
        formulas: {
            disableCreateFolderMenu: {
                get: function (get) {
                    let selectedNavigationNode = get('selectedNavigationNode');
                    if (selectedNavigationNode) {
                        if (selectedNavigationNode.get('routeId') === 'personalFiles') {
                            return false;
                        } else if (selectedNavigationNode.get('parentRoute') === 'sites') {
                            return get('isRoot');
                        }
                    }
                    return true;
                }
            },
            disableCreateLibraryMenu: {
                get: function (get) {
                    let selectedNavigationNode = get('selectedNavigationNode');
                    if (selectedNavigationNode) {
                        return selectedNavigationNode.get('parentRoute') !== 'sites' || selectedNavigationNode.get('routeId') === 'favoritesites';
                    }
                    return true;
                }
            }
        }
    },

    items: [
        {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },

            items: [

                {
                    xtype: 'container',

                    itemId: 'navigationPanel',

                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },

                    flex: 1,
                    minWidth: 180,
                    maxWidth: 240,


                    items: [
                        {
                            xtype: 'panel',
                            width: '100%',
                            layout: 'fit',
                            tbar: {
                                overflowHandler: 'menu',
                                items: [{
                                    text: i18n.newButtonTitle,
                                    iconCls: 'x-fa fa-plus',
                                    layout: 'fit',
                                    width: '100%',
                                    menu: {
                                        cls: 'text-align: center;',
                                        showSeparator: true,
                                        flex: 1,
                                        items: [{
                                            text: i18n.uploadFilesTitle,
                                            iconCls: 'x-fa fa-cloud-upload-alt',
                                            handler: 'onMenuUploadFileClick',
                                            bind: {
                                                disabled: '{disableCreateFolderMenu}'
                                            }

                                        }, '-', {
                                            text: i18n.createFolder,
                                            iconCls: 'x-fa fa-folder',
                                            handler: 'onMenuCreateFolderClick',
                                            bind: {
                                                disabled: '{disableCreateFolderMenu}'

                                            }
                                        }, {
                                            text: i18n.createLibrary,
                                            iconCls: 'x-fa fa-folder',
                                            handler: 'onMenuCreateLibraryClick',
                                            bind: {
                                                disabled: '{disableCreateLibraryMenu}'
                                            }
                                        }],
                                        listeners: {
                                            beforerender: function () {
                                                this.setWidth(this.up('button').getWidth());
                                            }
                                        }
                                    }
                                }]
                            }
                        }
                        ,
                        {
                            xtype: 'treelist',
                            flex: 1,
                            reference: 'navigationTreeList',
                            ui: 'navigation',
                            style: {
                                'overflow-y': 'scroll'
                            },
                            store: Ext.create('first.store.repository.RepositoryNavigationTree'),
                            expanderFirst: false,
                            expanderOnly: false,
                            listeners: {
                                selectionchange: 'onNavigationTreeSelectionChange'
                            }
                        }
                    ]
                }, {
                    xtype: 'panel',
                    overflowHandler: 'scroller',
                    reference: 'repositoryContentPanel',
                    tools: [{
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
                            type: 'repositorySearchStore'
                        },
                        listConfig: {
                            itemTpl: [
                                '<div data-qtip="{name}" style="font-size: 16px;font-weight: bold;">{id:this.setIcon} {name}</div>',
                                '<div class="paragraphStyle">Location : {path:this.setLocation}</div>',
                                {
                                    setIcon: function (id) {
                                        let record = this.owner.getStore().findRecord('id', id);
                                        return first.util.RepositoryUtil.getNodeIcon(record, 'fa-x');
                                    },
                                    setLocation: function (path) {
                                        if (path.name) {
                                            if (path.name.lastIndexOf('/') === 0) {
                                                return "Personal Files";
                                            } else if (path.name.indexOf('/documentLibrary') > 0) {
                                                return path.name.replace('/Company Home','').replace('/documentLibrary', '').replace('Sites','Library');
                                            }else {
                                                return path.name.replace('Company Home','Personal Files');
                                            }
                                        }
                                        return 'Personal Files';
                                    }
                                }
                            ]
                        },
                        listeners: {
                            select: 'onSelectSearchItemClick'
                        }
                    }],
                    flex: 1,
                    border: true,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },

                    items: []

                }
            ]

        }
    ]

});