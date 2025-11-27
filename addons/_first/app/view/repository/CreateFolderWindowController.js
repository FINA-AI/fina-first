/**
 * Created by oto on 6/3/19.
 */
Ext.define('first.view.repository.CreateFolderWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.createfolderwindow',

    /**
     * Called when the view is created
     */
    init: function () {

    },

    onSave: function (component, e) {
        let me = this;
        let node = this.getViewModel().get('selectedNode');

        let nodeBodyCreate = {
            name: this.getViewModel().get('folderName'),
            nodeType: 'cm:folder',
            properties: {
                'cm:description': this.getViewModel().get('folderDescription'),
                'cm:title': this.getViewModel().get('folderName')
            }
        };

        if (this.getViewModel().get('isEditMode')) {
            nodeBodyCreate.nodeType = null;
            me.updateFolder(node, nodeBodyCreate);
        } else {
            me.saveFolder(node, nodeBodyCreate);
        }

    },

    saveFolder: function (node, nodeBodyCreate) {
        let me = this;
        me.getView().mask('Please Wait..');

        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + node.get('id') + "/children",
            jsonData: nodeBodyCreate,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                me.fireEvent('refreshGrid', node.get('id'));
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                me.getView().unmask();
                me.onCancel();
            }
        });
    },

    updateFolder: function (node, nodeBodyCreate) {
        let me = this;
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + node.get('id'),
            jsonData: nodeBodyCreate,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                me.fireEvent('refreshGrid', node.get('parentId'));
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                me.getView().unmask();
                me.onCancel();
            }
        });
    },

    onCancel: function (component, e) {
        this.getView().destroy();
    }
});
