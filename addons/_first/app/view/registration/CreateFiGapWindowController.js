Ext.define('first.view.registration.CreateFiGapWindowController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.createGapController',

    requires: [
        'first.config.Config',
        'first.model.repository.NodeModel',
        'first.view.registration.MetadataUtil'
    ],

    init: function () {
        let me = this;
        let viewModel = me.getViewModel(),
            metaDada = viewModel.get('gapMetaDada'),
            hiddenProperties = viewModel.get('gapHiddenProperties'),
            fiAction = viewModel.get('fiAction'),
            formItems = this.lookupReference('formItems');

        Ext.each(metaDada, function (i) {
            if (hiddenProperties.indexOf(i.name) < 0) {

                let bindName = i.name.replace(':', '_');
                let generatedFormItem = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, viewModel);
                switch (i.name) {
                    case 'fina:fiGapReason':
                        generatedFormItem.xtype = 'textarea';
                        generatedFormItem.maxHeight = 200;
                        generatedFormItem.height = 100;
                        break;
                    case 'fina:fiGapObject':
                        if (fiAction['fina_fiRegistryActionType'] === 'CANCELLATION') {
                            me.filterCancellationCombobox(generatedFormItem.store);
                        }
                        if (fiAction['fina_fiRegistryActionType'] === 'BRANCHES_CHANGE') {
                            me.removeItemsFromStore(generatedFormItem.store, ['Questionnaire', 'branch', 'stockroom', 'fi', 'beneficiary', 'authorizedPerson']);
                        } else {
                            me.removeItemsFromStore(generatedFormItem.store, ['Questionnaire']);
                        }
                        break
                }

                generatedFormItem.labelWidth = 200;
                generatedFormItem.bind = {
                    value: '{model.' + bindName + '}'
                };

                formItems.add(generatedFormItem);
            }
        });
    },


    onSaveClick: function () {
        let formItems = this.lookupReference('formItems');
        if (formItems.isValid()) {
            let me = this,
                model = this.getViewModel().get('model'),
                record = this.getViewModel().get('record'),
                store = this.getViewModel().get('store'),
                relativePath = this.getViewModel().get('relativePath');
            let properties = {};
            Ext.Object.each(model, function (key, val) {
                properties[key.replace('_', ':')] = val;
            });
            let storeUrl = store.proxy.getUrl();

            if (!record) {
                let nodeBodyModel = Ext.create('first.model.repository.NodeModel', {
                    nodeType: 'fina:fiGap',
                    relativePath: relativePath,
                    properties: properties,

                });

                nodeBodyModel.set('id', null);
                store.insert(0, nodeBodyModel);
            } else {
                store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/');
                Ext.Object.each(model, function (key, val) {
                    record.set({[key]: val}, {dirty: true});
                });

                // reset corrected status
                properties["fina:fiGapCorrectionStatus"] = "NOT_CORRECTED";
                properties["fina:fiGapCorrectionDate"] = null;
                properties["fina:fiGapCorrectionLetterNumber"] = null;
                properties["fina:fiGapCorrectionComment"] = null;

                record.set('properties', properties);
            }

            me.getView().mask(i18n.pleaseWait);


            store.sync({
                callback: function () {
                    store.proxy.setUrl(storeUrl);
                    me.getView().unmask();
                    store.load();
                    me.fireEvent('reloadGapsGrid', me.getViewModel().get('theFi')['fina_fiRegistryLastActionId'], ['fiFinalGapView']);
                    me.getView().destroy();
                }
            });


        } else {
            Ext.toast(i18n.formIsNotValid, i18n.warning);
        }
    },

    onCancelClick: function () {
        this.getView().destroy();
    },

    removeItemsFromStore: function (store, keys) {
        let indexes = [];
        Ext.each(store.data.items, function (item, i) {
            if (keys.indexOf(item.get('fina_fiGapObject')) >= 0) {
                indexes.push(i);
            }
        });

        for (let i = indexes.length - 1; i >= 0; i--) {
            store.data.items.splice(indexes[i], 1);
        }
    },

    filterCancellationCombobox: function (store) {
        let indexes = [];
        Ext.each(store.data.items, function (item, i) {
            if (item.get('fina_fiGapObject') !== 'other' && item.get('fina_fiGapObject') !== 'Refuse') {
                indexes.push(i);
            }
        });
        for (let i = indexes.length - 1; i >= 0; i--) {
            store.data.items.splice(indexes[i], 1);
        }
    },


});
