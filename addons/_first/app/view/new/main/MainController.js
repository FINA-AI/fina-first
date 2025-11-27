Ext.define('first.view.new.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.newmain',

    id: 'main',

    requires: [
        'first.config.Config',
        'first.config.Menu',
        'first.view.registration.FiRegistrationView',
        'first.view.task.TaskEditViewModel',
        'first.view.task.WorkflowCreateViewModel',
        'first.view.task.WorkflowDetailsViewModel',
        'first.view.task.WorkflowDetailsView',
        'first.view.dashboard.DashboardView',
        'first.view.new.dashboard.DashboardModel'
    ],

    listen: {
        controller: {
            '*': {
                openTab: 'onOpenTab',
                destroyCallerAndOpenTab: 'destroyCallerAndOpenTab',
                openFiProfileAndRefreshView: 'openFiProfileAndRefreshView',
                onAfterSubmitFiRegistryDetailCall: 'afterSubmitFiRegistryDetailCall'
            }
        }
    },

    init: function () {
        Ext.Ajax.setDefaultHeaders({
            'Accept-Language': first.config.Config.getLanguageCode(),
            'FINA-APP-NAME': 'FINA'
        });

        this.getView().mask(i18n.pleaseWait);

    },

    createModuleTab: function (id, cfg) {
        let tabs = this.lookupReference('main'),
            tab = tabs.items.getByKey(id.split('--')[0]),
            nonClosableViewId = this.getViewModel().get('nonClosableViewId'),
            isClosable = !(nonClosableViewId && nonClosableViewId === id);

        if (!tab) {
            cfg.itemId = id.split('--')[0];
            cfg.closable = isClosable;
            tab = tabs.add(cfg);
        }
        tab.getViewModel().set('tabId', id.replace(/--/g, '/').replace('-', '/'));

        tabs.setActiveTab(tab);
        this.getView().unmask();
    },

    //TODO add menu store
    onOpenTab: function (id, itemId, property, recordId) {
        switch (id) {
            case 'home':
            case 'questionnaire':
            case 'taskView':
            case 'repository':
            case 'tags':
            case 'attestations':
            case 'blacklistPage':
            case 'search':
            case 'organizationIndividualPage':
            case 'fiDocumentRequestPage':
                this.onViewTabById(id);
                break;
            case 'dashboardUserManual':
                this.onDownloadUserManual();
                break;
            case 'fi':
                this.onViewFi(itemId, property, recordId);
                break;
            case 'workflowDetails':
                this.onViewWorkflowDetails(itemId);
                break;
            case 'workflowCreateNew':
                this.onViewWorkflowCreateNew(itemId, property);
                break;
            case 'taskItemEdit':
                this.onViewTaskItemEdit(itemId);
                break;
            case 'taskItemView':
                this.onViewTaskItem(itemId);
                break;
            case 'repositoryItem':
                this.onViewRepositoryItem(itemId);
                break;
            case 'fis':
                this.onViewFis(id, property);
                break;
            case 'mfoDashboard':
            case 'fexDashboard':
            case 'leDashboard':
                this.onViewDashboard(id);
                break;
        }
    },

    onTabChange: function (tabPanel, newTab) {
        let id = newTab.getViewModel().get('tabId');
        this.fireEvent('navChange', id);
    },

    onViewTabById: function (id) {
        let menu = first.config.Menu.menuItem[id];
        this.createModuleTab(id, {
            xtype: menu.id,
            iconCls: menu.iconCls,
            viewModel: {
                data: {}
            }
        });
    },

    onViewFi: function (itemId, property, recordId) {
        itemId = itemId + (property ? '--' + property : '') + (recordId ? '--' + recordId : '');

        this.createModuleTab('fi-' + itemId, {
            xtype: 'fiProfileEcm',
            iconCls: 'x-fa fa-building',
            viewModel: {
                data: {}
            }
        });
    },

    onViewWorkflowDetails: function (itemId) {
        this.createModuleTab('wfDetails-' + itemId, {
            xtype: 'workflowDetails',
            iconCls: 'x-fa fa-cog',
            viewModel: 'workflowDetailsViewModel'
        });
    },

    onViewWorkflowCreateNew: function (itemId, property) {

        itemId = itemId + (property ? '--' + property : '');

        this.createModuleTab('wfCreateNew-' + itemId, {
            xtype: 'workflowCreate',
            iconCls: 'x-fa fa-cog',
            viewModel: 'workflowCreateViewModel'
        });
    },

    onViewTaskItemEdit: function (itemId) {
        this.createModuleTab('taskItemEdit-' + itemId, {
            xtype: 'taskEdit',
            iconCls: 'x-fa fa-edit',
            viewModel: Ext.create('first.view.task.TaskEditViewModel', {
                data: {
                    editable: true
                }
            })
        });
    },

    onViewTaskItem: function (itemId) {
        this.createModuleTab('taskItemView-' + itemId, {
            xtype: 'taskEdit',
            iconCls: 'x-fa fa-tasks',
            viewModel: 'taskEditViewModel'
        });
    },

    onViewRepositoryItem: function (itemId) {
        this.createModuleTab('repositoryItem-' + itemId, {
            xtype: 'repository',
            iconCls: 'x-fa fa-tasks',
            viewModel: {}
        });
    },

    destroyCallerAndOpenTab: function (callerView, id) {
        if (callerView) {
            callerView.mask(i18n.pleaseWait);
            callerView.destroy();
        }
        this.fireEvent('navChange', id);
    },

    openFiProfileAndRefreshView: function (callerView, id, registryId) {
        this.destroyCallerAndOpenTab(callerView, 'fi/' + id);
        this.fireEvent('refreshProfileView', registryId ? registryId : id);
        this.fireEvent('onActionTaskStepChange', registryId);
    },

    afterSubmitFiRegistryDetailCall: function (view, fiRegistry, fiRegistryActionId, fnOnValidationFail) {
        if (view) {
            view.mask(i18n.pleaseWait);
            view.destroy();
        }

        if (fiRegistry && (fiRegistry.fina_fiActionType === "REGISTRATION") && fiRegistry.fina_fiRegistryStatus === "IN_PROGRESS") {
            this.fireEvent('sanctionedPeopleChecklistUpdate', fiRegistryActionId ? fiRegistryActionId : fiRegistry.fina_fiRegistryLastActionId);
            this.fireEvent('validateFiRegistryCall', fiRegistry.id, null, fnOnValidationFail, null);
        }

        if (fiRegistry && fiRegistry.fina_fiActionType === "CHANGE" && fiRegistry.fina_fiRegistryStatus === "IN_PROGRESS") {
            this.fireEvent('changesListUpdated', fiRegistryActionId ? fiRegistryActionId : fiRegistry.fina_fiRegistryLastActionId);
            this.fireEvent('validateFiRegistryCall', fiRegistry.id, null, fnOnValidationFail, null);
        }

        if (fiRegistry && (fiRegistry.fina_fiActionType === "BRANCHES_CHANGE" || fiRegistry.fina_fiActionType === "BRANCHES_EDIT") && fiRegistry.fina_fiRegistryStatus === "IN_PROGRESS") {
            this.fireEvent('validateFiRegistryCall', fiRegistry.id, null, fnOnValidationFail, null);
            this.fireEvent('changesListUpdated', fiRegistryActionId ? fiRegistryActionId : fiRegistry.fina_fiRegistryLastActionId);
        }
    },

    onViewFis: function (id, property) {
        let filter = {};
        let query = null;
        let displaySimplifiedRegistry = false;
        if (property) {
            let externalData = JSON.parse(decodeURIComponent(property));
            filter = externalData.filter;
            query = externalData.query;
            displaySimplifiedRegistry = externalData.displaySimplifiedRegistry;
        }

        this.createModuleTab('fis', {
            xtype: 'fis',
            iconCls: 'x-fa fa-home',
            viewModel: {
                data: {
                    filter: filter,
                    query: query,
                    displaySimplifiedRegistry: displaySimplifiedRegistry
                }
            }
        });
    },

    onDownloadUserManual: function () {
        this.fireEvent('downloadUserManual');
    },

    onViewDashboard: function (id) {
        let menu = first.config.Menu.menuItem[id];
        this.createModuleTab(id, {
            xtype: 'dashboard',
            iconCls: menu.iconCls,
            viewModel: {
                data: {
                    fiType: menu.fiType,
                    title: menu.text
                }
            }
        });
    }

});
