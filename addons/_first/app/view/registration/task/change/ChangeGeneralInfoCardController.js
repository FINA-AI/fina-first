Ext.define('first.view.registration.task.change.ChangeGeneralInfoCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeGeneralInfoCard',

    requires: [
        'Ext.app.ViewModel',
        'first.config.Config',
        'first.view.registration.MetadataUtil'
    ],

    init: function () {
        let me = this,
            theFi = this.getViewModel().get('theFi');

        if (!me.getViewModel().get('isFormInitialized')) {
            me.initForm(theFi.nodeType);
        } else {
            me.fireEvent('getFiCall', theFi.id, function (obj) {
                me.getViewModel().set('theFi', obj);
            })
        }
    },

    initForm: function () {
        let me = this;

        Ext.suspendLayouts();

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + me.getViewModel().get('theFi')['fina_fiRegistryLastActionId'] + '/children',
            method: 'GET',
            success: function (response) {
                let data = JSON.parse(response.responseText).list.find(d => d.name === 'ORGANIZATIONAL_FORM_AND_NAME_CHANGE_DATA');

                let nodeType = data.nodeType;

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
                        let changedData = {};
                        Ext.Object.each(data.properties, function (key, val) {
                            let newKey = key.replace(':', '_');
                            changedData[newKey] = val
                        })

                        me.getViewModel().set('changedData', changedData);
                        me.getViewModel().set('currentData', {...changedData});
                        me.getViewModel().set('changeNodeId', data.id);
                        me.getViewModel().set('isDataSame', me.checkUnsavedChangesDetected());
                    }
                });
            }
        });
    },

    onSaveClick: function (comp, e, eOpts) {
        let me = this;
        me.getView().mask(i18n.pleaseWait);

        me.saveChanges(function (response) {
            delete response.id;
            delete response.nodeType;

            me.getViewModel().set('changedData', response);
            me.getViewModel().set('currentData', {...response});
            me.getViewModel().set('isDataSame', me.checkUnsavedChangesDetected());
            me.fireEvent('reloadFiRegistryStore');
            me.fireEvent('validateFiRegistryCall', me.getViewModel().get('theFi').id);
        });
    },

    saveChanges: function (success) {
        let me = this;
        let vm = this.getViewModel();
        let view = this.getView();

        success = success ? success : function () {
            view.unmask();
        }

        view.mask(i18n.pleaseWait);
        vm.get('fiProfileTaskController').putActionCall(vm.get('changeNodeId'), vm.get('changedData'), success, null, function () {
            me.getView().unmask();
        });
    },

    onGap: function () {
        let me = this;
        let action = this.getViewModel().get('fiAction');

        if (action['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            action.fina_fiRegistryActionPreviousStep = action.fina_fiRegistryActionStep;
            action.fina_fiRegistryActionStep = '0';

            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').updateActionTask(action.id, action,
                function (action, that) {
                    me.getViewModel().set('fiAction', action);
                    that.setActivateTab(action.fina_fiRegistryActionStep);
                },
                null,
                function () {
                    me.getView().unmask();
                });
        } else {
            me.getViewModel().get('fiProfileTaskController').setActivateTab(0);
        }
    },

    onGenerateReportCard: function () {
        let me = this;

        if (this.checkUnsavedChangesDetected()) {

            Ext.Msg.confirm(i18n.unsavedChangesMessage, i18n.saveChangesMessage,
                function (choice) {
                    if (choice === 'yes') {
                        me.saveChanges(function (response) {
                            me.changeTaskView();
                        })
                    }
                }
            );
        } else {
            me.changeTaskView()
        }
    },

    changeTaskView: function () {
        let me = this;
        let action = this.getViewModel().get('fiAction');


        action.fina_fiRegistryActionPreviousStep = action.fina_fiRegistryActionStep;
        action.fina_fiRegistryActionStep = '3';

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').updateActionTask(action.id, action,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                that.setActivateTab(action.fina_fiRegistryActionStep);
            },
            null,
            function () {
                me.getView().unmask();
            });
    },

    checkUnsavedChangesDetected: function () {
        let me = this,
            currentData = me.getViewModel().get('currentData'),
            changedData = me.getViewModel().get('changedData');

        return JSON.stringify(currentData) !== JSON.stringify(changedData);
    }

})
;
