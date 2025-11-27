Ext.define('first.view.task.WorkflowDetailsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.workflowDetailsViewController',

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
        let itemId = first.config.Config.historyTokenItemId();

        let me = this;
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/details/' + itemId,
            success: function (response) {
                let resultData = JSON.parse(response.responseText);
                me.getViewModel().set('workflowDetails', resultData);

                let fiRegistry = resultData.processMetaModel.processVariables.find(function (variable) {
                    return Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), variable.type);
                });

                if (fiRegistry) {
                    me.getViewModel().set('isFiRegistryAvailable', true);
                    me.getViewModel().set('relatedFiRegistry', fiRegistry.value.replace('workspace://SpacesStore/', ''));
                }

                me.initDetails(itemId);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    initDetails: function (processId) {
        let me = this,
            workflowHelper = new first.util.WorkflowHelper(),
            generalInfoPanel = this.lookupReference('workflowDetailsGeneralInfoPanel'),
            workflowDetails = this.getViewModel().get('workflowDetails'),
            startFormModelName = workflowDetails.startFormResourceKey ? workflowDetails.startFormResourceKey.replace(':', '_') : null,
            restrictedNames = first.util.WorkflowHelper.getHiddenFieldNamesArray(workflowDetails.processMetaModel.processStartForm, startFormModelName, true);

        first.util.WorkflowHelper.sortFormItems(workflowDetails.processMetaModel.processStartForm, startFormModelName);

        let tmpItems = [{
            fieldLabel: i18n.workflowDetailsCompleted,
            bind: {
                value: '{completed}'
            }
        }, {
            fieldLabel: i18n.workflowDetailsTitle,
            bind: {
                value: '{workflowDetails.title}'
            }
        }, {
            fieldLabel: i18n.workflowDetailsDescription,
            bind: {
                value: '{workflowDetails.description}'
            }
        }, {
            fieldLabel: i18n.workflowDetailsStartedBy,
            bind: {
                value: '{workflowDetails.processMetaModel.startUserId}'
            }
        }, {
            fieldLabel: i18n.workflowDetailsStartedAt,
            bind: {
                value: '{startedAt}'
            }
        }];

        Ext.each(workflowDetails.processMetaModel.processStartForm, function (startFormItem) {
            Ext.each(workflowDetails.processMetaModel.processVariables, function (variable) {
                if (startFormItem.title && variable.name === startFormItem.name && !Ext.Array.contains(restrictedNames, startFormItem.name)) {

                    if (startFormItem.dataType === 'd:date' && variable && variable.value) {
                        variable.value = Ext.Date.format(new Date(variable.value), first.config.Config.dateFormat);
                        startFormItem.dataType = 'd:text';
                    }

                    startFormItem.value = variable.value;

                    let generatedFormItem = workflowHelper.getFormItem(startFormItem, 'details', 'workflow', me.getViewModel());
                    tmpItems.push(generatedFormItem);
                }
            });
        });

        let formInputDataItems = first.util.WorkflowHelper.getSplittedFormItems(tmpItems);
        generalInfoPanel.add({
            items: formInputDataItems[0]
        }, {
            items: formInputDataItems[1]
        });

        let store = Ext.create('first.store.task.TaskItemStore');
        store.getProxy().url = first.config.Config.remoteRestUrl + "ecm/workflow/processes/" + processId + '/items';
        store.reload();

        let workflowTabPanel = Ext.create('Ext.tab.Panel', {
            defaults: {
                autoScroll: true
            },
            border: false
        });
        workflowTabPanel.add(Ext.create('first.view.task.TaskItemView', {
            iconCls: 'x-fa fa-copy',
            title: i18n.taskProcessItemsGridTitle,
            emptyText: i18n.taskProcessItemsGridEmptyText,
            border: false,
            store: store,
            tbar: null,
            bbar: null
        }));
        workflowTabPanel.add(this.getTasksGridPanel(workflowDetails.activeTasks, i18n.workflowDetailsActiveTasks, i18n.workflowDetailsActiveTasks + ' ...', 'x-fa fa-calendar-check'));
        workflowTabPanel.add(this.getTasksGridPanel(workflowDetails.completedTasks, i18n.workflowDetailsCompletedTasks, i18n.workflowDetailsCompletedTasks + ' ...', 'x-fa fa-calendar-minus'));
        workflowTabPanel.setActiveTab(0);

        this.lookupReference('workflowDetailsTabBarPanel').add(workflowTabPanel);
    },

    getTasksGridPanel: function (tasks, title, emptyText, icon) {
        if (tasks && tasks.length > 0) {

            let transform = function (timestamp) {
                if (timestamp) {
                    return timestamp / 1000 + '';
                }
                return timestamp;
            };

            Ext.each(tasks, function (task) {
                task.isWorkflowDetailsViewDisabled = true;

                task.startedAt = transform(task.startedAt);
                task.dueAt = transform(task.dueAt);
                task.endedAt = transform(task.endedAt);
            });
        }

        let store = Ext.create('Ext.data.Store', {
            model: 'first.model.task.TaskModel',
            data: tasks,
            sorters: [{
                property: 'startedAt',
                direction: 'DESC'
            }],
            proxy: {
                type: 'memory',
                enablePaging: false,
            }
        });

        return Ext.create('first.view.task.TaskView', {
            iconCls: icon,
            title: title,
            emptyText: emptyText,
            border: true,
            store: store,
            tbar: null,
            bbar: null
        });
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onViewProcessDiagramClick: function (component, e) {
        let view = this.getView(),
            workflowDetails = this.getViewModel().get('workflowDetails'),
            window = null;

        if (workflowDetails.activeTasks && workflowDetails.activeTasks.length > 0) {
            window = new first.util.WorkflowHelper().getProcessDiagramWindow(i18n.workflowDetailsViewProcessDiagram + ': ' + workflowDetails.description, workflowDetails.processMetaModel.id);
        } else {
            window = new first.util.WorkflowHelper().getProcessDefinitionDiagramWindow(i18n.workflowDetailsViewProcessDiagram + ': ' + workflowDetails.description, workflowDetails.processMetaModel.processDefinitionId);
        }

        view.mask(i18n.pleaseWait);
        window.show(true, function () {
            view.unmask();
        });
    },

    onViewFiRegistryClick: function () {
        let fiRegistry = this.getViewModel().get('relatedFiRegistry');
        if (fiRegistry) {
            this.fireEvent('navChange', 'fi/' + fiRegistry);
        }
    }
});
