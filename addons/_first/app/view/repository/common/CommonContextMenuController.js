/**
 * Created by oto on 6/6/19.
 */
Ext.define('first.view.repository.common.CommonContextMenuController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.commoncontextmenu',

    requires: [
        'Ext.app.ViewModel',
        'first.config.Config',
        'first.util.DocumentRepositoryHelper',
        'first.view.repository.common.RepositoryHelper'
    ],


    /**
     * Called when the view is created
     */
    init: function () {

    },


    onDownloadMenuClick: function (component, e) {
        let documentRepositoryHelper = new first.util.DocumentRepositoryHelper();
        let selectedNode = this.getViewModel().data.selectedDocument;
        let selectedNodeId = selectedNode.get('nodeId') ? selectedNode.get('nodeId') : selectedNode.id;

        if (selectedNode.get('file') || selectedNode.get('content')) {
            documentRepositoryHelper.openDownloadFileUrl(selectedNodeId);

        } else {
            documentRepositoryHelper.onFolderDownload(selectedNodeId, this.getView());
        }
    },

    onEditMenuClick: function (component, e) {
        let selected = this.getViewModel().get('selectedDocument');
        selected.set('id', selected.get('nodeId') ? selected.get('nodeId') : selected.get('id'));
        var view = Ext.create({xtype: 'createfolderwindow'});
        view.setViewModel(new Ext.app.ViewModel());
        view.getViewModel().set('selectedNode', selected);
        view.getViewModel().set('folderName', selected.get('name'));
        view.getViewModel().set('folderDescription', selected.get('properties') ? selected.get('properties')['cm:description'] : '');
        view.getViewModel().set('isEditMode', true);
        view.title = "Edit Folder";
        view.show();

    },

    onDeleteMenuClick: function (component, e) {
        let selected = this.getViewModel().get('selectedDocuments');
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();

        repositoryhelper.deleteNodes(selected, this);
    },

    onFavoritesMenuClick: function (component, e) {
        let me = this;
        let selected = me.getViewModel().get('selectedDocument');
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();
        repositoryhelper.addNodeToFavorites(selected, this);
    },

    onCopyMenuClick: function (component, e) {
        let selectedDocuments = this.getViewModel().get('selectedDocuments');
        this.getViewModel().set('menuAction', {copySource: selectedDocuments, action: 'copy'});
    },


    onMoveMenuClick: function (component, e) {
        let selectedDocument = this.getViewModel().get('selectedDocuments');
        this.getViewModel().set('menuAction', {copySource: selectedDocument, action: 'move'});
    },

    onPasteMenuClick: function (component, e) {
        let me = this;
        let target = this.getViewModel().get('selectedDocument');
        let menuAction = this.getViewModel().get('menuAction');
        let source = menuAction.copySource;
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();
        source.forEach(function (node) {
            repositoryhelper.pasteNode(node, target, me, menuAction);
        });
    },

    onUploadMenuClick: function (component, e) {
        let node = this.getViewModel().get('selectedDocument');

        let window = Ext.create({xtype: 'fileuploadwindow'});
        window.setViewModel(new Ext.app.ViewModel());
        window.getViewModel().set('folderNodeId', node ? node.get('folder') ? node.get('id') : node.get('parentId') : first.config.Config.conf.properties.userRootNode.id);

        window.show();
    },

    onUpdateMenuClick: function (component, e) {
        let node = this.getViewModel().get('selectedDocument'),
            window = Ext.create({
                xtype: 'fileupdatewindow',
                viewModel: {
                    data: {
                        selectedNode: node
                    }
                }
            });

        window.title = i18n.updateFileVersionTitle;
        window.show();
    },

    onRecoverFromTrashMenuClick: function (component, e) {
        this.onRecoverNodeClick(component, e);
    },

    onDeleteForeverMenuClick: function (component, e) {
        this.onPurgeNodeClick(component, e);
    },

    onRemoveFromFavorites: function (component, e) {
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();
        repositoryhelper.removeFromFavorites(this.getViewModel().get('selectedDocument'), this.getView());
    },

    onPurgeNodeClick: function (component, e) {
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();
        repositoryhelper.purgeNodes(this.getViewModel().get('selectedDocuments'), this.getView());
    },

    onRecoverNodeClick: function (component, e) {
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();
        repositoryhelper.recoverNodes(this.getViewModel().get('selectedDocuments'), this.getView());
    },

    onPermissionsMenuClick: function (component, e) {
        let me = this;
        let selected = me.getViewModel().get('selectedDocument');

        let window = Ext.create({
            xtype: 'permissionWindow',
            viewModel: {
                data: {
                    selectedNode: selected
                }
            }
        });
        window.show();
    },

    onVersionsMenuClick: function (component, e) {
        let me = this;
        let selected = me.getViewModel().get('selectedDocument');

        let window = Ext.create({
            xtype: 'versionsWindow',
            viewModel: {
                data: {
                    selectedNode: selected
                }
            }
        });
        window.show();
    },

    onEditContentMenuClick: function (component, e) {
        let selectedNodeRecord = this.getViewModel().get('selectedDocument');
        if (selectedNodeRecord.get('file') && selectedNodeRecord.get('content')) {
            let selectedNodeName = selectedNodeRecord.get('name'),
                extension = this.getNodeExtension(selectedNodeName),
                supportedExtension = first.config.Config.supportedExtensions[extension];
            if (supportedExtension) {
                let aosRemoteUrl = first.config.Config.conf.properties.aosRemoteUrl,
                    onlineEditUrl = Ext.String.format('{0}:ofe|u|{1}', supportedExtension, aosRemoteUrl.endsWith('/') ? aosRemoteUrl : aosRemoteUrl + '/'),
                    pathElements = selectedNodeRecord.get('path').element;
                for (let i = 1; i < pathElements.length; i++) {
                    onlineEditUrl += pathElements[i].name + '/';
                }
                onlineEditUrl += selectedNodeName;
                window.open(onlineEditUrl, '_self');
            } else {
                Ext.create('first.view.registration.FiProfileDocumentationEditView', {
                    viewModel: {
                        data: {
                            fileId: selectedNodeRecord.get('id'),
                            fileName: selectedNodeName,
                            isReadonly: false
                        }
                    }
                }).show();
            }
        }
    },

    onShareFileMenuClick: function (component, e) {
        let me = this,
            selectedDocument = me.getViewModel().get('selectedDocument');

        let view = Ext.create({
            xtype: 'sharelink',
        });
        view.getViewModel().set('selectedDocument', selectedDocument);
        if (selectedDocument && selectedDocument.data && selectedDocument.data.properties && selectedDocument.data.properties['qshare:expiryDate']) {
            view.getViewModel().set('expireDate', new Date(selectedDocument.data.properties['qshare:expiryDate']));
        }
        view.show();
    },

    onRemoveFromSharedMenuClick: function () {
        let me = this,
            selectedDocument = me.getViewModel().get('selectedDocument');

        me.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/share/' + selectedDocument.get('id'),
            method: 'DELETE',
            success: function (response) {
                me.getView().unmask();
                Ext.toast("File share will be break after 15 seconds!", i18n.configInformation);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                me.getView().unmask();
            }
        });

    },

    getNodeExtension: function (fileName) {
        if (fileName) {
            const match = fileName.match(/\.([^\./\?\#]+)($|\?|\#)/);
            return match ? match[1] : null;
        }
        return null;
    },

    onLeaveLibraryMenuClick: function () {
        let me = this,
            selectedDocument = me.getViewModel().get('selectedDocument');

        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
            if (btn === 'yes') {
                me.getView().mask(i18n.pleaseWait);
                Ext.Ajax.request({
                    url: first.config.Config.remoteRestUrl + 'ecm/sites/membership/' + selectedDocument.get('site')['id'],
                    method: 'DELETE',
                    success: function (response) {
                        me.getView().unmask();
                        me.fireEvent('refreshGrid', selectedDocument.get('parentId'));
                        Ext.toast("Removed From Library", i18n.configInformation);
                    },
                    failure: function (response) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                    },
                    callback: function () {
                        me.getView().unmask();
                    }
                });
            }
        });


    },

    onDeleteSiteMenuClick: function () {
        let me = this,
            selectedDocument = me.getViewModel().get('selectedDocument');

        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
            if (btn === 'yes') {
                me.getView().mask(i18n.pleaseWait);
                Ext.Ajax.request({
                    url: first.config.Config.remoteRestUrl + 'ecm/sites/' + selectedDocument.get('site')['id'],
                    method: 'DELETE',
                    success: function (response) {
                        me.getView().unmask();
                        me.fireEvent('refreshGrid', selectedDocument.get('parentId'));
                        Ext.toast("Removed Library", i18n.configInformation);
                    },
                    failure: function (response) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                    },
                    callback: function () {
                        me.getView().unmask();
                    }
                });
            }
        });
    },

    onFavoritesLibraryMenuClick: function () {
        let me = this;
        let selected = me.getViewModel().get('selectedDocument');
        selected.set('id', selected.get('site')['guid']);
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();
        repositoryhelper.addNodeToFavorites(selected, this, 'site');
    },

    onRemoveFavoriteLibraryMenuClick: function () {
        let repositoryhelper = new first.view.repository.common.RepositoryHelper();
        let selected = this.getViewModel().get('selectedDocument');
        selected.set('id', selected.get('site')['guid']);
        repositoryhelper.removeFromFavorites(selected, this.getView());
    },

    onMembersMenuClick: function () {
        let me = this,
            view = Ext.create({
                xtype: 'siteMembersWindow',
                viewModel: {
                    data: {
                        'selectedDocument': me.getViewModel().get('selectedDocuments')[0]
                    }
                }
            });
        view.show();
    }

});