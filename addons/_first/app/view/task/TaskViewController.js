Ext.define('first.view.task.TaskViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.taskViewController',

    requires: [
        'first.config.Config',
        'first.util.ErrorHandlerUtil'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        this.getViewModel().set('taskFilter', {
            filterData: {
                assigned_to_me: "assignee='-me-'",
                active: "status='active'",
                completed: "status='completed'",
                any: "status='any'"
            },
            currentFilter: {
                assigned_to_me: true,
                active: true,
                completed: true
            }
        })
    },

    onFilterTaskButtonClick: function (component, e) {
        let taskFilter = this.getViewModel().get('taskFilter');
        taskFilter.currentFilter[component.key] = component.pressed;
        this.getViewModel().set('taskFilter', taskFilter);

        let isFilterValid = function () {
            let result = false;
            Ext.each(Object.keys(taskFilter.currentFilter), function (key) {
                if (taskFilter.currentFilter[key]) {
                    result = true;
                }
            });
            return result;
        };

        if (isFilterValid()) {
            let getFilterClause = function () {
                let checkStatus = !(taskFilter.currentFilter['active'] && taskFilter.currentFilter['completed']),
                    result = "(";

                if (!checkStatus) {
                    result += (taskFilter.filterData['any'] + " AND ");
                    if (taskFilter.currentFilter['assigned_to_me']) {
                        result += (taskFilter.filterData['assigned_to_me'] + " AND ");
                    }
                } else {
                    Ext.each(Object.keys(taskFilter.currentFilter), function (key) {
                        if (taskFilter.currentFilter[key]) {
                            result += (taskFilter.filterData[key] + " AND ");
                        }
                    });
                }

                return result + 'includeTaskVariables=true)';
            };

            let filterClause = getFilterClause();
            if (first.config.Config.conf) {
                this.filterGrid(filterClause.replace('-me-', first.config.Config.conf.properties.currentUser.id));
            }
        } else {
            component.setPressed(true);
            taskFilter.currentFilter[component.key] = true;
            this.getViewModel().set('taskFilter', taskFilter);
        }
    },

    renderStateColumn: function (x, y, record) {
        if (record) {
            let state = record.get('state');
            if (state) {
                let stateText = state;
                let color = 'black';

                switch (state) {
                    case 'claimed':
                        stateText = i18n.taskStateActive;
                        color = '#e09725';
                        break;
                    case 'completed':
                        stateText = i18n.taskStateCompleted;
                        color = '#18e011';
                        break;
                    default:
                        stateText = state;
                        color = '#e01616';
                }

                return Ext.String.format('<span style="color: {0};"><b>{1}</b></span>', color, stateText);
            }
        }
        return '<span></span>';
    },

    /**
     * @param {Ext.Component} component
     */
    onAfterStartNewTaskButtonRender: function (component) {

        if (first.config.Config.conf) {
            this.filterGrid("(status='any' and includeTaskVariables=true and assignee='" + first.config.Config.conf.properties.currentUser.id + "')");
        }

        let hiddenWorkflowKeys = (first.config.Config.conf.properties.documentRepositoryHiddenWorkflowKeys ? first.config.Config.conf.properties.documentRepositoryHiddenWorkflowKeys : []),
            menu = component.getMenu();
        if (menu && menu.items && menu.items.items) {
            Ext.each(menu.items.items, function (item) {
                menu.remove(item);
            });
        }

        let me = this;
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/process/definitions',
            method: 'GET',
            success: function (response) {

                let resultData = JSON.parse(response.responseText);

                Ext.each(resultData, function (rd) {

                    if ((!Ext.Array.contains(hiddenWorkflowKeys, rd.processDefinition.key)) && (rd.processDefinition.title || rd.processDefinition.name)) {
                        rd.text = (rd.processDefinition.title ? rd.processDefinition.title : rd.processDefinition.name);
                        rd.handler = 'onStartNewTaskItemSelect';

                        menu.add(rd);
                    }
                });

            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                component.setDisabled(false);
            }
        });
    },

    onStartNewTaskItemSelect: function (item) {
        if (item && item.processDefinition) {
            this.fireEvent('navChange', 'wfCreateNew/' + item.processDefinition.key);
        }
    },

    viewWorkflowActionClickHandler: function (grid, rowIndex, colIndex, item, e, record, row) {
        this.fireEvent('navChange', 'wfDetails/' + record.get('processId'));
    },

    viewTaskActionClickHandler: function (grid, rowIndex, colIndex, item, e, record, row) {
        this.fireEvent('navChange', 'taskItemView/' + record.id);
    },

    editTaskActionClickHandler: function (grid, rowIndex, colIndex, item, e, record, row) {
        this.fireEvent('navChange', 'taskItemEdit/' + record.id);
    },

    filterGrid: function (where) {
        let store = this.getView().getStore();
        store.getProxy().setExtraParam('where', where);
        store.reload();
    },

    openFiRegistry: function (grid, rowIndex, colIndex, item, e, record, row) {
        let fiRegistryId = record.get('fiRegistryId');
        if (fiRegistryId) {
            this.fireEvent('navChange', 'fi/' + fiRegistryId.replace('workspace://SpacesStore/', ''));
        }
    },

});
