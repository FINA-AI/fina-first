/**
 * Created by oto on 5/30/19.
 */
Ext.define('first.view.repository.personalFiles.PersonalFilesViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.personalFiles',

    requires: [
        'Ext.data.StoreManager',
        'first.config.Config',
        'first.util.DocumentRepositoryHelper'
    ],


    listen: {
        controller: {
            '*': {
                refreshGrid: 'onRefreshPersonalFiles',
                expandToNode: 'constructBreadCrumbStoreByNodePath'
            }
        }
    },


    /**
     * Called when the view is created
     */
    init: function () {
        let me = this;
        me.workflowMenu = me.workflowMenu ? me.workflowMenu : [];
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/process/definitions',
            method: 'GET',
            success: function (response) {

                let resultData = JSON.parse(response.responseText),
                    hiddenWorkflowKeys = (first.config.Config.conf.properties.documentRepositoryHiddenWorkflowKeys ? first.config.Config.conf.properties.documentRepositoryHiddenWorkflowKeys : []);

                Ext.each(resultData, function (rd) {
                    if ((!Ext.Array.contains(hiddenWorkflowKeys, rd.processDefinition.key)) && (rd.processDefinition.title || rd.processDefinition.name)) {
                        rd.text = (rd.processDefinition.title ? rd.processDefinition.title : rd.processDefinition.name);
                        rd.tooltip = (rd.processDefinition.name ? rd.processDefinition.name : rd.processDefinition.title);
                        rd.handler = 'onStartNewTaskItemSelect';
                        rd.repositoryViewModel = me.getViewModel();
                        me.workflowMenu.push(rd);
                    }
                });

            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });

        let store = this.getView().getStore();
        store.on({
            scope: me,
            load: 'onNodeDataLoad',
            beforeload: 'onBeforeLoad'
        });

        me.checkRoute();
    },


    onBeforeLoad: function (store) {
        let selectedNode = this.getSelectedNode();
        if (selectedNode.customPaging) {
            selectedNode.customPaging.currentPage = store.currentPage;
        }
        if (selectedNode) {
            let url = first.config.Config.remoteRestUrl + "ecm/node/" + selectedNode.id + "/children";
            store.proxy.setUrl(url);
        }
    },

    checkRoute: function () {
        let me = this;
        let nodeId = Ext.History.getToken().split("/")[0] === 'repositoryItem' ? first.config.Config.historyTokenItemId() : null;

        let store = this.getView().getStore();

        if (!nodeId) {
            store.load();
        } else {
            let breadCrumb = this.lookupReference('repositorybreadcrumb');

            Ext.Ajax.request({
                method: 'GET',
                url: first.config.Config.remoteRestUrl + "ecm/node/" + nodeId + '?include=path',
                callback: function (op, success, response) {
                    if (success) {

                        let node = JSON.parse(response.responseText);
                        let nodeModel = Ext.create('first.model.repository.NodeModel', node);

                        me.constructBreadCrumbStoreByNodePath(nodeModel, breadCrumb);
                    }
                }
            });
        }
    },

    constructBreadCrumbStoreByNodePath: function (record, breadcrumb) {
        let me = this;
        let store = breadcrumb.getStore();
        let path = record.get('path');

        let arr = [];

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
            me.load(selection, function () {
                    let r = me.getView().getStore().findRecord('id', record.get('id'));
                    if (!r) {
                        let rec = me.getView().getStore().insert(0, record);
                        r = rec[0];

                        let node = new Ext.data.TreeModel({
                            id: r.get('id'),
                            text: r.get('name'),
                            leaf: r.get('file'),
                            iconCls: 'x-fa fa-folder',
                            children: [],
                            parentId: r.get('parentId'),
                            document: record
                        });
                        r.customPaging = {
                            currentPage: 1,
                            fromBreadcrumb: false
                        };
                        node.customPaging = {
                            currentPage: 1,
                            fromBreadcrumb: false
                        }
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
                    me.getView().getSelectionModel().select(r, false)
                }
            );
        }
    },

    onNodeDataLoad: function (component, records, successful, operation) {
        let breadCrumb = this.lookupReference('repositorybreadcrumb');
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
        breadCrumb.updateSelection(selection, selection);
        breadCrumb.setSelection(selection);
        breadCrumb.resumeEvent('change');
        breadCrumb.resumeEvent('selectionchange');
    },

    onBreadCrumbNavigationClick: function (component, node, prevNode) {
        let personalFilesStore = this.getView().getStore();
        this.fireEvent('setSelectedNode', node);
        if (node === component.getStore().getRoot()) {
            component.getStore().getRoot().setId(first.config.Config.conf.properties.userRootNode.id);
            node.customPaging = {
                currentPage: 1
            };
            personalFilesStore.loadPage(1);
        } else if (node) {
            if (node.customPaging) {

                node.customPaging.fromBreadcrumb = true;
            }
            this.load(node);
        }
    },

    showContextMenu: function (component, record, item, index, e) {
        e.preventDefault();
        this.getViewModel().set('selectedDocument', record);
        this.getViewModel().set('isFile', record.get('file'))
        this.getContextMenu(record).showAt(e.getXY());
    },

    showContainerContextMenu: function (grid, e, listeners) {
        e.preventDefault();
        let record = this.getSelectedNode();
        this.getViewModel().set('selectedDocument', record.get('document'));
        this.getContextMenu(record).showAt(e.getXY());
    },

    onCellClick: function (component, td, cellIndex, record, tr, rowIndex, e) {
        let fieldName = component.getGridColumns()[cellIndex].dataIndex;
        let breadCrumb = this.lookupReference('repositorybreadcrumb');

        if (e.getTarget('text') && fieldName === 'name' && record.get('folder')) {
            let selected = breadCrumb.getStore().findRecord('id', record.get('id'));
            selected.customPaging = {
                currentPage: 1,
                fromBreadcrumb: false
            };
            breadCrumb.suspendEvent('change');
            breadCrumb.suspendEvent('selectionchange');
            breadCrumb._needsSync = true;
            breadCrumb.updateSelection(selected, selected);
            breadCrumb.setSelection(selected);
            this.fireEvent('setSelectedNode', selected);
            this.load(selected);
            breadCrumb.resumeEvent('change');
            breadCrumb.resumeEvent('selectionchange');
        }
    },

    onRefreshPersonalFiles: function (nodeId) {
        if (nodeId === this.getSelectedNode().get('id')) {
            this.load(this.getSelectedNode());
        } else if (this.getSelectedNode().get('id') === first.config.Config.conf.properties.userRootNode.id) {
            this.load(this.getSelectedNode());
        }
    },

    load: function (node, callback) {
        let me = this,
            url = first.config.Config.remoteRestUrl + "ecm/node/" + (node.id ? node.id : node) + "/children",
            curPage = this.getView().getStore().currentPage;
        if (node.customPaging) {
            curPage = node.customPaging.currentPage;
        }
        this.getView().getStore().loadPage(curPage, {
            url: url,
            callback: callback
        });
    },

    getSelectedNode() {
        let breadCrumb = this.lookupReference('repositorybreadcrumb');
        return breadCrumb.getSelection();
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
        me.getView().removeCls('drag-over')
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

    uploadFile: function (fd, nodeId, resolve, reject) {
        let me = this;
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + "ecm/node/" + nodeId + '/upload/' + fd.get('filedata').name,
            rawData: fd,
            headers: {'Content-Type': null},
            callback: function (o, s, r) {
                if (s) {
                    let result = JSON.parse(r.responseText);
                    resolve(result);
                } else {
                    reject(r);
                }
            }
        })
    },

    promiseUpload: function (fd, nodeId) {
        let me = this;
        return new Ext.Promise(function (resolve, reject) {
            me.uploadFile(fd, nodeId, resolve, reject)
        });
    },

    onInfoItemToggle: function (component, value) {
        component.setIconCls(value ? 'x-fa fa-info infoTogleSelecStyle' : 'x-fa fa-info');
        this.getViewModel().set('isInfoEnabled', value);

        let panel = this.getView().up('panel');

        if (value) {
            this.showProperties(this.getViewModel().get('selectedDocument'));
        } else {
            panel.remove(this.propertyView)
        }
    },


    onDownloadCtionButtonClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        if (!record) {
            record = this.getViewModel().get('selectedDocument');
        }
        let documentRepositoryHelper = new first.util.DocumentRepositoryHelper();

        if (record.get('file')) {
            documentRepositoryHelper.openDownloadFileUrl(record.get('id'));

        } else {
            documentRepositoryHelper.onFolderDownload(record.get('id'), this.getView());
        }
    },

    onSelectionChange: function (component, selected) {
        this.getViewModel().set('selectedDocuments', selected);
        if (this.getViewModel().get('isInfoEnabled')) {
            this.showProperties(selected[0]);
        }
    },

    showProperties: function (record) {
        if (this.getViewModel().get('isLoading')) {
            return;
        }
        let panel = this.getView().up('panel');

        let propertyView = Ext.create({
            xtype: 'property',
            flex: 1
        });
        panel.remove(this.propertyView);
        this.propertyView = propertyView;


        panel.add(propertyView);
        propertyView.getController().loadNodeProperties(record);
    },

    getContextMenu: function (record) {
        var me = this;

        return me.contextMenu || (me.contextMenu = Ext.create('Ext.menu.Menu', {
                controller: 'personalFilesContextmenu',
                viewModel: me.getViewModel(),
                record: record,
                items: [{
                    text: 'Share',
                    handler: 'onShareFileMenuClick',
                    iconCls: 'x-fa fa-share-alt',
                    hidden: true,
                    bind: {
                        disabled: '{!isFile}',
                        hidden: '{!isFile}',
                        text: '{getShareMenuText}'
                    },
                }, {
                    xtype: 'menuseparator',
                    hidden: true,
                    bind: {
                        hidden: '{!isFile}'
                    }
                }, {
                    text: i18n.upload,
                    handler: 'onUploadMenuClick',
                    iconCls: 'x-fa fa-cloud-upload-alt'
                }, {
                    text: i18n.update,
                    handler: 'onUpdateMenuClick',
                    iconCls: 'x-fa fa-arrow-up',
                    disabled: true,
                    bind: {
                        disabled: '{!isFile}'
                    },
                }, {
                    text: i18n.download,
                    handler: 'onDownloadMenuClick',
                    iconCls: 'x-fa fa-cloud-download-alt',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedDocument}'
                    },
                }, {
                    xtype: 'menuseparator'
                }, {
                    text: i18n.startWorkflow,
                    iconCls: 'x-fa fa-play',
                    menu: {
                        xtype: 'menu',
                        controller: 'taskViewController',
                        plain: true,
                        items: me.workflowMenu
                    },
                    disabled: true,
                    bind: {
                        disabled: '{!selectedDocument}'
                    }
                }, {
                    xtype: 'menuseparator'
                }, {
                    text: i18n.addTofavorites,
                    handler: 'onFavoritesMenuClick',
                    iconCls: 'x-fa fa-star',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedDocument}'
                    }
                }, {
                    text: i18n.edit,
                    handler: "onEditMenuClick",
                    iconCls: 'x-fa fa-edit',
                    bind: {
                        disabled: '{selectedDocument.file}'
                    },
                    disabled: true,
                    bind: {
                        disabled: '{!selectedDocument}'
                    }
                }, {
                    iconCls: 'x-fa fa-edit',
                    text: i18n.documentRepositoryContextMenuEditContent,
                    handler: 'onEditContentMenuClick',
                    bind: {
                        disabled: '{selectedDocument.folder || !selectedDocument.content}',
                        hidden: '{!isFile}'
                    }
                }, {
                    xtype: 'menuseparator'
                }, {
                    text: i18n.copy,
                    handler: 'onCopyMenuClick',
                    iconCls: 'x-fa fa-copy',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedDocument}'
                    }
                }, {
                    text: i18n.move,
                    handler: 'onMoveMenuClick',
                    iconCls: 'x-fa fa-arrows-alt',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedDocument}'
                    }
                }, {
                    text: i18n.paste,
                    handler: 'onPasteMenuClick',
                    iconCls: 'x-fa fa-paste',
                    disabled: true,
                    bind: {
                        disabled: '{!menuAction.copySource}'
                    }
                }, {
                    text: i18n.delete,
                    handler: 'onDeleteMenuClick',
                    iconCls: 'x-fa fa-times',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedDocument}'
                    }
                }, {
                    xtype: 'menuseparator',
                    bind: {
                        hidden: '{!isUserAdministrator}'
                    }
                }, {
                    text: i18n.manageVersions,
                    handler: 'onVersionsMenuClick',
                    iconCls: 'x-fa fa-history',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedDocument || !selectedDocument.file}',
                    }
                }, {
                    text: i18n.permissions,
                    handler: 'onPermissionsMenuClick',
                    iconCls: 'x-fa fa-list',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedDocument}',
                        hidden: '{!isUserAdministrator}'
                    }
                }]
            })
        );
    },

    onPreviewActionButtonClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        if (record.get('content') || record.get('file')) {
            this.previewNodeContent(record.get('id'), record.get('content').mimeType);
        }
    },

    previewNodeContent: function (nodeId, mimeType) {
        let renditionNotRequiredMimeTypes = first.config.Config.conf.properties.nonRenditionMimeTypes;
        if (Ext.Array.contains(renditionNotRequiredMimeTypes, mimeType)) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + nodeId + '/content/preview?attachment=false', '_blank');
        } else {
            let me = this,
                nodeContentPreviewTask = new Ext.util.DelayedTask(function () {
                    me.getView().unmask();
                    window.open(first.config.Config.remoteRestUrl + 'ecm/node/renditions/preview/content/' + nodeId, '_blank');
                });

            me.getView().mask(i18n.pleaseWait);
            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/node/renditions/preview/content/check/' + nodeId,
                method: 'GET',
                success: function (response) {
                    nodeContentPreviewTask.delay(2000);
                },
                failure: function (response) {
                    me.getView().unmask();
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            });
        }
    }

});
