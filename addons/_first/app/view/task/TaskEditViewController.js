Ext.define('first.view.task.TaskEditViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.taskEditViewController',

    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Memory',
        'first.config.Config',
        'first.model.task.TaskItemModel',
        'first.model.task.TaskModel',
        'first.util.WorkflowHelper'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        let taskId = first.config.Config.historyTokenItemId();

        this.initTaskReassignInfo();

        this.getViewModel().set('taskId', taskId);

        let me = this;
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/tasks/' + taskId,
            success: function (response) {
                let resultData = JSON.parse(response.responseText);

                if (resultData.fiRegistryId) {
                    me.getViewModel().set('isFiRegistryAvailable', true);
                    me.getViewModel().set('relatedFiRegistry', resultData.fiRegistryId.replace('workspace://SpacesStore/', ''));
                }

                if (resultData.endedAt) {
                    me.getViewModel().set('editable', false);
                }

                let reassignable = resultData.taskVariables.find(taskVariable => taskVariable.name === 'bpm_reassignable');
                me.getViewModel().set('taskReassignInfo.isTaskReassignable', (reassignable && reassignable.value));

                me.initView(resultData);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    initView: function (taskItemData) {

        this.getView().mask(i18n.pleaseWait);

        let me = this,
            workflowHelper = new first.util.WorkflowHelper(),
            taskTabPanel = this.getTabPanel(taskItemData.id);

        me.getViewModel().set('title', (i18n[taskItemData.description] || taskItemData.description) + (taskItemData.state === 'completed' ? ' (' + i18n.submitted + ')' : ' (' + i18n.notSubmitted + ')'));
        me.getViewModel().set('selectedRecordData', taskItemData);

        let content = me.getFormItems(workflowHelper, taskTabPanel, taskItemData);
        let taskEditTabBarPanel = me.lookupReference('taskEditTabBarPanel'),
            taskEditPanel = me.lookupReference('taskEditPanel');

        if (content && content.length > 0) {
            me.getViewModel().set('taskEditPanelVisible', true);

            let formInputDataItems = first.util.WorkflowHelper.getSplittedFormItems(content);
            taskEditPanel.add({
                items: formInputDataItems[0]
            }, {
                items: formInputDataItems[1]
            });
        }

        taskTabPanel.setActiveTab(0);
        taskEditTabBarPanel.add(taskTabPanel);

        this.getView().unmask();
    },

    getTabPanel: function (taskId) {
        let taskItemStore = Ext.create('first.store.task.TaskItemStore');
        taskItemStore.getProxy().url = first.config.Config.remoteRestUrl + "ecm/workflow/tasks/" + taskId + '/items';
        taskItemStore.reload();

        let taskTabPanel = Ext.create('Ext.tab.Panel', {
            defaults: {
                autoScroll: true
            },
            border: false
        });

        let tabPanelItem = {
            reference: 'taskItems_' + taskId,
            scrollable: true,
            iconCls: 'x-fa fa-copy',
            title: i18n.taskItemsGridTitle,
            emptyText: i18n.taskItemsGridEmptyText,
            border: false,
            store: taskItemStore,
            bbar: null
        };

        if (!this.getViewModel().get('editable')) {
            tabPanelItem.tbar = null;
        }
        taskTabPanel.add(Ext.create('first.view.task.TaskItemView', tabPanelItem));

        return taskTabPanel;
    },

    getFormItems: function (workflowHelper, taskTabPanel, taskItem) {
        let me = this,
            viewModel = me.getViewModel(),
            formResourceKey = taskItem.formResourceKey,
            taskVariables = taskItem.taskVariables,
            taskFormItems = taskItem.taskForm,
            hiddenFieldNames = first.util.WorkflowHelper.getHiddenFieldNamesArray(taskFormItems, formResourceKey, true),
            taskGridsData = [],
            taskItems = [];

        first.util.WorkflowHelper.sortFormItems(taskFormItems, formResourceKey);

        Ext.each(taskFormItems, function (taskFormItem) {

            if (first.util.WorkflowHelper.isGriddable(taskFormItem.dataType) && !first.util.WorkflowHelper.isComboableDataType(taskFormItem.dataType)) {
                let rootFolderItem = me.getRootFolderItem(taskFormItems, taskFormItem.name);

                // init current variables
                let currentVariables = []; // TODO -> use filter
                Ext.each(taskVariables, function (taskVariable) {
                    if (taskVariable.name === taskFormItem.name) {
                        currentVariables.push(taskVariable);
                    }
                });

                Ext.each(taskVariables, function (taskVariable) {
                    if (taskVariable.name === rootFolderItem.name) {
                        taskGridsData.push({
                            variable: taskVariable,
                            formItem: taskFormItem,
                            currentValues: currentVariables,
                            root: rootFolderItem
                        });
                    }
                });
            } else if (taskFormItem.title && (!Ext.Array.contains(hiddenFieldNames, taskFormItem.name) || taskFormItem.name === 'fwf_reviewOutcome' || taskFormItem.name === 'wf_reviewOutcome')) {

                Ext.each(taskVariables, function (taskVariable) {
                    if (taskFormItem.name === taskVariable.name) {
                        taskFormItem.value = taskVariable.value;
                    }
                });

                let generatedTaskFormItem = workflowHelper.getFormItem(taskFormItem, 'task_' + taskItem.id, 'currentValues', viewModel, !taskFormItem.required);
                generatedTaskFormItem.readOnly = !viewModel.get('editable'); // TODO
                taskItems.push(generatedTaskFormItem);
            }

        });

        if (taskGridsData && taskGridsData.length > 0) {
            me.generateGridItem(taskTabPanel, taskGridsData, viewModel);
        }

        return taskItems;
    },

    generateGridItem: function (taskTabPanel, taskGridsData, viewModel) {

        Ext.each(taskGridsData, function (taskGridData, index) {

            let gridViewModel = Ext.create('first.view.task.TaskGridViewModel', {
                data: {
                    formItem: taskGridData.formItem,
                    rootFolderId: taskGridData.variable.value,
                    className: taskGridData.formItem.dataType.replace(':', '_'),
                    currentValues: taskGridData.currentValues,
                    taskId: viewModel.get('taskId'),
                    editable: viewModel.get('editable')
                }
            });

            taskTabPanel.add({
                title: taskGridData.formItem.title,
                layout: 'fit',
                items: Ext.create('first.view.task.TaskGridView', {
                    viewModel: gridViewModel
                })
            });
        });
    },

    getRootFolderItem: function (items, itemName) {
        let result = null;
        Ext.each(items, function (item) {
            if (item.name === itemName + 'RootFolder') {
                result = item;
            }
        });
        return result;
    },

    onCancelTaskEditClick: function () {
        this.getView().destroy();
    },

    onSubmitTaskClickHandler: function (button, e) {
        this.onSaveTaskClickHandler(button, e, true);
    },

    onSaveTaskClickHandler: function (button, e, isSubmit) {
        let panel = button.findParentByType('panel');
        if (isSubmit && !panel.down('form').isValid()) {
            return;
        }

        let selectedRecordData = this.getViewModel().get('selectedRecordData');
        let taskId = this.getViewModel().get('taskId');

        let currentTaskValues = (this.getViewModel().get('currentValues') ? this.getViewModel().get('currentValues')['task_' + taskId] : {});

        let jsonData = [];
        Ext.each(selectedRecordData.taskForm, function (taskFormItem) {
            Ext.each(Object.keys(currentTaskValues), function (key) {
                if (taskFormItem.name === key) {
                    jsonData.push({
                        name: key,
                        type: taskFormItem.dataType,
                        value: currentTaskValues[key],
                        scope: 'local'
                    });
                }
            });
        });

        this.saveActiveTask(taskId, jsonData, isSubmit);
    },

    saveActiveTask: function (taskId, jsonData, isSubmit) {
        let view = this.getView();
        this.getView().mask(i18n.pleaseWait);

        this.saveActiveTaskItems(taskId).then(function (context) {
            new first.util.WorkflowHelper().saveTask(view, taskId, jsonData, isSubmit, true);
        });
    },

    saveActiveTaskItems: function (taskId) {
        let taskItems = this.lookupReference('taskItems_' + taskId).getStore()
            .queryBy(function () {
                return true;
            })
            .getRange().map(function (pi) {
                return {id: pi.id}
            });

        return new Ext.Promise(function (resolve, reject) {
            if (taskItems && taskItems.length > 0) {
                let me = this;
                Ext.Ajax.request({
                    method: 'POST',
                    url: first.config.Config.remoteRestUrl + 'ecm/workflow/tasks/' + taskId + '/items',
                    jsonData: taskItems,
                    success: function (response) {
                        let resultData = JSON.parse(response.responseText);
                        resolve(resultData);
                    },
                    failure: function (response) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        });
    },

    onViewProcessClick: function () {
        let processId = this.getViewModel().get('selectedRecordData').processId;
        this.fireEvent('navChange', 'wfDetails/' + processId);
    },

    onViewFiRegistryClick: function () {
        let fiRegistry = this.getViewModel().get('relatedFiRegistry');
        if (fiRegistry) {
            this.fireEvent('navChange', 'fi/' + fiRegistry);
        }
    },

    onViewProcessDiagramClick: function () {
        let taskItemData = this.getViewModel().get('selectedRecordData'),
            view = this.getView(),
            window = null;

        if (taskItemData.endedAt) {
            window = new first.util.WorkflowHelper().getProcessDefinitionDiagramWindow(i18n.workflowDetailsViewProcessDiagram, taskItemData.processDefinitionId);
        } else {
            window = new first.util.WorkflowHelper().getProcessDiagramWindow(i18n.workflowDetailsViewProcessDiagram, taskItemData.processId);
        }

        view.mask(i18n.pleaseWait);
        window.show(true, function () {
            view.unmask();
        });
    },

    onReassignTaskClickHandler: function () {
        this.getViewModel().set('taskReassignInfo.isTaskReassignProgress', true);
    },

    onReassignTaskCancelClickHandler: function () {
        this.getViewModel().set('taskReassignInfo.isTaskReassignProgress', false);
        this.getViewModel().set('taskReassignInfo.taskReassignUser', null);
    },

    onReassignTaskSubmitClickHandler: function () {
        let me = this,
            taskId = this.getViewModel().get('taskId'),
            reassignUser = this.getViewModel().get('taskReassignInfo.taskReassignUser');

        if (reassignUser) {
            this.getView().mask(i18n.pleaseWait);

            let jsonData = {
                "assignee": reassignUser
            };

            Ext.Ajax.request({
                method: 'PUT',
                url: first.config.Config.remoteRestUrl + 'ecm/workflow/tasks/' + taskId + '?select=assignee',
                jsonData: jsonData,
                success: function (response) {
                    let taskStore = Ext.getStore('taskStore');
                    if (taskStore) {
                        taskStore.reload();
                    }

                    me.getViewModel().set('editable', false);
                    me.initTaskReassignInfo();
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                },
                callback: function () {
                    me.getView().unmask();
                }
            });
        }
    },

    initTaskReassignInfo: function () {
        let reassignInfo = {
            isTaskReassignable: false,
            isTaskReassignProgress: false,
            taskReassignUser: null
        };

        this.getViewModel().set('taskReassignInfo', reassignInfo);
    }

});
