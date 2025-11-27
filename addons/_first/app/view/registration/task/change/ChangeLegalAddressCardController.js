Ext.define('first.view.registration.task.change.ChangeLegalAddressCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeLegalAddressCard',


    init: function () {
        let me = this,
            theFi = this.getViewModel().get('theFi');

        if (!me.getViewModel().get('isFormInitialized')) {
            me.initForm();
        } else {
            me.fireEvent('getFiCall', theFi.id, function (obj) {
                me.getViewModel().set('theFi', obj);
            });
        }
    },

    initForm: function () {
        Ext.suspendLayouts();

        let me = this,
            prefix = me.getViewModel().get('theFi')['nodeType'].split(':')[0],
            nodeType = prefix + ':' + 'fiLegalAddressChange';

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + nodeType.replace(':', '_') + '/properties',
            method: 'GET',
            success: function (response) {
                // create form
                let metaDada = JSON.parse(response.responseText);
                let sequence = metaDada.find(d => d.name === (nodeType + 'Sequence')).constraints[0].parameters[0].allowedValues;
                let view = me.lookupReference('generalInfoForm');
                let vm = new Ext.app.ViewModel({data: {}});

                Ext.each(sequence, function (i) {
                    let field = metaDada.find(d => i === d.name);

                    if (field) {
                        let bindName = field.name.replace(':', '_');
                        let generatedFormItem = first.view.registration.MetadataUtil.getFormItemXType(field, bindName, vm);

                        generatedFormItem.labelWidth = 200;
                        generatedFormItem.bind = {
                            value: '{changedData.' + bindName + '}',
                            readOnly: '{(fiRegistryStatus !== "IN_PROGRESS") || !editMode}',
                        };
                        view.add(generatedFormItem);
                    }
                });

                me.getViewModel().set('isFormInitialized', true);
                Ext.resumeLayouts(true);

                // init data
                Ext.Ajax.request({
                    url: first.config.Config.remoteRestUrl + 'ecm/node/' + me.getViewModel().get('theFi')['fina_fiRegistryLastActionId'] + '/children',
                    method: 'GET',
                    success: function (response) {
                        let data = JSON.parse(response.responseText).list.find(d => d.name === 'LEGAL_ADDRESS_CHANGE_DATA');

                        let changedData = {};
                        Ext.Object.each(data.properties, function (key, val) {
                            let newKey = key.replace(':', '_');
                            changedData[newKey] = val
                        })

                        me.getViewModel().set('changedData', changedData);
                        me.getViewModel().set('changeNodeId', data.id);
                    }
                });
            }
        });
    },

    onSaveClick: function () {
        let me = this;
        me.saveChanges();
        me.fireEvent('validateFiRegistryCall', me.getViewModel().get('theFi').id);
    },

    saveChanges: function (success) {
        let me = this;
        let vm = this.getViewModel();
        let view = this.getView();

        success = success ? success : function () {
            view.unmask();
        }

        view.mask(i18n.pleaseWait);
        vm.get('fiProfileTaskController').putActionCall(vm.get('changeNodeId'), vm.get('changedData'), success, function (response) {
            first.util.ErrorHandlerUtil.detectFailureType(response, function () {
                view.unmask();
                vm.get('changedData')['fina_ignoreWarnings'] = true;
                me.saveChanges(success);
            }, function () {
                view.unmask();
            })
        });
    },

    onLegalAddressChangeSubmit: function () {
        let me = this;
        let approveTask = [{
            name: "fwf_fiRegistrationReviewOutcome",
            type: "d:text",
            value: "Approve",
            scope: "local"
        }];

        let finishBody = {
            preFinishVariables: approveTask,
            finishVariables: [],
            newProcessName: null,
        };

        me.saveChanges(function (result) {
            me.fireEvent('validateFiRegistryCall', me.getViewModel().get('theFi').id, function () {
                me.getViewModel().get('fiProfileTaskController').finishFiTask(me.getViewModel().get('theFi').id, finishBody, function () {
                    Ext.toast(i18n.changeFinishedSuccessfully, i18n.information);
                }, function () {
                    me.getView().unmask();
                });
            }, function () {
                me.getView().unmask();
            });
        });

    },

});
