Ext.define('first.view.registration.FiProfileDocumentationEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.documentationEditControllerEcm',

    listen: {},

    init: function () {

    },

    onEditorAfterRender: function () {
        let me = this,
            fileId = this.getViewModel().get('fileId'),
            fileName = this.getViewModel().get('fileName');

        me.getView().mask(i18n.pleaseWait);
        this.getViewModel().set('title', i18n[fileName] || fileName);

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + "ecm/node/" + fileId + "/content?attachment=true",
            success: function (response) {
                console.log(response);
                me.getViewModel().set('fileContent', response.responseText);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                me.getView().unmask();
            }
        });
    },

    onSaveFileContentClick: function (button) {
        let me = this,
            view = this.getView(),
            vm = this.getViewModel();

        view.mask(i18n.pleaseWait);

        let fd = new FormData();
        fd.append('filedata', vm.get('fileContent'));
        fd.append('majorVersion', "false");

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + vm.get('fileId') + '/upload/',
            rawData: fd,
            headers: {'Content-Type': null},
            success: function (response) {
                console.log(response);
                me.fireEvent('refreshGrid');
                me.getView().destroy();
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                if (view) {
                    view.unmask();
                }
            }
        });
    },

    onCancelClick: function () {
        this.getView().destroy();
    }

});
