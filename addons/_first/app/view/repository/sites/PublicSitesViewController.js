/**
 * Created by oto on 26.04.20.
 */
Ext.define('first.view.repository.sites.PublicSitesViewController', {
    extend: 'first.view.repository.sites.PrivateSitesController',
    alias: 'controller.publicsitesview',

    init: function () {
        this.getView().getStore().getProxy().setUrl(first.config.Config.remoteRestUrl + "ecm/sites/load/public");
        this.getView().getStore().load();
        this.callParent(arguments);
    },

    onBreadCrumbNavigationClick: function (component, node, prevNode) {
        this.callParent(arguments)
    },

    onCellClick: function (component, td, cellIndex, record, tr, rowIndex, e) {
        this.callParent(arguments)
    },

    showContextMenu: function () {
        var me = this;
        if (!me.getViewModel().get('isRoot')) {
            return this.callParent(arguments);
        }
    },


    noop: function (e) {
        e.stopEvent();
    },

    addDropZone: function (e) {
        this.callParent(arguments);
    },

    removeDropZone: function (e) {
        this.callParent(arguments);
    },

    drop: function (e) {
        this.callParent(arguments);
    }

});