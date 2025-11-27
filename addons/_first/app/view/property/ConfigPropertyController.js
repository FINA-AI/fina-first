Ext.define('first.view.property.PropertyController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.configPropertyController',

    requires: [
        'Ext.app.ViewModel'
    ],

    init: function () {
        let me = this;
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/config/properties/configFolder',
            success: function (response) {
                let result = JSON.parse(response.responseText);
                me.getViewModel().set('configFolderNode', result);
            },
            failure: function (response) {
                console.log(response);
            }
        });
    },

    onAddClick: function () {
        let grid = this.getView(),
            store = grid.getStore();
        let model = new first.model.property.ConfigPropertyModel;
        store.insert(0, {});
    },

    onEditClick: function (editor, event, eOpts) {
        let me = this;

        let record = event.record;
        if (!record.get('parentId')) {
            record.set('parentId', me.getViewModel().get('configFolderNode').id);
        }
        let properties = {
            'fina:propertyValue': record.get('fina_propertyValue')
        };
        record.set('properties', properties);

        event.store.sync();
    },

    onDeleteClick: function () {
        let me = this;
        let grid = this.getView(),
            store = grid.getStore(),
            selectedProperty = me.getViewModel().get('selectedProperty');
        store.remove(selectedProperty);
        store.sync();
    },

    onRefreshCacheCLick: function () {
        let me = this;
        me.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + 'ecm/config/properties/sync',
            success: function (response) {
                Ext.toast(i18n.configCacheRestartedSuccesfully,  i18n.configInformation);
            },
            failure: function (response) {
                Ext.toast(i18n.configErrorRestartingCache, i18n.configError);
                console.log(response);
            },
            callback: function () {
                me.getView().unmask();
            }
        })
    }

});
