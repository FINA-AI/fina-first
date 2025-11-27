/**
 * Created by oto on 22.06.20.
 */
Ext.define('first.view.organization.OrganizationDocumentController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.organizationDocument',

    init: function () {
        this.getViewModel().set('enableTbarItems', false);

        let permissions = first.config.Config.conf['permissions'],
            hasAmendPermission = (permissions && Ext.Array.contains(permissions, 'net.fina.first.organization.individual.registry.amend')),
            hasDeletePermission = (permissions && Ext.Array.contains(permissions, 'net.fina.first.organization.individual.registry.delete'));
        this.getViewModel().set('hasAmendPermission', hasAmendPermission);
        this.getViewModel().set('hasDeletePermission', hasDeletePermission);
    },

    listen: {
        controller: {
            organizationIndividual: {
                'reloadOrganizationDocuments': 'loadDocuments'
            },
            '*': {
                'reloadGrid': 'onRefreshClick'
            }
        }
    },

    onUploadClick: function () {
        let selectedBlackListItemId = this.getViewModel().get('selectedOrganizationId');

        if (selectedBlackListItemId) {
            let window = Ext.create({xtype: 'fileuploadwindow'});
            window.getViewModel().set('folderNodeId', selectedBlackListItemId);
            window.getViewModel().set('relativePath', "Attached Files");
            window.getViewModel().set('isNewFile', true);
            window.getViewModel().set('uploadFinishCallbackEventFunctionName', 'reloadGrid');
            window.show();
        }
    },

    isDeleteActionDisabled: function () {
        return !this.getViewModel().get('hasDeletePermission');
    },

    onRefreshClick: function () {
        this.getView().getStore().load();
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


    onDownloadClick: function (grid, r, c, btn, event, record) {
        window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + record.id + '/content?attachment=true');
    },

    loadDocuments: function (oraganizationRecordId) {
        if (oraganizationRecordId) {
            this.getViewModel().set('selectedOrganizationId', oraganizationRecordId);
            this.getViewModel().set('enableTbarItems', true);
            let store = this.getView().getStore();
            store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + oraganizationRecordId + '/children?relativePath=Attached Files');
            store.proxy.setExtraParams
            store.load();
        }
    }

});