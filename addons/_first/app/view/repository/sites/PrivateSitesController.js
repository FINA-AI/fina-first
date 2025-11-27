/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.view.repository.sites.PrivateSitesController', {
    extend: 'first.view.repository.personalFiles.PersonalFilesViewController',
    alias: 'controller.sites',

    requires: [
        'first.store.repository.RepositoryBreadcrumbStore'
    ],

    listen: {
        controller: {
            '*': {
                refreshGrid: 'onRefreshClick'
            }
        }
    },

    /**
     * Called when the view is created
     */
    init: function () {
        let breadCrumb = this.lookupReference('sitesbreadcrumb');
        let title = this.getView().viewTitle;
        breadCrumb.setStore(Ext.create('first.store.repository.RepositoryBreadcrumbStore', {
            root: {
                text: title,
                expanded: true,
                children: []
            }
        }));
        this.callParent(arguments);
    },


    onRefreshClick: function (nodeId) {
        if (this.getViewModel().get('isRoot')) {
            this.getView().getStore().load();
        } else {
            this.load(nodeId);
        }
    },


    constructBreadCrumbStoreByNodePath: function (record, breadcrumb) {
        let me = this;
        let store = breadcrumb.getStore();
        let path = record.get('path');

        let arr = [];

        let library = path.elements.find(function (obj, index) {
            if (obj.name === 'documentLibrary') {
                path.elements[index - 1].id = obj.id;
            }
            return obj.name === 'documentLibrary';
        });
        path.elements = path.elements.filter(function (obj) {
            return obj.name !== 'Sites' && obj.name !== 'documentLibrary';
        });

        for (let i = 1; i < path.elements.length; i++) {
            let node = new Ext.data.TreeModel({
                id: path.elements[i].id,
                text: path.elements[i].name,
                leaf: false,
                iconCls: 'x-fa fa-folder',
                children: [],
                parentId: i === 1 ? 'root' : path.elements[i - 1].id
            });
            arr.push(node);

            let parentRecord = store.findRecord('id', node.get('parentId'));

            if (parentRecord) {
                if (!store.findRecord('id', node.get('id'))) {
                    parentRecord.set('expanded', true);
                    parentRecord.appendChild(node);
                }
            } else {
                if (!store.findRecord('id', node.get('id'))) {
                    store.getRoot().appendChild(node);
                }
            }
        }

        if (arr.length > 0) {
            let selection = store.findRecord('id', arr[arr.length - 1].get('id'));
            breadcrumb.setSelection(selection);
            me.load(selection.id, function () {
                record = me.getView().getStore().findRecord('id', record.get('id'))
                me.getView().getSelectionModel().select(record, false)
            });
        }
    },

    onBreadCrumbNavigationClick: function (component, node, prevNode) {
        let store = this.getView().getStore();
        this.fireEvent('setSelectedNode', node);
        this.getViewModel().set('selectedBreadcrumbNode', node);
        if (node === component.getStore().getRoot()) {
            this.getViewModel().set('isRoot', true);
            this.getViewModel().getParent().set('isRoot', true);
            store['baseUrl'] = store['baseUrl'] ? store['baseUrl'] : store.getProxy().getUrl();
            store.loadPage(1,{url: store['baseUrl']});
        } else  {
            this.getViewModel().set('isRoot', false);
            this.getViewModel().getParent().set('isRoot', false);
            let url = first.config.Config.remoteRestUrl + "ecm/node/" + node.get('id') + "/children";
            store.loadPage(1,{url: url});
        }
    },

    onCellClick: function (component, td, cellIndex, record, tr, rowIndex, e) {
        let column = component.getGridColumns()[cellIndex],
            fieldName = column ? column['dataIndex'] : null;
        let breadCrumb = this.lookupReference('sitesbreadcrumb');

        if (e.getTarget('text') && fieldName === 'description' && record.get('folder')) {
            let selected = breadCrumb.getStore().findRecord('id', record.get('id'));
            breadCrumb.setSelection(selected);
        }
    },

    onBeforeLoad: function (store) {
        let selectedNode = this.getSelectedNode();
        if (selectedNode) {
            let url = selectedNode.isRoot() ? store['baseUrl']
                : first.config.Config.remoteRestUrl + "ecm/node/" + selectedNode.id + "/children";
            store.proxy.setUrl(url);
        }
    },

    onNodeDataLoad: function (component, records, successful, operation) {
        let breadCrumb = this.lookupReference('sitesbreadcrumb');
        let breadcrumbStore = breadCrumb.getStore();

        Ext.each(records, function (record) {
            if (record.get('folder')) {

                let parentRecord = breadcrumbStore.findRecord('id', record.get('parentId'));
                let node = new Ext.data.TreeModel({
                    id: record.get('id'),
                    text: record.get('site') ? record.get('site')['description'] ? record.get('site')['description'] : record.get('site')['id'] : record.get('name'),
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
        breadCrumb.updateSelection(selection, selection);
        breadCrumb.setSelection(selection);
        breadCrumb.resumeEvent('change');
        breadCrumb.resumeEvent('selectionchange');
    },


    getContextMenu: function (record) {
        var me = this;
        if (!me.getViewModel().get('isRoot')) {
            return this.callParent(arguments);
        }

        return Ext.create('Ext.menu.Menu', {
            controller: 'commoncontextmenu',
            viewModel: me.getViewModel(),
            record: record,
            items: [{
                text: i18n.leaveLibrary,
                iconCls: 'x-fa fa-sign-out-alt',
                handler: 'onLeaveLibraryMenuClick',
                bind: {
                    disabled: '{isUserNodeOwner}'
                }

            }, {
                xtype: 'menuseparator'
            }, {
                text: i18n.delete,
                handler: 'onDeleteSiteMenuClick',
                iconCls: 'x-fa fa-times',
                disabled: true,
                bind: {
                    disabled: '{!(isUserNodeOwner || isUserAdministrator)}'
                }
            }, {
                text: i18n.addTofavorites,
                handler: 'onFavoritesLibraryMenuClick',
                iconCls: 'x-fa fa-star',
                disabled: true,
                bind: {
                    disabled: '{!selectedDocument}'
                }
            }, {
                xtype: 'menuseparator'
            }, {
                text: i18n.members,
                handler: 'onMembersMenuClick',
                iconCls: 'x-fa fa-list',
                disabled: true,
                bind: {
                    disabled: '{!(isUserNodeOwner || isUserAdministrator)}'
                }
            }]
        });
    },

    noop: function (e) {
        e.stopEvent();
    },

    addDropZone: function (e) {
        if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
            return;
        }

        e.stopEvent();

        this.getView().addCls('drag-over');
    },

    removeDropZone: function (e) {
        let el = e.getTarget(),
            thisEl = this.getView().getEl();

        e.stopEvent();


        if (el === thisEl.dom) {
            this.getView().removeCls('drag-over');
            return;
        }

        while (el !== thisEl.dom && el && el.parentNode) {
            el = el.parentNode;
        }

        if (el !== thisEl.dom) {
            this.getView().removeCls('drag-over');
        }

    },

    drop: function (e) {
        e.stopEvent();
        let me = this;
        me.getView().removeCls('drag-over');
        let node = me.getSelectedNode();
        let nodeId = node.get('id');

        me.getView().mask("Please Wait...");

        Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {
            let fd = new FormData();
            fd.append('filedata', file);
            fd.append('autoRename', "true");

            me.promiseUpload(fd, nodeId).then(function (result) {
                me.load(node);
                me.getView().unmask();
            }, function (err) {
                me.getView().unmask();
            });
        });

    },

    getSelectedNode: function () {
        return this.getViewModel().get('selectedBreadcrumbNode');
    }

});