/**
 * Created by oto on 26.04.20.
 */
Ext.define('first.view.repository.share.ShareLinkViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sharelinkview',

    /**
     * Called when the view is created
     */
    init: function () {
    },


    onShare: function (component, e) {
        let me = this,
            selectedDocument = me.getViewModel().get('selectedDocument'),
            expireDate = me.getViewModel().get('expireDate'),
            isFileShared = me.getViewModel().get('isFileShared');
        selectedDocument.get('properties')['qshare:expiryDate'] = expireDate;
        me.getView().mask(i18n.pleaseWait);
        if (!isFileShared) {

            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/share',
                method: 'POST',
                jsonData: {
                    nodeId: selectedDocument.get('id'),
                    expiresAt: expireDate ? new Date(expireDate).getTime() : null
                },
                success: function (response) {
                    me.getView().destroy();
                    Ext.toast("Document Shared to everyone.", i18n.configInformation);
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        } else {

            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/share/' + selectedDocument.get('id'),
                method: 'PUT',
                jsonData: {
                    properties: {
                        'qshare:expiryDate': expireDate ? new Date(expireDate).getTime() : null
                    }
                },
                success: function (response) {
                    me.getView().destroy();
                    Ext.toast("Document Shared to everyone.", i18n.configInformation);
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        }
    },


    onCancel: function (component, e) {
        this.getView().destroy();
    },

    onChangeExpiresOnToggle: function (component, newValue, oldValue) {
        this.getViewModel().set('enabledExpiresOn', newValue);
    }
});