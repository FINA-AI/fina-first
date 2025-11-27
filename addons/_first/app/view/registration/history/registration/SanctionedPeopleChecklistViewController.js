Ext.define('first.view.registration.history.registration.SanctionedPeopleChecklistViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.sanctionedPeopleChecklistViewController',

    requires: [
        'first.config.Config'
    ],

    init: function () {

    },

    load: function () {

        let actionId = this.getViewModel().get('fiRegistryActionId'),
            store = this.getView().getStore();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=Sanctioned People Checklist&orderBy=createdAt asc');
        store.load();
    },

    afterRender: function () {
        this.load();
    }

});