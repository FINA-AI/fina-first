Ext.define('first.view.attestation.AttestationDocumentController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.attestationDocuments',

    listen: {
        controller: {
            '*': {
                refreshAttestationDocuments: 'onRefreshClick'
            },
            'attestation': {
                reloadAttestationDocuments: 'load'
            }
        }
    },

    init: function () {
        this.getViewModel().set('enableTbarItems', false);

        let permissions = first.config.Config.conf['permissions'],
            hasAmendPermission = (permissions && Ext.Array.contains(permissions, 'net.fina.first.attestation.amend')),
            hasDeletePermission = (permissions && Ext.Array.contains(permissions, 'net.fina.first.attestation.delete'));
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
        let selectedAttestationItemId = this.getViewModel().get('selectedAttestationItemId');
        if (selectedAttestationItemId) {
            let window = Ext.create({xtype: 'fileuploadwindow'});
            window.getViewModel().set('folderNodeId', selectedAttestationItemId);
            window.getViewModel().set('isNewFile', true);
            window.getViewModel().set('uploadFinishCallbackEventFunctionName', 'refreshAttestationDocuments');
            window.show();
        }
    },

    onDeleteClick: function (grid, r, c, btn, event, record) {
        let me = this;
        Ext.Msg.confirm(i18n.delete, i18n.documentsUploadDeleteWarning, function (button) {
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

    load: function (attestationItemId) {
        if (attestationItemId) {
            this.getViewModel().set('selectedAttestationItemId', attestationItemId);
            this.getViewModel().set('enableTbarItems', true);

            let store = this.getView().getStore();
            store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + attestationItemId + '/children');
            store.load();
        }

    }

});