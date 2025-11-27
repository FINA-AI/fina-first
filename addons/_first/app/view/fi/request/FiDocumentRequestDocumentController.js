Ext.define('first.view.fi.request.FiDocumentRequestDocumentController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiDocumentRequestDocument',

    listen: {
        controller: {
            '*': {
                refreshFiDocumentRequestDocuments: 'onRefreshClick'
            },
            'fiDocumentRequest': {
                reloadFiDocumentRequestDocuments: 'load'
            }
        }
    },

    init: function () {
        this.getViewModel().set('enableTbarItems', false);
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().getStore().reload();
    },

    onUploadClick: function (button) {
        let selectedFiDocumentRequestId = this.getViewModel().get('selectedFiDocumentRequestId');
        if (selectedFiDocumentRequestId) {
            let window = Ext.create({xtype: 'fileuploadwindow'});
            window.getViewModel().set('folderNodeId', selectedFiDocumentRequestId);
            window.getViewModel().set('relativePath', button.relativePath);
            window.getViewModel().set('uploadFinishCallbackEventFunctionName', 'refreshFiDocumentRequestDocuments');
            window.show();
        }
    },

    onDownloadClick: function (grid, r, c, btn, event, record) {
        window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + record.id + '/content?attachment=true');
    },

    onDeleteClick: function (grid, r, c, btn, event, record) {
        let me = this;
        Ext.Msg.confirm(i18n.delete, 'Are you sure you want to delete the document?', function (button) {
            if (button === 'yes') {
                Ext.Ajax.request({
                    method: 'DELETE',
                    url: first.config.Config.remoteRestUrl + 'ecm/node/' + record.id,
                    success: function (response) {
                        let store = me.getView().getStore();
                        store.remove(record);
                        me.getView().unmask();
                    },
                    failure: function (response) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                        me.getView().unmask();
                    }
                });
            }
        });
    },

    isDeleteActionDisabled: function(){
        return !this.getViewModel().get('hasFiDocumentRequestDeletePermission');
    },

    load: function (fiDocumentRequestId) {
        let store = this.getView().getStore();

        if (!fiDocumentRequestId) {
            store.removeAll();
            this.getView().disable();
            return;
        }

        this.getViewModel().set('selectedFiDocumentRequestId', fiDocumentRequestId);
        this.getViewModel().set('enableTbarItems', !!fiDocumentRequestId);

        this.getView().enable();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/documentRequest/' + fiDocumentRequestId + '/documents');
        store.load();
    }

});