Ext.define('first.view.registration.FiProfileTaskController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiProfileTaskEcm',

    requires: [
        'first.config.Config',
        'first.util.ErrorHandlerUtil',
        'first.util.WorkflowHelper'
    ],

    required: [],

    listen: {
        controller: {
            '*': {
                updateActionTask: 'updateActionTask',
            }
        }
    },

    init: function () {
        this.initLayout();
        let lastProcessId = this.getViewModel().get('theFi').fina_fiRegistryLastProcessId;
        let actionId = this.getViewModel().get('theFi').fina_fiRegistryLastActionId;
        this.getViewModel().set('lastProcessId', lastProcessId);
        this.getViewModel().set('fiProfileTaskController', this);
        this.initSanctionedPeopleChecklistUpdatedStatus(actionId);
        this.getView().setLayout('card');
        this.setWorkflowVariables(lastProcessId);
        this.loadCurrentTask(lastProcessId);
        this.initRedactorAndController();
    },

    initLayout: function () {
        let actionType = this.getViewModel().get('theFi')['fina_fiActionType'],
            action = this.getViewModel().get('fiAction'),
            me = this;
        let registrationCards = [{
            reference: 'card-0',
            xtype: 'fiGapView'
        },
            {
                reference: 'card-1',
                xtype: 'generalCardView'
            },
            {
                reference: 'card-2',
                xtype: 'reportCardView'
            },
            {
                reference: 'card-3',
                xtype: 'controllerApproval',
            },
            {
                reference: 'card-4',
                xtype: 'controllerGap',
            },
            {
                reference: 'card-5',
                xtype: 'decreeView'
            }, {
                reference: 'card-6',
                xtype: 'fiFinalGapView'
            }];

        let changeCards = [
            {
                reference: 'card-0',
                xtype: 'changeGapCard'
            },
            {
                reference: 'card-1',
                xtype: action['fina_fiChangeFormType'] === 'organizationalForm' ? 'changeGeneralInfoCard' : 'changeGeneralCard'
            },
            {
                reference: 'card-2',
                xtype: 'changeSanctionedPeopleCard'
            },
            {
                reference: 'card-3',
                xtype: action['fina_fiChangeFormType'] === 'organizationalForm' ? 'changeReportCard' : 'changeApprovalLetterCard',
            },
            {
                reference: 'card-4',
                xtype: 'changeControllerGapCard',
            },
            {
                reference: 'card-5',
                xtype: 'changeControllerApprovalCard'
            }, {
                reference: 'card-6',
                xtype: action['fina_fiChangeFormType'] === 'organizationalForm' ? 'changeEditInfoDecreeCard' : 'changeApprovalLetterAndChangesCard'
            }, {
                reference: 'card-7',
                xtype: 'fiFinalGapView'
            }];

        let legalAddressChange = [
            {
                reference: 'card-0',
            },
            {
                reference: 'card-1',
                xtype: 'changeLegalAddressCard'
            },
        ];

        let cancellationCards = [
            {
                reference: 'card-0',
                xtype: 'cancellationGapCard'
            },
            {
                reference: 'card-1',
                xtype: 'cancellationGeneralCard'
            },
            {
                reference: 'card-2',
                xtype: 'cancellationControllerApprovalCard'
            },
            {
                reference: 'card-3',
                xtype: 'cancellationControllerGapCard'
            },
            {
                reference: 'card-4',
                xtype: action['fina_fiCancellationIsLiquidatorRequired'] ? 'cancellationDecreeCardLiquidatorView' : 'cancellationDecreeCardView'
            }, {
                reference: 'card-5',
                xtype: 'fiFinalGapView'
            }];

        let branchChangeCards = [
            {
                reference: 'card-0',
                xtype: 'branchChangeGapCard'
            },
            {
                reference: 'card-1',
                xtype: 'branchChangeGeneralCard'
            },
            {
                reference: 'card-2',
                xtype: 'branchChangeControllerApprovalCard'
            },
            {
                reference: 'card-3',
                xtype: 'branchChangeControllerGapCard'
            },
            {
                reference: 'card-4',
                xtype: 'branchChangeDecreeCard'
            },
            {
                reference: 'card-5',
                xtype: 'branchChangeRefusalCard'
            }, {
                reference: 'card-6',
                xtype: 'branchChangeFinalGapView'
            }];

        let documentWithdrawal = [
            {
                reference: 'card-0',
                xtype: 'documentWithdrawalReport'
            },
            {
                reference: 'card-1',
                xtype: 'documentWithdrawalControllerGapCard'
            },
            {
                reference: 'card-2',
                xtype: 'documentWithdrawalControllerApprovalView'
            },
            {
                reference: 'card-3',
                xtype: 'documentWithdrawalDecreeView'
            }];

        switch (actionType) {
            case 'REGISTRATION':
                me.getView().add(registrationCards);
                break;
            case 'CHANGE':
                if (action['fina_fiChangeFormType'] === 'legalAddress'){
                    me.getView().add(legalAddressChange);
                } else {
                    me.getView().add(changeCards);
                }
                break;
            case 'CANCELLATION':
                me.getView().add(cancellationCards);
                break;
            case 'BRANCHES_EDIT':
            case 'BRANCHES_CHANGE':
                me.getView().add(branchChangeCards);
                break;
            case 'DOCUMENT_WITHDRAWAL':
                me.getView().add(documentWithdrawal);
                break;
        }

    },

    actionTaskStepChange: function () {
        this.fireEvent('onActionTaskStepChange', this.getViewModel().get('theFi').id)
    },

    afterRender: function () {
    },

    loadCurrentTask: function (lastProcessId, callback) {
        let me = this;
        let whereParam = Ext.String.format("(status='active' and processId={0} and includeTaskVariables=true)", lastProcessId, first.config.Config.conf.properties.currentUser.id);

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + "ecm/workflow/tasks",
            params: {
                "where": whereParam,
            },
            method: 'GET',
            callback: function (options, success, response) {

                let taskDataItems = JSON.parse(response.responseText).list;
                if (taskDataItems && taskDataItems.length > 0) {

                    let taskDataItem = taskDataItems[0],
                        outcomePropertyItem = taskDataItem.taskVariables.filter(function (taskVariable) {
                            return taskVariable.name.indexOf("bpm_outcomePropertyName") > -1;
                        });
                    me.getViewModel().set('currentTaskId', taskDataItem.id);
                    me.getViewModel().set('outcomePropertyItem', outcomePropertyItem);


                    Ext.each(taskDataItem.taskForm, function (taskFormItem) {
                        if (taskFormItem.name === 'bpm_comment' || (taskFormItem.required && !taskFormItem.defaultValue && !Ext.Array.contains(first.config.Config.conf.properties.modelHiddenFieldNames, taskFormItem.name))) {

                            let bindingKey = 'currentTaskData.' + taskFormItem.name;
                            me.getViewModel().set(bindingKey, {
                                name: taskFormItem.name,
                                scope: 'local',
                                type: taskFormItem.dataType,
                            });

                            let formItemValue = taskDataItem.taskVariables.find(
                                function (form) {
                                    return form.name === taskFormItem.name;
                                }
                            );

                            if (formItemValue) {
                                me.getViewModel().set(bindingKey + '.value', formItemValue.value);
                            }
                        }
                    });

                    if (callback) {
                        callback(response);
                    }
                }
            }
        });
    },

    initTopBar: function (itemId) {
        this.getViewModel().set('currentTaskId', null);
        this.loadLastProcessTasks();
    },

    loadLastProcessTasks: function () {

        let processId = this.getViewModel().get('lastProcessId');

        if (processId) {
            let me = this,
                whereParam = Ext.String.format("(status='active' and processId={0} and includeTaskVariables=true and assignee='{1}')", processId, first.config.Config.conf.properties.currentUser.id),
                tbar = this.lookupReference('fiProfileViewTbar'),
                tasksPanel = this.lookupReference('fiProfileViewTbarTaskPanel');

            if (!tasksPanel) {
                tasksPanel = Ext.create('Ext.panel.Panel', {
                    reference: 'fiProfileViewTbarTaskPanel',
                    bodyStyle: {"background-color": "#f2efef"},
                    layout: 'hbox',
                    defaults: {
                        margin: 3
                    }
                });
            }
            tasksPanel.removeAll(true);
            this.getViewModel().set('currentTaskData', {});

            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + "ecm/workflow/tasks",
                params: {
                    "where": whereParam,
                },
                method: 'GET',
                callback: function (options, success, response) {

                    let taskDataItems = JSON.parse(response.responseText).list;
                    if (taskDataItems && taskDataItems.length > 0) {

                        let taskDataItem = taskDataItems[0],
                            outcomePropertyItem = taskDataItem.taskVariables.filter(function (taskVariable) {
                                return taskVariable.name.indexOf("bpm_outcomePropertyName") > -1;
                            });
                        me.getViewModel().set('currentTaskId', taskDataItem.id);

                        Ext.each(taskDataItem.taskForm, function (taskFormItem) {
                            if (taskFormItem.name === 'bpm_comment' || (taskFormItem.required && !taskFormItem.defaultValue && !Ext.Array.contains(first.config.Config.conf.properties.modelHiddenFieldNames, taskFormItem.name))) {

                                let bindingKey = 'currentTaskData.' + taskFormItem.name;
                                me.getViewModel().set(bindingKey, {
                                    name: taskFormItem.name,
                                    scope: 'local',
                                    type: taskFormItem.dataType,
                                });

                                let formItemValue = taskDataItem.taskVariables.find(
                                    function (form) {
                                        return form.name === taskFormItem.name;
                                    }
                                );

                                if (formItemValue) {
                                    me.getViewModel().set(bindingKey + '.value', formItemValue.value);
                                }

                                tasksPanel.add({
                                    xtype: 'textfield',
                                    emptyText: taskFormItem.title,
                                    inputAttrTpl: " data-qtip='" + taskFormItem.title + "' ",
                                    bind: {
                                        value: '{' + bindingKey + '.value}'
                                    }
                                });
                            }
                        });

                        if (outcomePropertyItem.length > 0) {
                            outcomePropertyItem = outcomePropertyItem[0];
                            outcomePropertyItem.value = outcomePropertyItem.value.replace(':', '_');

                            let outcomeFormItem = taskDataItem.taskForm.filter(function (taskFormItem) {
                                return taskFormItem.name.indexOf(outcomePropertyItem.value) > -1;
                            });

                            if (outcomeFormItem.length > 0) {
                                outcomeFormItem = outcomeFormItem[0];

                                Ext.each(outcomeFormItem.allowedValues, function (allowedValue) {
                                    tasksPanel.add({
                                        xtype: 'button',
                                        text: i18n[allowedValue] ? i18n[allowedValue] : allowedValue,
                                        meta: {
                                            name: outcomePropertyItem.value,
                                            scope: 'local',
                                            type: outcomeFormItem.dataType,
                                            value: allowedValue
                                        },
                                        handler: 'onSubmitActiveTaskButtonClick'
                                    });
                                });

                            }

                        } else {
                            tasksPanel.add({
                                xtype: 'button',
                                text: i18n.submit,
                                iconCls: 'x-fa fa-arrow-circle-up',
                                handler: 'onSubmitActiveTaskButtonClick'
                            });
                        }

                        tbar.add(tasksPanel);
                    }

                    Ext.Ajax.request({
                        url: first.config.Config.remoteRestUrl + 'ecm/fi/' + first.config.Config.historyTokenItemId(),
                        method: 'GET',
                        success: function (response) {
                            let data = JSON.parse(response.responseText);
                            let props = data.properties;
                            me.getViewModel().set('fiRegistryStatus', props['fina:fiRegistryStatus']);
                        }
                    });
                }
            });
        } else {
            this.initTopBar();
        }
    },

    onSubmitActiveTaskButtonClick: function (button) {

        let me = this,
            taskId = this.getViewModel().get('currentTaskId'),
            currentTaskData = this.getViewModel().get('currentTaskData'),
            view = this.getView(),
            jsonData = [];

        if (button.meta) {
            jsonData.push(button.meta);
        }

        if (currentTaskData) {
            Ext.Object.each(currentTaskData, function (key, value, myself) {
                jsonData.push(value);
            });
        }
        jsonData = jsonData.length > 0 ? jsonData : null;

        function loadLastProcessTasks() {
            me.onRefreshClick();
        }

        new first.util.WorkflowHelper().saveTask(view, taskId, jsonData, true, false, loadLastProcessTasks);
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.loadLastProcessTasks();
    },

    //TODO remove navigation
    showNext: function () {
        this.doCardNavigation(1);
    },

    showPrevious: function (btn) {
        this.doCardNavigation(-1);
    },

    doCardNavigation: function (incr) {
        var me = this.getView(),
            l = me.getLayout(),
            i = l.activeItem.reference.split('card-')[1],
            next = parseInt(i, 10) + incr;

        l.setActiveItem(next);

        me.down('#card-prev').setDisabled(next === 0);
        me.down('#card-next').setDisabled(next === 3);

    },

    setWorkflowVariables: function (processId) {
        let me = this;
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/variables/' + processId,
            success: function (response) {
                let resultData = JSON.parse(response.responseText);
                me.getViewModel().set('workflowVariables', resultData);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    setActivateTab: function (card) {
        let me = this.getView(),
            l = me.getLayout();

        l.setActiveItem(card);
    },

    updateActionTask: function (itemId, data, success, failure, callback) {
        this.putActionCall(itemId, data, success, failure, callback);
        this.fireEvent('onActionTaskStepChange', this.getViewModel().get('theFi').id)
    },

    putActionCall: function (itemId, data, success, failure, callback) {

        let me = this;
        let jsonData = {};
        Ext.Object.each(data, function (key, val) {
            if (key !== 'id') {
                jsonData[key.replace('_', ':')] = val;
            }
            if (jsonData['cm:versionLabel']) {
                delete jsonData['cm:versionLabel'];
            }
        });

        delete jsonData.nodeType;

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/' + itemId,
            jsonData: jsonData,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (response) {
                if (success) {
                    success(me.parseResponse(response), me)
                }
            },
            failure: function (response) {
                if (failure) {
                    failure(response, me)
                }
            },
            callback: function (options, success, response) {
                if (callback) {
                    callback(options, success, me.parseResponse(response), me)
                }
            }
        });
    },

    parseResponse: function (response) {
        let data = JSON.parse(response.responseText);

        let obj = {};

        let props = data.properties;
        obj.id = data.id;
        obj.nodeType = data.nodeType;

        Ext.Object.each(props, function (key, val) {

            if (key.endsWith("Date")) {
                // 2019-08-05T06:51:07.217+0000
                let d = Ext.Date.parse(val, 'c');
                val = Ext.Date.format(d, 'Y-m-d');
            }

            obj[key.replace(':', '_')] = val;
        });

        return obj;
    },


    initRedactorAndController: function () {
        let me = this;
        let vm = me.getViewModel();
        let fiId = vm.get('theFi').id;
        let redactorId = vm.get("theFi").fina_fiRegistryLastEditorId;
        let controllerId = vm.get("theFi").fina_fiRegistryLastInspectorId;

        let getPersonName = function (id, vmPropertyName) {
            if (id) {
                me.getPersonById(id, function (response) {
                    let result = JSON.parse(response.responseText);
                    if (result) {
                        let firstName = result.firstName;
                        let lastName = result.lastName;

                        firstName = firstName === "NONAME" || !firstName ? "" : firstName;
                        lastName = lastName === "NONAME" || !lastName ? "" : lastName;

                        vm.set(vmPropertyName, firstName === "" && lastName === "" ? result.id : firstName + " " + lastName);
                    }
                });
            }
        };

        if (!controllerId) {
            me.fireEvent('getFiCall', fiId, function (obj) {
                me.getViewModel().set('theFi', obj);
                getPersonName(obj.fina_fiRegistryLastEditorId, 'redactorName');
                getPersonName(obj.fina_fiRegistryLastInspectorId, 'controllerName');
            })
        } else {
            if (!vm.get("redactorName")) {
                getPersonName(redactorId, 'redactorName');
            }
            if (!vm.get("controllerName")) {
                getPersonName(controllerId, 'controllerName');
            }
        }
    },

    getPersonById: function (personId, callback) {
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/people/person/' + personId,
            success: callback
        });
    },

    initSanctionedPeopleChecklistUpdatedStatus: function (actionId) {
        let vm = this.getViewModel(),
            fi = vm.get('theFi');

        if (fi['fina_fiRegistryStatus'] === 'IN_PROGRESS' && fi['fina_fiActionType'] === 'REGISTRATION') {
            this.fireEvent('validateSanctionedPeopleChecklistModifiedStatusCall', fi.id, actionId, function (isSanctionedPeopleChecklistUpdated, isSanctionedPeopleChecklistIsFirstEntry) {
                vm.set('isSanctionedPeopleChecklistUpdated', isSanctionedPeopleChecklistUpdated);
                vm.set('isSanctionedPeopleChecklistFirstEntry', isSanctionedPeopleChecklistIsFirstEntry);
            }, function (response) {
                console.log(response);
                Ext.toast(i18n.registryDataValidationProgressError, i18n.error);
            });
        }
    },

    finishFiTask: function (fiRegistryId, finishBody, onSuccess, onFailure, callback) {
        let me = this;

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/'+fiRegistryId+'/finish',
            jsonData: finishBody,
            success: function (response) {
                let taskStore = Ext.getStore('taskStore');
                if (taskStore) {
                    taskStore.reload()
                }
                me.fireEvent('reloadFiRegistryStore')
                me.actionTaskStepChange();
                me.fireEvent('refreshProfileView',me.getViewModel().get('theFi').id);

                if (onSuccess) {
                    onSuccess();
                }
            },
            failure: function (response) {
                if (onFailure) {
                    console.log(response);
                    onFailure(response);
                } else {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            },
            callback: function () {
                if (callback) {
                    callback();
                }
            }
        })
    },

});
