Ext.define('first.view.registration.FiProfileDocumentationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.documentationControllerEcm',

    requires: [
        'Ext.app.ViewModel',
        'Ext.data.Model',
        'first.config.Config',
        'first.util.DocumentRepositoryHelper',
        'first.util.RepositoryUtil',
        'first.view.repository.common.RepositoryHelper'
    ],

    listen: {
        store: {
            '*': {
                renewDocumentationBreadcrumb: 'renewDocumentationBreadcrumb'
            }
        },
        controller: {
            '*': {
                refreshGrid: 'refreshGrid',
                mask: 'maskGrid'
            }
        }
    },

    init: function () {
        this.getViewModel().set('loadedNodeId', this.getViewModel().get('detail').rootNodeId);
    },

    onCellClick: function (component, td, cellIndex, record, tr, rowIndex, e) {
        let columns = component.getGridColumns();
        let fieldName = columns.length > cellIndex ? columns[cellIndex].dataIndex : null;

        if (e.getTarget('text') && fieldName === 'name' && record.get('folder')) {
            let breadCrumb = this.lookupReference('documentationBreadcrumb');
            let selected = breadCrumb.getStore().findRecord('id', record.get('id'));
            breadCrumb.setSelection(selected);
        }
    },

    onCreateFolderClick: function (button, e) {
        this.onEditFolderClick(false, {id: this.getViewModel().get('loadedNodeId')});
    },

    onEditFolderClick: function (editMode, modelData, viewModelData) {
        let view = Ext.create({
            xtype: 'createfolderwindow',
            title: editMode ? i18n.editFolder : i18n.createFolder
        });

        view.setViewModel(new Ext.app.ViewModel({
            data: {
                isEditMode: editMode,
                selectedNode: new Ext.data.Model(modelData || {})
            }
        }));

        if (viewModelData) {
            for (let item in viewModelData) {
                view.getViewModel().set(item, viewModelData[item]);
            }
        }

        view.show();
    },

    onUploadFileClick: function (button, e) {
        let nodeId = this.getViewModel().get('loadedNodeId');

        let window = Ext.create({xtype: 'fileuploadwindow'});
        window.setViewModel(new Ext.app.ViewModel({
            data: {
                extraProps: {
                    'nodeType': "fina:fiDocument",
                    'fina:fiDocumentProcessId': this.getViewModel().get('theFi')['fina_fiRegistryLastProcessId'],
                    'fina:fiDocumentType': "DOCUMENT"
                }
            }
        }));
        window.getViewModel().set('folderNodeId', nodeId);

        window.show();
    },

    onEditDocumentClick: function (view, recIndex, cellIndex, item, e, record) {
        if (record.get('file')) {
            Ext.create('first.view.registration.FiProfileDocumentationEditView', {
                viewModel: {
                    data: {
                        fileId: record.get('id'),
                        fileName: record.get('name'),
                        isReadonly: false
                    }
                }
            }).show();
        } else {
            this.onEditFolderClick(true, {
                id: record.get('id'),
                parentId: this.getViewModel().get('loadedNodeId')
            }, {
                folderName: record.get('cm_title'),
                folderDescription: record.get('cm_description'),
            });
        }
    },

    onDeleteDocumentClick: function (view, recIndex, cellIndex, item, e, record) {
        let repoHelper = new first.view.repository.common.RepositoryHelper();
        console.log(this);
        repoHelper.deleteNode(record, this);
    },

    onGoToProcessClick: function (view, recIndex, cellIndex, item, e, record) {
        let processId = record.get('fina_fiDocumentProcessId');
        if (processId) {
            this.fireEvent('navChange', 'wfDetails/' + processId);
        }
    },

    onDownloadClick: function (view, recIndex, cellIndex, item, e, record) {
        let documentRepositoryHelper = new first.util.DocumentRepositoryHelper();

        if (record.get('file')) {
            documentRepositoryHelper.openDownloadFileUrl(record.get('id'));
        } else {
            let displayName = this.getFolderDisplayName(record);
            documentRepositoryHelper.onFolderDownload(record.get('id'), this.getView(), displayName);
        }
    },

    renewDocumentationBreadcrumb: function (data) {
        if (data.length > 0) {
            let breadCrumb = this.lookupReference('documentationBreadcrumb');
            let docStore = breadCrumb.getStore();
            let node = docStore.getById(data[0].get('parentId')) || docStore.getRoot();
            node.removeAll();

            let me = this;
            data.forEach(item => node.appendChild({
                id: item.id,
                text: me.getFolderDisplayName(item),
                expanded: true,
                children: []
            }));

            let selection = breadCrumb.getSelection();
            breadCrumb.suspendEvent('change');
            breadCrumb.suspendEvent('selectionchange');
            breadCrumb._needsSync = true;
            breadCrumb.updateSelection(selection, selection);
            breadCrumb.setSelection(selection);
            breadCrumb.resumeEvent('change');
            breadCrumb.resumeEvent('selectionchange');
        }
    },

    reloadDocumentationGrid: function (breadCrumb, node) {
        if (node.id !== 'root') {
            this.getViewModel().set('loadedNodeId', node.id);
        } else {
            this.getViewModel().set('loadedNodeId', this.getViewModel().get('detail').rootNodeId);
        }

        let store = this.getView().getStore(),
            fiRegistry = this.getViewModel().get('theFi'),
            url = first.config.Config.remoteRestUrl + 'ecm/fi/documents/' + this.getViewModel().get('loadedNodeId');

        if (fiRegistry) {
            url += '?fiRegistryId=' + fiRegistry.id;
        }

        store.getProxy().setUrl(url);
        store.load();
    },

    refreshGrid: function () {
        this.getView().getStore().load();
    },

    onDocumentationViewRender: function (view) {
        let store = view.getStore();
        store.getProxy().setUrl(this.getViewModel().get('detail')["url"]);
        store.load();
    },

    maskGrid: function (mask) {
        let view = this.getView();
        if (mask) {
            view.mask(i18n.pleaseWait);
        } else {
            view.unmask();
        }
    },

    nameColumnRenderer: function (value, cell, record) {
        if (record.get('nodeType') === 'cm:folder') {
            value = this.getFolderDisplayName(record);
        } else {
            let displayName = record.get('properties')['fina:fiDocumentDisplayName'];
            if (displayName) {
                value = displayName;
            } else {
                value = (i18n[value] || value);
            }
        }

        cell.tdCls = 'underlineTextDec';
        let icon = first.util.RepositoryUtil.getNodeIcon(record, 'x-fa');
        return icon + ' <text style="cursor:pointer;">' + value + '</text>';

    },

    getFolderDisplayName(item) {
        let displayName = item.get('name');
        if (item.get('nodeType') === 'cm:folder') {
            let actionType = item.get('fina_actionDocumentsFolderConfigActionTypeKey');
            if (actionType) {
                displayName = i18n[actionType] ? i18n[actionType] : actionType;
            }
        }

        return displayName;
    },

    afterSearchComboRender: function (combo) {
        let store = combo.getStore(),
            fiCode = this.getViewModel().get('theFi')['fina_fiRegistryCode'];
        store.proxy.setUrl(first.config.Config.remoteRestUrl + "ecm/fi/documents/search/" + fiCode);
    },

    onSelectSearchItemClick: function (combo, node) {
        let me = this,
            treeView = this.getView(),
            path = node.get("path");
        let curRec = treeView.getStore().findRecord('id', node.get('id'));
        if (curRec) {
            treeView.setSelection(curRec);
            return;
        }

        let breadCrumb = this.lookupReference('documentationBreadcrumb');
        parentNode = treeView.getStore().findRecord("id", node.get("parentId"));

        if (parentNode) {
            breadCrumb.setSelection(breadCrumb.getStore().findRecord('id', node.get('parentId')));
            treeView.getStore().on('load', (records, successful) => {
                let record = records.findRecord('id', node.get('id'));
                if (record) {
                    treeView.setSelection(record)
                } else {
                    let rec = treeView.getStore().insert(0, record);
                    treeView.setSelection(rec);
                }
            });
        } else {

            let arr = [];

            let curNode = new Ext.data.TreeModel({
                id: path.elements[path.elements.length - 1].id,
                text: path.elements[path.elements.length - 1].name,
                leaf: false,
                iconCls: 'x-fa fa-folder',
                children: [],
                parentId: path.elements[path.elements.length - 2].id
            });
            arr.push(curNode);

            let parentRecordNode = breadCrumb.getStore().findRecord('id', node.get('parentId'));

            if (parentRecordNode) {
                if (!breadCrumb.getStore().findRecord('id', node.get('id'))) {
                    parentRecordNode.set('expanded', true);
                    parentRecordNode.appendChild(curNode);
                }
            } else {
                if (!breadCrumb.getStore().findRecord('id', node.get('id'))) {
                    breadCrumb.getStore().getRoot().appendChild(curNode);
                }
            }

        }

        combo.reset();
    }

});