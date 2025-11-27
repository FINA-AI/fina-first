Ext.define('first.view.registration.FiProfileDescriptionController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiProfileDescriptionEcm',

    required: [
        'first.model.FiRegistrationModel',
        'first.util.Image',

    ],

    listen: {
        controller: {
            'fiProfileEcm': {
                refresh: 'onRefresh',
                saveFiDetail: 'onSaveClick'
            }
        }
    },

    init: function () {
        let me = this,
            data = me.getViewModel().get('theFi');

        if (!me.getViewModel().get('isFormInitialized')) {
            me.initForm(data.nodeType);
        } else {
            me.fireEvent('getFiCall', data.id, function (obj) {
                me.getViewModel().set('theFi', obj);
            })
        }
        this.getViewModel().set('generalTabIsSelected', false);
    },

    initForm: function (dataType) {
        let me = this;
        Ext.suspendLayouts();

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + dataType.replace(':', '_') + '/properties',
            method: 'GET',
            callback: function (options, success, response) {

                let metaDada = JSON.parse(response.responseText),
                    hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(dataType, metaDada),
                    left = me.lookupReference('leftColumn'),
                    right = me.lookupReference('rightColumn'),
                    half = (metaDada.length - hiddenProperties.length) / 2,
                    index = 0;

                Ext.each(metaDada, function (i) {

                    if (hiddenProperties.indexOf(i.name) < 0) {

                        let view = right;
                        if (index <= half) {
                            view = left;
                        }
                        index++;

                        let bindName = i.name.replace(':', '_'),
                            generatedFormItem = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, me.getViewModel());

                        generatedFormItem.labelWidth = 200;
                        generatedFormItem.bind = {
                            value: '{theFi.' + bindName + '}'
                        };

                        if (me.getViewModel().get('fiRegistryStatus') !== "IN_PROGRESS" && first.config.Config.conf.properties.currentUser.superAdmin) {
                            generatedFormItem.readonly = false;
                        } else {
                            generatedFormItem.bind.readOnly = '{(fiRegistryStatus !== "IN_PROGRESS")||!editMode|| isChangeMode || isCancellationMode||(isChangeBranchMode && detail.name!=="Branches")}';
                        }

                        view.add(generatedFormItem);
                    }
                });

                me.getViewModel().set('isFormInitialized', true);
                Ext.resumeLayouts(true);

            }
        });

    },

    onRefresh: function () {
        this.init();
    },

    onSaveClick: function (comp, e, eOpts) {
        let model = this.getViewModel().get('theFi'),
            me = this;

        let jsonData = {};
        Ext.Object.each(model, function (key, val) {
            if (key !== 'id') {
                jsonData[key.replace('_', ':')] = val;
            }
        });

        delete jsonData.nodeType;

        if (me.getView()) {
            me.getView().mask(i18n.pleaseWait);
        }
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/' + model.id,
            jsonData: jsonData,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (response) {
                me.onRefresh();
                me.fireEvent('reloadFiRegistryStore');

                me.fireEvent('validateFiRegistryCall', model.id, null, null, null);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                if (me.getView()) {
                    me.getView().unmask();
                }
            }
        });
    },

    onHistoryClick: function (comp, e, eOpts) {
        let model = this.getViewModel().get('theFi');

        let window = Ext.create('first.view.registration.FiProfileHistoriesView', {
            viewModel: {
                data: {
                    recordId: model.id,
                    recordType: model.nodeType
                }
            }
        });
        window.show();
    },

    statusRenderer: function (value) {
        switch (value) {
            case 'ACCEPTED':
                return '<div style="font-weight: bold; color: green">ACCEPTED</div>';
            case 'DECLINED':
                return '<div style="font-weight: bold; color: red">DECLINED</div>';
            case 'CANCELED':
                return '<div style="font-weight: bold; color: red">CANCELED</div>';
            case 'LIQUIDATION':
                return '<div style="font-weight: bold; color: grey">LIQUIDATION</div>';
        }
        return '<div style="font-weight: bold; color: blue">IN PROGRESS</div>';
    },

    onResize: function () {
        this.lookupReference('leftColumn').updateLayout();
        this.lookupReference('rightColumn').updateLayout();
    }
});
