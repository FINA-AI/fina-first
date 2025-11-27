Ext.define('first.view.registration.task.shared.EditorGapsGridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.editorGapsGrid',

    init: function () {
        this.getView().hide();
        this.load();
    },

    // afterRender: function () {
    //     this.load();
    // },

    load: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let store = this.getView().getStore();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=Gaps&orderBy=createdAt desc');
        store.load({
            callback: function (data) {
                if (data && data.length !== 0) {
                    me.getView().show();
                }
            }
        });
    },

    onRefreshClick: function () {
        this.load();
    }

});
