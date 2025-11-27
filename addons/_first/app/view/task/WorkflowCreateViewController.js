Ext.define('first.view.task.WorkflowCreateViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.workflowCreateViewController',

    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Memory',
        'Ext.util.History',
        'WindowUtil',
        'first.config.Config',
        'first.model.task.TaskItemModel',
        'first.store.task.TaskItemStore',
        'first.util.ErrorHandlerUtil',
        'first.util.WorkflowHelper'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        let me = this,
            processDefinitionKey = (this.getViewModel().get('processDefinitionKey') ? this.getViewModel().get('processDefinitionKey') : first.config.Config.historyTokenItemId()),
            historyToken = Ext.History.getToken().split('/'),
            workflowParameter = (this.getViewModel().get('workflowParameters') ? this.parseWorkflowUriParameters(me.getViewModel().get('workflowParameters')) : historyToken.length > 2 ? me.parseWorkflowUriParameters(historyToken[2]) : null),
            copyDataFromFi = this.getViewModel().get('copyDataFromFi');

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/process/definition/' + processDefinitionKey,
            method: 'GET',
            success: function (response) {
                let resultData = JSON.parse(response.responseText);
                resultData.workflowParameter = workflowParameter;
                resultData.copyDataFromFi = copyDataFromFi;
                me.initView(resultData);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    initView: function (item) {

        let title = (item.processDefinition.title ? item.processDefinition.title : item.processDefinition.name),
            isWindow = this.getViewModel().get('isWindow');

        if (isWindow) {
            this.getView().up('window').setTitle(title);
        } else {
            this.getView().setTitle(title);
        }

        this.getViewModel().set('title', title);
        this.getViewModel().set('processDefinition', item.processDefinition);
        this.getViewModel().set('form', item.form);

        first.util.WorkflowHelper.sortFormItems(item.form, item.processDefinition.startFormResourceKey);

        let me = this,
            restrictedNames = first.util.WorkflowHelper.getHiddenFieldNamesArray(item.form, item.processDefinition.startFormResourceKey, true),
            workflowCreateNewPanel = this.lookupReference(isWindow ? 'workflowCreateNewFormWindow' : 'workflowCreateNewPanel'),
            formItemsAll = [],
            hideUerCombo = this.getViewModel().get('hideUserCombo');

        Ext.each(item.form, function (formItem) {
            if ((formItem.title && !Ext.Array.contains(restrictedNames, formItem.name)) && (formItem.dataType !== 'cm:person' || formItem.dataType === 'cm:person' && !hideUerCombo)) {
                let generatedFormItem = new first.util.WorkflowHelper().getFormItem(formItem, item.processDefinition.key, 'newTask', me.getViewModel(), !formItem.required, item.classProperties);
                me.checkXtypeEditable(generatedFormItem, item.workflowParameter);
                formItemsAll.push(generatedFormItem);
            }
        });

        let workflowParameter = item.workflowParameter;
        if (workflowParameter) {
            workflowParameter.forEach(function (wfItem) {
                let paramObj = wfItem.split('__');
                me.getViewModel().set('newTask.' + item.processDefinition.key + '.' + paramObj[0], paramObj[1]);
            });
        }

        if (item.copyDataFromFi) {
            me.getViewModel()
                .set('newTask.' + item.processDefinition.key + '.fwf_fiRegCopyDataFromFi', item.copyDataFromFi);

            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/fi/' + item.copyDataFromFi,
                method: 'GET',
                success: function (response) {
                    let fiProperties = JSON.parse(response.responseText).properties;

                    let copyProperties = item.form.find(el => el.name.endsWith('CopyProperties')).allowedValues;

                    copyProperties.forEach(function (property) {

                        let keyName = item.form
                            .find(el => el.name === property.replace(':', '_')).defaultValue.replace(":", "_");
                        let valueName = item.form
                            .find(el => el.name === property.replace(':', '_').replace('Key', 'Val')).defaultValue;

                        if (valueName.endsWith('AddressRegion')) {
                            me.bindRegionalStructureData('/region/' + fiProperties[valueName], function (response) {
                                me.getViewModel()
                                    .set('newTask.' + item.processDefinition.key + '.' + keyName, JSON.parse(response.responseText).id);
                            })
                        } else if (valueName.endsWith('AddressCity')) {
                            me.bindRegionalStructureData('/city/' + fiProperties[valueName], function (response) {
                                me.getViewModel()
                                    .set('newTask.' + item.processDefinition.key + '.' + keyName, JSON.parse(response.responseText).id)
                            })
                        } else {
                            me.getViewModel()
                                .set('newTask.' + item.processDefinition.key + '.' + keyName, fiProperties[valueName]);
                        }
                    });
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            });
        }

        if (isWindow) {
            workflowCreateNewPanel.add([{
                items: formItemsAll
            }]);
            WindowUtil.setResponsiveHeight(this.getView().up('window'), formItemsAll)
        } else {
            let formItems = first.util.WorkflowHelper.getSplittedFormItems(formItemsAll);
            workflowCreateNewPanel.add([{
                items: formItems[0]
            }, {
                items: formItems[1]
            }]);
        }


        this.initTabBar(item);
    },

    initTabBar: function (item) {
        let formItemsStore = Ext.create('first.store.task.TaskItemStore'),
            workflowCreateNewTabBarPanel = this.lookupReference('workflowCreateNewTabBarPanel'),
            taskItemGridView = Ext.create('first.view.task.TaskItemView', {
                reference: 'newProcessItems',
                iconCls: 'x-fa fa-copy',
                title: i18n.taskProcessItemsGridTitle,
                emptyText: i18n.taskProcessItemsGridEmptyText,
                border: false,
                store: formItemsStore,
                bbar: null
            }),
            workflowTabPanel = Ext.create('Ext.tab.Panel', {
                defaults: {
                    autoScroll: true
                },
                border: false
            });

        workflowTabPanel.add(taskItemGridView);
        workflowTabPanel.setActiveTab(0);
        workflowCreateNewTabBarPanel.add(workflowTabPanel);

        if (item.repositoryViewModel) {
            taskItemGridView.getViewModel().set('hideToolbar', true);
            let model = new first.model.task.TaskItemModel({
                id: item.repositoryViewModel.get('selectedDocument').get('id'),
                name: item.repositoryViewModel.get('selectedDocument').get('name'),
                createdAt: item.repositoryViewModel.get('selectedDocument').get('createdAt'),
                createdBy: item.repositoryViewModel.get('selectedDocument').get('createdBy').id,
                modifiedAt: item.repositoryViewModel.get('selectedDocument').get('modifiedAt'),
                modifiedBy: item.repositoryViewModel.get('selectedDocument').get('modifiedBy').id,
                mimeType: item.repositoryViewModel.get('selectedDocument').get('mimeType')
            });
            taskItemGridView.getStore().add(model);
        }
    },

    onCancelCreateNewTaskFormClick: function () {
        this.getView().destroy();
    },

    onCancelCreateNewTaskWindowClick: function () {
        this.getView().up('window').destroy();
    },

    onSubmitCreateNewTaskFormClick: function () {
        this.getView().mask(i18n.pleaseWait);

        let isWindow = this.getViewModel().get('isWindow'),
            processItems = this.lookupReference('newProcessItems').getStore()
                .queryBy(function () {
                    return true;
                })
                .getRange().map(function (pi) {
                    return {id: pi.id}
                }),
            processDefinitionKey = this.getViewModel().get('processDefinition').key;

        if (this.lookupReference(isWindow ? 'workflowCreateNewFormWindow' : 'workflowCreateNewForm').isValid()) {
            let me = this,
                formData = this.getViewModel().get('newTask.' + processDefinitionKey),
                jsonData = {
                    variables: formData,
                    items: processItems
                };

            Ext.Ajax.request({
                method: 'POST',
                url: first.config.Config.remoteRestUrl + 'ecm/workflow/create/' + processDefinitionKey,
                jsonData: jsonData,
                success: function (response) {
                    let store = Ext.getStore('taskStore');
                    if (store) {
                        store.reload();
                    }

                    me.fireEvent('reloadFiRegistryStore');

                    let res = JSON.parse(response.responseText),
                        fiRegistryId = null;

                    if (res.processVariables) {
                        fiRegistryId = res.processVariables.find(function (variable) {
                            return Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), variable.type);
                        });
                    }

                    if (fiRegistryId) {
                        fiRegistryId = fiRegistryId.value.replace('workspace://SpacesStore/', '');
                        let initialTabReference = first.util.WorkflowHelper.getInitialTabReference(res.processVariables);
                        me.fireEvent('openFiProfileAndRefreshView', isWindow ? me.getView().up('window') : me.getView(), (fiRegistryId + '/' + initialTabReference), fiRegistryId);
                    } else {
                        me.fireEvent('destroyCallerAndOpenTab', isWindow ? me.getView().up('window') : me.getView(), 'taskView');
                    }
                },
                failure: function (response) {
                    me.displaySubmissionFailedMessage(response, function (btn, text) {
                        this.getViewModel().set('newTask.' + processDefinitionKey + '.fwf_metaInformationIgnoreWarnings', (btn === 'yes'));
                        if (btn === 'yes') {
                            this.onSubmitCreateNewTaskFormClick();
                        }
                    });
                },
                callback: function () {
                    if (me.getView()) {
                        me.getView().unmask();
                    }
                }
            });
        } else {
            this.getView().unmask();
            Ext.toast(i18n.formIsNotValid, i18n.warning);
        }
    },

    displaySubmissionFailedMessage: function (response, warningFunction) {
        let errorMessage = i18n.operationFailed;
        let isWarning = false;
        try {
            let error = response.responseText;
            if (error) {
                isWarning = error.startsWith("Warning");
                if (isWarning) {
                    errorMessage = '';
                } else {
                    errorMessage += '<br>'
                }
                errorMessage += first.util.WorkflowHelper.getExceptionI18nMessage(error);
            }
        } catch (e) {
            console.log(e);
        } finally {
            !isWarning ? first.util.ErrorHandlerUtil.showErrorWindow(null, errorMessage, null) : Ext.MessageBox.confirm(i18n.warning, errorMessage, warningFunction, this);
        }
    },

    onViewProcessDiagramClick: function () {
        let processDefinition = this.getViewModel().get('processDefinition');

        let view = this.getView(),
            window = new first.util.WorkflowHelper().getProcessDefinitionDiagramWindow(i18n.workflowDetailsViewProcessDiagram + ': ' + processDefinition.description, processDefinition.id);

        view.mask(i18n.pleaseWait);
        window.show(true, function () {
            view.unmask();
        });
    },

    parseWorkflowUriParameters: function (params) {
        return params.split(',');
    },

    checkXtypeEditable: function (item, wokrflowParameters) {
        if (wokrflowParameters) {
            wokrflowParameters.forEach(function (wfItem) {
                let paramObj = wfItem.split('__');
                if (paramObj[0] === item.itemName) {
                    item.disabled = true;
                }
            });
        }
    },

    bindRegionalStructureData: function (region, success) {
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/fi/regionalStructure' + region,
            method: 'GET',
            success: success,
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    }

});
