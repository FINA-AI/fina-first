Ext.define('first.view.registration.task.shared.GapsForRedactorGridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.gapsForRedactorGrid',

    init: function () {
        this.getViewModel().set('isGridHidden', true);
        this.getViewModel().set('currentUser', first.config.Config.conf.properties.currentUser.id);
        this.getViewModel().set('isCurrentUserController', first.config.Config.conf.properties.currentUser.id === this.getViewModel().get('theFi').fina_fiRegistryLastInspectorId)
    },

    afterRender: function () {
        this.load();
    },

    load: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let store = this.getView().getStore();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=ControllerGaps&orderBy=createdAt desc');
        store.load({
            callback: function (data) {
                if (data && data.length !== 0) {
                    me.getViewModel().set('isGridHidden', false)
                }
            }
        });
    },

    onCorrected: function (view, recIndex, cellIndex, item, e, record) {
        this.updateCorrectionStatus(record, 'CORRECTED')
    },

    onNotCorrected: function (view, recIndex, cellIndex, item, e, record) {
        this.updateCorrectionStatus(record, 'NOT_CORRECTED')
    },

    onErase: function (view, recIndex, cellIndex, item, e, record) {
        this.updateCorrectionStatus(record, null);
    },

    updateCorrectionStatus: function (record, status) {
        let me = this;
        let store = this.getView().getStore();
        let storeUrl = store.proxy.getUrl();

        let model = {};
        model['fina:fiGapCorrectionStatus'] = status;

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/');
        record.set('properties', model);

        store.sync({
            callback: function () {
                store.proxy.setUrl(storeUrl);
                store.load();
            }
        });
    },

    objectRenderer: function (content, cell, record) {
        return this.generalRenderer(record, 'fina:fiGapObject');
    },

    reasonRenderer: function (content, cell, record) {
        return this.generalRenderer(record, 'fina:fiGapReason');
    },

    generalRenderer: function (record, fieldName) {
        let status = record.data.properties['fina:fiGapCorrectionStatus'];
        let value = record.get('properties')[fieldName];
        let translatedValue = i18n[value] ? i18n[value] : value;

        switch (status) {
            case 'CORRECTED':
                return '<div style="color: green">' + translatedValue + '</div>';
            case 'NOT_CORRECTED':
                return '<div style="color: red">' + translatedValue + '</div>';
            default:
                return translatedValue;
        }
    },

    isDisabled: function () {
        // return true;
        // debugger
        return !this.getViewModel().get('isDeclined') || this.getViewModel().get('isController') || !this.getViewModel().get('isRegistryActionEditor');
    }
});
