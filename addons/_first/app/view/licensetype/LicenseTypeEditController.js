Ext.define('first.view.licensetype.LicenseTypeEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.licenseTypeEditController',

    requires: [
        'first.config.Config',
        'first.model.licensetype.LicenseTypeModel',
        'Ext.app.ViewModel'
    ],

    onSaveButtonClick: function () {
        let me = this,
            record = me.getViewModel().get('record'),
            store = Ext.getStore('licenseType'),
            data = Ext.create('first.model.licensetype.LicenseTypeModel', {
                type: record['type'],
                name: record['name'],
                identifier: record['identifier'],
                documentNumber: record['documentNumber'],
                allowedOperations: record['allowedOperations']
            });

        me.getView().mask(i18n.pleaseWait);

        if (!this.getViewModel().get('isEdit')) {
            store.add(data);
        }

        store.sync({
            success: function () {
                store.load();
                me.getView().destroy();
            },

            failure: function () {
                me.getView().unmask();
            }
        });
    },

    onCancelButtonClick: function () {
        this.getView().close();
    },

    onClose: function () {
        Ext.getStore('licenseType').rejectChanges();
    }
});
