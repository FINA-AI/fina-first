/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.view.repository.CreateLibraryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.createlibrary',

    requires: [
        'first.config.Config'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },

    onCancel: function (component, e) {
        this.getView().destroy();
    },

    onSave: function (component, e) {
        let me = this;

        let submitData = this.getView().down('form').getValues();
        me.getView().mask('Please Wait..');

        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + "ecm/sites/",
            jsonData: submitData,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                me.fireEvent('refreshGrid', result['id']);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                me.getView().unmask();
                me.onCancel();
            }
        });
    }
});
