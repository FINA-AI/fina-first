Ext.define('first.view.new.dashboard.DashboardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.appDashboard',

    requires: [
        'Ext.app.ViewController',
        'Ext.panel.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'first.config.Config',
        'first.store.registration.FiRegistry',
        'first.view.new.dashboard.widget.FilterFiRegistryWidget',
        'first.view.new.dashboard.wizard.FiTaskWizardModel',
        'first.view.new.dashboard.wizard.FiTaskWizardView'
    ],

    listen: {
        controller: {
            '*': {
                filterFiRegistry: 'filterFiRegistry',
            },
            'newmain': {
                downloadUserManual: 'downloadUserManual'
            }
        }
    },

    init: function () {
        this.initTaskStatistic();
    },

    initTaskStatistic: function () {

        let taskStatisticItems = this.lookupReference('taskStatisticReference');

        let myActiveTasks = Ext.create({
            xtype: 'panel',
            layout: {
                align: 'stretch',
                pack: 'center',
                type: 'vbox'
            },
            items: [{
                xtype: 'filterFiRegistryWidget',
                data: {
                    title: i18n.dashboardWidgetQuickFiltersMyActiveTasksTitle,
                    dependsOnFiType: false,
                    filter: {
                        fiRegistryLastInspectorId: first.config.Config.conf.properties.currentUser.id,
                        status: ['IN_PROGRESS', 'GAP']
                    }
                }
            }]
        })

        let myStartedTasks = Ext.create({
            xtype: 'panel',
            layout: {
                align: 'stretch',
                pack: 'center',
                type: 'vbox'
            },
            items: [{
                xtype: 'filterFiRegistryWidget',
                margin: '0',
                data: {
                    title: i18n.dashboardWidgetQuickFiltersMyStartedTasksTitle,
                    dependsOnFiType: false,
                    filter: {
                        fiRegistryLastEditorId: first.config.Config.conf.properties.currentUser.id,
                        status: ['IN_PROGRESS', 'GAP']
                    }
                }
            }],
            margin: 0
        })

        taskStatisticItems.add(myActiveTasks);
        taskStatisticItems.add(myStartedTasks);
    },

    onConfClick: function () {
        this.fireEvent('navChange', 'questionnaire');
    },

    fiRegistrationLinkClick: function () {
        this.initFiProcessWizardWindow('FI_REGISTRATION');
    },

    fiCancellationLinkClick: function () {
        this.initFiProcessWizardWindow('FI_DISABLE');
    },

    fiChangeLinkClick: function () {
        this.initFiProcessWizardWindow('FI_CHANGE');
    },

    initFiProcessWizardWindow: function (processType) {
        let viewModel = Ext.create('first.view.new.dashboard.wizard.FiTaskWizardModel', {
                data: {
                    processType: processType
                }
            }),
            wizard = Ext.create('first.view.new.dashboard.wizard.FiTaskWizardView', {
                viewModel: viewModel
            });

        wizard.show();
    },

    onSearchKeyPress: function (textfield, op) {
        if (op.getCharCode() === Ext.EventObject.ENTER && textfield.isValid()) {
            this.searchFiRegistry(textfield);
        }
    },

    searchFiRegistry: function (textfield, displaySimplifiedRegistry) {
        let registryGrid = Ext.getCmp('actionListEcmId');
        let queryValue = textfield.value;
        if (!registryGrid) {
            let externalData = {
                query: queryValue,
                displaySimplifiedRegistry: displaySimplifiedRegistry
            };
            this.fireEvent('navChange', 'fis/' + encodeURIComponent(JSON.stringify(externalData)));
        } else {
            this.fireEvent('navChange', 'fis');
            this.fireEvent('searchFiRegistryStore', queryValue);
        }
    },

    filterFiRegistry: function (filter, displaySimplifiedRegistry) {
        let registryGrid = Ext.getCmp('actionListEcmId');
        if (!registryGrid) {
            let externalData = {
                filter: filter,
                displaySimplifiedRegistry: displaySimplifiedRegistry
            };
            this.fireEvent('navChange', 'fis/' + encodeURIComponent(JSON.stringify(externalData)));
        } else {
            this.fireEvent('navChange', 'fis');
            this.fireEvent('filterFiRegistryStore', filter);
        }
    },

    downloadUserManual: function () {
        let me = this,
            userManualDocument = me.getViewModel().get('userManualDocument');

        if (!userManualDocument) {
            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/dashboard/userManual',
                method: 'GET',
                success: function (response) {
                    let resultData = JSON.parse(response.responseText);
                    if (resultData) {
                        me.getViewModel().set('userManualDocument', resultData);
                        me.downloadOrPreviewDocument(resultData);
                    }
                }
            });
        } else {
            me.downloadOrPreviewDocument(userManualDocument);
        }
    },

    downloadOrPreviewDocument: function (node) {
        let mimeType = node.content.mimeType,
            nodeId = node.id;
        if (mimeType.includes('pdf')) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + nodeId + '/content/preview?attachment=false', '_blank');
        } else {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + nodeId + '/content?attachment=true');
        }
    },

});
