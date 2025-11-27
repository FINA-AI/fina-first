Ext.define('first.view.registration.task.documentWithdrawal.DocumentWithdrawalControllerGapCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.documentWithdrawalControllerGapCard',

    init: function () {},

    afterRender: function () {
        this.load();
    },

    load: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let store = this.lookupReference('controllerGapGridView').getStore();
        let gapType = 'fina:fiGap';

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=ControllerGaps&orderBy=createdAt desc');
        store.load();


        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + gapType.replace(':', '_') + '/properties',
            method: 'GET',
            callback: function (options, success, response) {
                let metaDada = JSON.parse(response.responseText),
                    hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(gapType, metaDada);

                me.getViewModel().set('gapMetaDada', metaDada);
                me.getViewModel().set('gapHiddenProperties', hiddenProperties);
            }
        });
    },

    onSendGap: function(){
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionControlStatus = 'DECLINED';
        data.fina_fiRegistryActionStep = '0';

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').updateActionTask( data.id, data,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                me.getViewModel().getParent().set('fiAction', action);
                me.getViewModel().set('showTaskStatusMessage', true);
                me.lookupReference('controllerGapGridView').getStore().load();
            },
            null,
            function () {
                me.getView().unmask();
            }
        );
        me.getViewModel().get('fiProfileTaskController').initRedactorAndController();
    },

    onBack: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionStepController = '2';

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                that.setActivateTab(action.fina_fiRegistryActionStepController);
            },
            null,
            function () {
                me.getView().unmask();
            });
    },

    onAddClick: function () {
        this.addOrEdit({});
    },

    onEditClick: function (view, recIndex, cellIndex, item, e, record) {
        let data = {};
        Ext.Object.each(record.data.properties, function (key, val) {
            data[key.replace(':', '_')] = val;
        });

        this.addOrEdit(data, record);
    },

    addOrEdit: function (model, record) {
        let me = this;
        let store = me.lookupReference('controllerGapGridView').getStore();
        me.getViewModel().set('store', store);
        me.getViewModel().set('model', model);
        me.getViewModel().set('record', record);
        me.getViewModel().set('relativePath', 'ControllerGaps');

        let window = Ext.create({
            xtype: 'createGapWindow',
            viewModel: {
                data: me.getViewModel().data
            }
        });

        window.show();
    },

    onRemoveClick: function (view, recIndex, cellIndex, item, e, record) {
        let me = this;
        let store = this.lookupReference('controllerGapGridView').getStore();
        let storeUrl = store.proxy.getUrl();
        Ext.MessageBox.confirm(i18n.confirm, i18n.removeConfirmQuestion, function (btn) {
            if (btn === 'yes') {
                store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/');
                me.getView().mask(i18n.pleaseWait);
                store.remove(record);
                store.sync({
                    callback: function () {
                        store.proxy.setUrl(storeUrl);
                        me.getView().unmask();
                    }
                });
            }
        });
    },

    objectRenderer:function (content, cell, record) {
        return this.generalRenderer(record,'fina:fiGapObject');
    },

    reasonRenderer: function (content, cell, record) {
        return this.generalRenderer(record, 'fina:fiGapReason');
    },

    generalRenderer:function (record, fieldName) {
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

    disableEdit: function (view, rowIndex, colIndex, item, record) {
        return (record.get('fina_fiGapObject') === "Questionnaire") || (record.get("fina_fiGapCorrectionStatus")) || this.getViewModel().get('isDeclined');
    },

    disableRemove: function (view, rowIndex, colIndex, item, record) {
        return this.getViewModel().get('isDeclined');
    }

});
