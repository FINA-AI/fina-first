Ext.define('first.view.blacklist.BlacklistDocumentController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.blacklistDocument',

    listen: {
        controller: {
            '*': {
                refreshBlacklistItemDocuments: 'onRefreshClick'
            },
            'blacklist': {
                reloadBlacklistItemDocuments: 'load'
            }
        }
    },

    init: function () {
        this.getViewModel().set('enableTbarItems', false);

        let permissions = first.config.Config.conf['permissions'],
            hasAmendPermission = (permissions && Ext.Array.contains(permissions, 'net.fina.first.blacklist.amend')),
            hasDeletePermission = (permissions && Ext.Array.contains(permissions, 'net.fina.first.blacklist.delete'));
        this.getViewModel().set('hasAmendPermission', hasAmendPermission);
        this.getViewModel().set('hasDeletePermission', hasDeletePermission);
    },

    isDeleteActionDisabled: function(){
        return !this.getViewModel().get('hasDeletePermission');
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().getStore().reload();
    },

    onUploadClick: function () {
        let selectedBlackListItemId = this.getViewModel().get('selectedBlackListItemId');
        if (selectedBlackListItemId) {
            let window = Ext.create({xtype: 'fileuploadwindow'});
            window.getViewModel().set('folderNodeId', selectedBlackListItemId);
            window.getViewModel().set('isNewFile', true);
            window.getViewModel().set('uploadFinishCallbackEventFunctionName', 'refreshBlacklistItemDocuments');
            window.show();
        }
    },

    onDeleteClick: function (grid, r, c, btn, event, record) {
        let me = this;
        Ext.Msg.confirm(i18n.delete, i18n.blackListDocumentItemDeleteWarning, function (button) {
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

    onDownloadClick: function(grid, r, c, btn, event, record){
        window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + record.id + '/content?attachment=true');
    },

    load: function (blacklistItemId) {
        if (blacklistItemId) {
            this.getViewModel().set('selectedBlackListItemId', blacklistItemId);
            this.getViewModel().set('enableTbarItems', true);

            let store = this.getView().getStore();
            store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + blacklistItemId + '/children');
            store.load();
        }

    }

});