Ext.define('first.view.registration.history.registration.GapGridViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.gapGridViewController',

    init: function () {

    },

    load: function () {
        let actionId = this.getViewModel().get('fiRegistryActionId'),
            relativePath = this.getViewModel().get('relativePath'),
            store = this.getView().getStore();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=' + relativePath + '&orderBy=createdAt desc');
        store.load();
    },

    afterRender: function () {
        this.load();
    }

});