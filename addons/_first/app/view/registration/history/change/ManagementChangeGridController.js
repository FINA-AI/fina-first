Ext.define('first.view.registration.history.change.ManagementChangeGridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.managementChangeGridController',

    init: function () {

    },

    load: function () {
        let actionId = this.getViewModel().get('fiRegistryActionId'),
            store = this.getView().getStore();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=Performed Changes&orderBy=createdAt desc');
        store.load();
    },

    afterRender: function () {
        this.load();
    }

});