/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.view.repository.common.RepositoryHelper', {

    purgeNodes: function (selectedNodes, view) {
        let me = this;
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
            if (btn === 'yes') {
                selectedNodes.forEach(function (node) {
                    me.purgeNode(node, view);
                })
            }
        });
    },

    purgeNode: function (selectedNode, view) {
        view.mask("Please wait...");
        Ext.Ajax.request({
            method: 'DELETE',
            url: first.config.Config.remoteRestUrl + "ecm/node/deleted-nodes/" + selectedNode.get('id'),
            callback: function (o, success, response) {
                Ext.toast(selectedNode.get('name') + ' Deleted', 'Info', 't');
                view.unmask();
                view.getController().fireEvent('refreshGrid');
            }
        });
    },

    recoverNodes: function (selectedNodes, view) {
        let me = this;
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
            if (btn === 'yes') {
                selectedNodes.forEach(function (selectedNode) {
                    me.recoverNode(selectedNode, view);
                });
            }
        });
    },

    recoverNode: function (selectedNode, view) {
        let me = this;
        view.mask("Please wait...");
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + "ecm/node/deleted-nodes/" + selectedNode.get('id') + "/restore",
            callback: function (o, success, response) {
                Ext.toast(selectedNode.get('name') + ' Recovered from Trash', 'Info', 't')
                view.unmask();
                view.getController().fireEvent('refreshGrid');
            }
        });

    },

    removeFromFavorites: function (selectedNode, view) {
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
            if (btn === 'yes') {
                view.mask("Please wait...");

                Ext.Ajax.request({
                    method: 'DELETE',
                    url: first.config.Config.remoteRestUrl + "ecm/favorites/people/" + selectedNode.get('id'),
                    callback: function (o, success, response) {
                        Ext.toast(selectedNode.get('name') + ' removed from favorites', 'Info', 't');
                        view.unmask();
                        view.getController().fireEvent('refreshGrid');
                    }
                });
            }
        });
    },

    deleteNodes: function (selectedNodes, controller) {
        let me = this;
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
            if (btn === 'yes') {
                selectedNodes.forEach(function (node) {
                    me.deleteNodeCall(node, controller);
                })
            }
        });
    },

    deleteNode: function (selectedNode, controller) {
        let me = this;
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
            if (btn === 'yes') {
                me.deleteNodeCall(selectedNode, controller);
            }
        });
    },

    deleteNodeCall: function (selectedNode, controller) {
        controller.fireEvent('mask', true);
        Ext.Ajax.request({
            method: 'DELETE',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + selectedNode.get('id'),
            success: function (response) {
                controller.fireEvent('refreshGrid', selectedNode.get('parentId'));
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                controller.fireEvent('mask', false);
            }
        });
    },

    addNodeToFavorites: function (node, controller, favoriteType) {
        let targetProperty = node.get('file') ? 'file' : node.get('folder') ? 'folder' : 'site';
        targetProperty = favoriteType ? favoriteType : targetProperty;
        let body = {
            target: {
                [targetProperty]: {
                    guid: node.get('id')
                }
            }
        };
        controller.getView().mask("Please wait..");
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + "ecm/favorites/people/-me-",
            jsonData: body,
            success: function (response) {
                Ext.toast(node.get('name') + ' added to favorites', 'Info', 't')
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                controller.getView().unmask();
            }
        });
    },

    pasteNode: function (source, target, controller, menuAction) {
        let nodeBodyCopy = {name: source.get('name'), targetParentId: target ? target.get('id') : '-root-'};
        if (target && !target.get('folder')) {
            Ext.toast("Paste allowed only in folders", "Waring");
            return;
        }
        controller.getViewModel().set('menuAction', null);
        controller.fireEvent('mask', true);

        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + source.get('id') + "/" + menuAction.action,
            jsonData: nodeBodyCopy,
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
            ,
            callback: function () {
                controller.fireEvent('mask', false);
                controller.fireEvent('refreshGrid', target ? target.get('id') : '-root-');
                controller.getView().unmask();
            }
        });
    }
});
