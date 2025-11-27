Ext.define('first.view.licensetype.LicenseTypeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.licenseTypeController',

    requires: [
        'Ext.app.ViewModel'
    ],

    onEnterPress: function (me, e) {
        if (e.keyCode === 13) {
            let store = Ext.getStore('licenseType');
            store.getProxy().setExtraParams({'query': me.value});
            store.proxy.setHeaders({'Accept-Language': '*'});
            store.load();
        }
    },

    onAddClick: function () {
        let window = Ext.create('first.view.licensetype.LicenseTypeEditView', {
            viewModel:{data:{'record': {}}}
        });    
        window.show();
    },

    onEditClick: function (view, rowIndex, colIndex, item, e, record) {
       let window = Ext.create('first.view.licensetype.LicenseTypeEditView', {
            viewModel:{data:{'record':record,'isEdit':true}}
        });
        window.show();
    },

    onRemoveClick: function (view, rowIndex, colIndex, item, e, record) {
        let store = this.getView().getStore(),
            me = this;

        me.getView().mask(i18n.pleaseWait);

        store.remove(record);
        store.sync({
            success: function () {
                store.load();
                me.getView().unmask();
            },

            failure: function () {
                me.getView().unmask()
            }
        });
    },
});
