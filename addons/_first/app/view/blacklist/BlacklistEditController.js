Ext.define('first.view.blacklist.BlacklistEditController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.blacklistEdit',

    init: function () {
        let view = this.getView();

        view.setMaxHeight(Ext.getBody().getViewSize().height);

        view.setWidth(Ext.getBody().getViewSize().width - 120);

        if (view.height < Ext.getBody().getViewSize().height) {
            view.height = null;
        } else {
            view.setHeight(Ext.getBody().getViewSize().height - 120);
        }
        this.initForm();
        view.show();

    },

    initForm: function () {
        let me = this,
            metaData = this.getViewModel().get('properties'),
            hiddenProperties = this.getViewModel().get('hiddenProperties'),
            fieldList = [],
            left = me.lookupReference('leftColumn'),
            right = me.lookupReference('rightColumn');

        let visiblePropNames = metaData
            .map(item => {
                return {name: item.name, type: item.dataType}
            })
            .filter(item => !hiddenProperties.includes(item.name))
            .map(item => {
                return {name: item.name.replace(':', '_'), type: item.type}
            });

        Ext.each(metaData, function (i) {

            let bindName = i.name.replace(':', '_');
            let generatedFormItem = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, me.getViewModel(), 'model', visiblePropNames);
            generatedFormItem.name = bindName;

            if (generatedFormItem.bindField) {
                generatedFormItem.bind = {};
                generatedFormItem.bind[generatedFormItem.bindField] = '{model.' + bindName + '}';
            } else {
                generatedFormItem.bind = {
                    value: '{model.' + bindName + '}'
                };
            }
            generatedFormItem.labelWidth = 320;


            fieldList.push(generatedFormItem);
        });


        for (let i in fieldList) {
            let view = right;
            if (i < fieldList.length / 2) {
                view = left;
            }
            view.add(fieldList[i])
        }


    },

    onCancelBtnClick: function () {
        this.getView().close();
    },

    onSaveBtnClick: function (component, e) {
        let record = this.getViewModel().get('record'),
            isEdit = this.getViewModel().get('isEdit'),
            store = this.getViewModel().get('store'),
            model = this.getViewModel().get('model'),
            me = this,
            formItems = this.lookupReference('formItems');

        delete model.id;

        if (formItems.isValid()) {
            if (isEdit) {
                if (record) {
                    record.set(model);
                    record.dirty = true;
                }
            } else {
                store.insert(0, model)
            }
        }

        store.sync({
            success: function (batch, opts) {
                store.load();
                me.getView().close();
            },
            failure: function (batch, opts) {
                first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.fiTypeSaveError, batch);
                store.rejectChanges();
            }
        });
    },

    beforeClose: function (win) {
        this.getViewModel().get('store').rejectChanges();
    }

});