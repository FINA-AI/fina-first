/**
 * Created by oto on 6/6/19.
 */
Ext.define('first.view.repository.common.CommonController', {
    extend: 'first.view.repository.personalFiles.PersonalFilesViewController',
    alias: 'controller.common',

    /**
     * Called when the view is created
     */


    listen: {
        controller: {
            '*': {
                refreshGrid: 'onRefreshGrid'
            }
        }
    },


    init: function () {
        let me = this;

        this.getView().setViewModel(Ext.create('Ext.app.ViewModel', {
            formulas: {
                showMenuItem: {
                    get: function (get) {
                        var r = get('selectedDocument');

                        if (!r) {
                            return false;
                        }

                        return get('commonbreadcrumb').selection.get('id') === 'root' ? false : true;
                    }
                },
                enableBreadcrumb: {
                    get: function (get) {
                        let id = get('routeId');
                        return !!(id && id === 'favorites');
                    }
                },
                isSelectedRow: {
                    get: function (get) {
                        var r = get('selectedDocument');
                        return !r;
                    }
                }
            }
        }));
        this.getViewModel().set('routeId', this.getView().routeId);

        this.getView().getStore().on({
            scope: me,
            load: 'onNodeDataLoad'
        });

        let storeUrl = "";
        this.getView().getStore().getProxy().setTimeout(60000);
        switch (this.getView().routeId) {
            case 'favorites':
                storeUrl = this.getView().getStore().getProxy().getUrl() + "favorites/people/favorites";
                this.setupViewData(this.getView().viewTitle, storeUrl);
                break;
            case 'trash':
                storeUrl = this.getView().getStore().getProxy().getUrl() + "node/deleted-nodes";
                this.setupViewData(this.getView().viewTitle, storeUrl);
                break;
        }
    },

    onNodeDataLoad: function (component, records, successful, operation) {
        let breadCrumb = this.lookupReference('commonbreadcrumb');
        let breadcrumbStore = breadCrumb.getStore();

        Ext.each(records, function (record) {
            if (record.get('folder')) {

                let parentRecord = breadcrumbStore.findRecord('id', record.get('parentId'));
                let node = new Ext.data.TreeModel({
                    id: record.get('id'),
                    text: record.get('name'),
                    leaf: record.get('file'),
                    iconCls: 'x-fa fa-folder',
                    children: [],
                    document: record
                });
                if (parentRecord) {
                    if (!breadcrumbStore.findRecord('id', record.get('id'))) {
                        parentRecord.set('expanded', true);
                        parentRecord.appendChild(node);
                    }
                } else {
                    if (!breadcrumbStore.findRecord('id', record.get('id'))) {
                        breadcrumbStore.getRoot().appendChild(node);
                    }
                }
            }

        });
        let selection = breadCrumb.getSelection();

        breadCrumb.suspendEvent('change');
        breadCrumb.suspendEvent('selectionchange');
        breadCrumb._needsSync = true;
        breadCrumb.updateSelection(selection, selection)
        breadCrumb.resumeEvent('change');
        breadCrumb.resumeEvent('selectionchange');
    },

    setupViewData: function (title, storeUrl) {
        if (this.getViewModel().get('enableBreadcrumb') == null || this.getViewModel().get('enableBreadcrumb')) {

            let breadCrumb = this.lookupReference('commonbreadcrumb');
            breadCrumb.setStore(Ext.create('first.store.repository.RepositoryBreadcrumbStore', {
                root: {
                    text: title,
                    expanded: true,
                    children: []
                }
            }));

        }
        let viewStore = this.getView().getStore();
        viewStore.getProxy().setUrl(storeUrl);
        viewStore.load();
    },

    onRefreshGrid: function () {
        this.getView().getStore().load();
    },

    onBreadCrumbNavigationClick: function (component, node, prevNode) {
        this.fireEvent('setSelectedNode', node);
        if (this.getViewModel().get('enableBreadcrumb')) {

            let store = this.getView().getStore();
            if (node === component.getStore().getRoot()) {
                store.load();
            } else if (node.get('document')) {
                let url = first.config.Config.remoteRestUrl + "ecm/node/" + node.get('document').get('id') + "/children";
                store.load({url: url});
            }
        }
    },


    onCellClick: function (component, td, cellIndex, record, tr, rowIndex, e) {
        let fieldName = component.getGridColumns()[cellIndex].dataIndex;
        let breadCrumb = this.lookupReference('commonbreadcrumb');

        if (e.getTarget('text') && fieldName === 'name' && record.get('folder')) {
            let selected = breadCrumb.getStore().findRecord('id', record.get('id'));
            breadCrumb.setSelection(selected);
        }
    },


    showContextMenu: function (component, record, item, index, e) {
        e.preventDefault();
        this.getViewModel().set('selectedDocument', record);
        this.getContextMenu(record).showAt(e.getXY());
    },

    getContextMenu: function (record) {
        var me = this;

        return Ext.create('Ext.menu.Menu', {
            controller: 'commoncontextmenu',
            viewModel: me.getViewModel(),
            record: record,
            items: me.getContextMenuItems()
        });
    },

    getContextMenuItems: function () {
        let items = this.getViewModel().get('routeId') !== 'trash' ? [{
            text: i18n.removeFromFavorites,
            handler: 'onRemoveFromFavorites',
            iconCls: 'x-fa fa-times',
            bind: {
                hidden: '{showMenuItem}'
            }
        }, {
            text: i18n.upload,
            handler: 'onUploadMenuClick',
            iconCls: 'x-fa fa-cloud-upload-alt',
            hidden: true,
            bind: {
                hidden: '{!showMenuItem}'
            }
        }, {
            text: i18n.download,
            handler: 'onDownloadMenuClick',
            iconCls: 'x-fa fa-cloud-download-alt'
        }, {
            text: i18n.addTofavorites,
            handler: 'onFavoritesMenuClick',
            iconCls: 'x-fa fa-star',
            hidden: true,
            bind: {
                hidden: '{!showMenuItem}'
            }
        }, {
            text: i18n.edit,
            handler: "onEditMenuClick",
            iconCls: 'x-fa fa-pencil',
            bind: {
                disabled: '{selectedDocument.file}'
            },
            bind: {
                hidden: '{!showMenuItem}'
            }
        }, {
            xtype: 'menuseparator'
        }, {
            text: i18n.copy,
            handler: 'onCopyMenuClick',
            iconCls: 'x-fa fa-copy',
            bind: {
                hidden: '{!showMenuItem}'
            }
        }, {
            text: i18n.move,
            handler: 'onMoveMenuClick',
            iconCls: 'x-fa fa-arrows-alt',
            bind: {
                hidden: '{!showMenuItem}'
            }
        }, {
            text: i18n.delete,
            handler: 'onDeleteMenuClick',
            iconCls: 'x-fa fa-times'
        }, {
            xtype: 'menuseparator'
        }, {
            text: i18n.permissions,
            handler: 'onPermissionsMenuClick',
            iconCls: 'x-fa fa-list'
        }] : [{
            text: i18n.deleteForever,
            handler: 'onPurgeNodeClick',
            iconCls: 'x-fa fa-times',
            handler: 'onDeleteForeverMenuClick',
            hidden: false,
        }, {
            text: i18n.restore,
            handler: 'onRecoverNodeClick',
            iconCls: 'x-fa fa-history',
            hidden: false,
            handler: 'onRecoverFromTrashMenuClick'
        }];

        return items;
    },


    onRecoverButtonClick: function (component, e) {
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();
        repositoryhelper.recoverNodes(this.getViewModel().get('selectedDocuments'), this.getView())
    },


    onPurgeButtonClick: function (component, e) {
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();
        repositoryhelper.purgeNodes(this.getViewModel().get('selectedDocuments'), this.getView())
    }
});