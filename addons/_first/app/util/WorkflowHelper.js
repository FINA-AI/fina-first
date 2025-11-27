Ext.define('first.util.WorkflowHelper', {

    requires: [
        'Ext.app.ViewModel',
        'Ext.data.Store',
        'Ext.data.proxy.Memory',
        'first.config.Config',
        'first.store.common.EcmGroupStore',
        'first.store.common.EcmUsersStore',
        'first.store.common.RegionalStructureStore',
        'first.store.fi.FiTypeStore',
        'first.store.registration.FiRegistry',
        'first.util.ErrorHandlerUtil',
        'first.view.task.ProcessDefinitionDiagramViewModel'
    ],

    statics: {
        getLabelWidth: function () {
            return 275;
        },
        getDataTypeFiType: function () {
            return first.config.Config.conf.properties.dataTypeFiType;
        },
        getDataTypeFiRegistries: function () {
            let result = first.config.Config.conf.properties.dataTypeFiRegistries;
            return result ? result : [];
        },
        getDataTypeRegionalStructureRegion: function () {
            return first.config.Config.conf.properties.dataTypeRegionalStructureRegion;
        },
        getDataTypeFiRegionalStructureCity: function () {
            return first.config.Config.conf.properties.dataTypeRegionalStructureCity;
        },
        isComboableDataType: function (dataType) {
            return (dataType === first.util.WorkflowHelper.getDataTypeFiType() || Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), dataType));
        },
        isGriddable: function (taskFormItemDataType) {
            let result = false;
            let checkPrefixes = first.config.Config.conf.properties.modelGridCheckPrefixes;
            if (checkPrefixes) {
                Ext.each(checkPrefixes, function (prefix) {
                    if (taskFormItemDataType.startsWith(prefix)) {
                        result = true;
                    }
                });
            }
            return result;
        },
        getExceptionI18nMessage: function (message) {
            try {
                let prefix = "couldn't execute event listener : ";
                message = message.startsWith(prefix) ? message.substring(prefix.length) : message;

                if (i18n[message]) {
                    return i18n[message];
                }

                message = message.split(';');
                if (message.length > 1 && i18n[message[0]]) {
                    let i18nMessage = i18n[message[0]];
                    message.shift();
                    message = message.map(m => i18n[m] ? i18n[m] : m);
                    message.unshift(i18nMessage);
                    return Ext.String.format.apply(this, message);
                }
            } catch (e) {
                console.log(e);
            }

            return message;
        },
        sortFormItems: function (formItems, formModelName) {
            if (formItems && formModelName) {
                let sequenceNamesArray = first.util.WorkflowHelper.getFormSequenceNamesArray(formItems, formModelName);
                if (sequenceNamesArray) {
                    formItems.sort(function (i, j) {
                        return sequenceNamesArray.indexOf(i.name) - sequenceNamesArray.indexOf(j.name);
                    });
                }
            }
        },
        sortFormItemsBySequenceNamesArray: function (formItems, sequenceNamesArray) {
            if (formItems && sequenceNamesArray) {
                formItems.sort(function (i, j) {
                    return sequenceNamesArray.indexOf(i.name) - sequenceNamesArray.indexOf(j.name);
                });
            }
        },
        getFormSequenceNamesArray: function (formItems, formModelName) {
            let sequencePropertyName = formModelName.replace(':', '_') + 'Sequence';
            let sequenceFormItem = first.util.WorkflowHelper.getFormPropertyByName(formItems, sequencePropertyName);
            if (sequenceFormItem && sequenceFormItem.length > 0) {
                let result = [];
                Ext.each(sequenceFormItem[0].allowedValues, function (value) {
                    result.push(value.replace(':', '_'));
                });
                return result;
            }
            return null;
        },
        getHiddenFieldNamesArray: function (formItems, formModelName, includeGlobalHiddenFields) {
            let result = [];
            if (includeGlobalHiddenFields) {
                result = first.config.Config.conf.properties.modelHiddenFieldNames;
                result = result ? result : [];
            }

            if (formModelName) {
                let hiddenFieldsPropertyName = formModelName.replace(':', '_') + 'HiddenFieldNames';
                let hiddenFieldsFormItem = first.util.WorkflowHelper.getFormPropertyByName(formItems, hiddenFieldsPropertyName);
                if (hiddenFieldsFormItem && hiddenFieldsFormItem.length > 0) {
                    Ext.each(hiddenFieldsFormItem[0].allowedValues, function (value) {
                        result.push(value.replace(':', '_'));
                    });
                }
            }
            return result;
        },
        getFormPropertyByName: function (form, name) {
            return form.filter(
                function (form) {
                    return form.name === name || form.name.replace(':', '_') === name || form.name.replace('_', ':') === name;
                }
            );
        },
        displaySubmissionFailedMessage: function (response) {
            console.log('Operation failed.');
            console.log(response);

            let errorMessage = i18n.operationFailed;
            try {
                let error = JSON.parse(response.responseText);
                if (error && error.error) {
                    if (error.error.briefSummary) {
                        errorMessage += ('<br>' + first.util.WorkflowHelper.getExceptionI18nMessage(error.error.briefSummary));
                    } else if (error.error.errorKey) {
                        errorMessage += ('<br>' + error.error.errorKey);
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                Ext.Msg.alert(i18n.error, errorMessage);
            }
        },
        getSplittedFormItems: function (items) {
            let formItems = [[], []];
            let maxItems = items.length / 2;
            for (let i = 0; i < items.length; i++) {
                if (i < maxItems) {
                    formItems[0].push(items[i]);
                } else {
                    formItems[1].push(items[i]);
                }
            }
            return formItems;
        },
        createWorkflowViewAsWindow: function (processDefinitionKey, workflowParameters, hideUerCombo, copyDataFromFi) {
            let viewModel = Ext.create('Ext.app.ViewModel', {
                data: {
                    processDefinitionKey: processDefinitionKey,
                    workflowParameters: workflowParameters,
                    isWindow: true,
                    hideUserCombo: hideUerCombo,
                    copyDataFromFi: copyDataFromFi
                }
            });

            let window = Ext.create('Ext.window.Window', {
                iconCls: 'x-fa fa-cog',
                title: i18n.pleaseWait,
                width: '50%',
                height: '55%',
                modal: true,
                layout: 'fit',
                closable: false,
                items: [{
                    xtype: 'workflowCreate',
                    viewModel: viewModel
                }]
            });

            window.show();
        },
        getInitialTabReference: function (processVariables) {
            let initialTabReferenceVariable = processVariables.find(function (variable) {
                return variable.name === 'wf_initialTabReference';
            });
            if (initialTabReferenceVariable && initialTabReferenceVariable.value) {
                return initialTabReferenceVariable.value;
            }
            return 'general';
        }
    },

    addOrRemoveAssociation: function (view, taskId, associations, gridStore, nodeProperties, isRemove, destroyView) {
        let me = this;
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/tasks/' + taskId + '/associations',
            jsonData: associations,
            success: function (response) {
                if (gridStore && nodeProperties) {
                    let node = {};
                    Ext.each(Object.keys(nodeProperties), function (key) {
                        let itemKey = key.replace(':', '_');
                        node[itemKey] = nodeProperties[key];
                    });

                    let taskStore = Ext.getStore('taskStore');
                    if (taskStore) {
                        taskStore.reload();
                    }

                    if (isRemove) {
                        gridStore.removeAt(gridStore.find('id', node.id));
                        me.deleteNode(view, node.id);
                    } else {
                        gridStore.add(node);

                        if (destroyView) {
                            view.destroy();
                        } else {
                            view.unmask();
                        }
                    }
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
                view.unmask();
            }
        });
    },

    deleteNode: function (view, nodeId) {
        let me = this;
        Ext.Ajax.request({
            method: 'DELETE',
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + nodeId,
            success: function (response) {
                console.log('Node: ' + nodeId + ' - is deleted.');
                view.unmask();
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
                view.unmask();
            }
        });
    },

    saveTask: function (view, taskId, jsonData, isSubmit, destroyView, callback, onTaskSubmitSuccess, onTaskSubmitFailure) {
        view.mask(i18n.pleaseWait);

        let me = this;
        if (jsonData && jsonData.length > 0) {
            Ext.Ajax.request({
                method: 'POST',
                url: first.config.Config.remoteRestUrl + 'ecm/workflow/tasks/' + taskId + '/variables',
                jsonData: jsonData,
                success: function (response) {
                    if (isSubmit) {
                        me.submitTask(view, taskId, destroyView, callback, onTaskSubmitSuccess, onTaskSubmitFailure);
                    } else {
                        let taskStore = Ext.getStore('taskStore');
                        if (taskStore) {
                            taskStore.reload();
                        }

                        if (callback) {
                            callback();
                        }
                    }
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                },
                callback: function () {
                    view.unmask();
                }
            });
        } else if (isSubmit) {
            me.submitTask(view, taskId, destroyView, callback);
        } else {
            if (callback) {
                callback();
            }
            view.unmask();
        }
    },

    submitTask: function (view, taskId, destroyView, callback, onSuccess, onFailure) {

        view.mask(i18n.pleaseWait);

        let taskBody = {
            state: "completed"
        };

        let me = this;
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/tasks/' + taskId + '?select=state',
            jsonData: taskBody,
            success: function (response) {
                let taskStore = Ext.getStore('taskStore');
                if (taskStore) {
                    taskStore.reload()
                }

                if (destroyView) {
                    view.destroy();
                }

                if (onSuccess) {
                    onSuccess();
                }
            },
            failure: function (response) {
                if (onFailure) {
                    onFailure(response);
                } else {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            },
            callback: function () {
                if (callback) {
                    callback();
                }

                if (view && view.masked) {
                    view.unmask();
                }

            }
        });
    },

    getFormItemXType: function (formItem, viewModel) {
        let result = {xtype: 'textfield'};

        let dataType = formItem.dataType.toString();

        if (Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), dataType)) {
            result = {
                xtype: 'combobox',
                store: {
                    type: 'fiRegistryEcm',
                    autoLoad: true
                },
                valueField: 'id',
                displayField: 'code',
                queryMode: 'local',
                forceSelection: true,
                listConfig: {
                    itemTpl: [
                        '<div data-qtip="{code}: {name}">{code} - {name}</div>'
                    ]
                }
            };
        } else if (formItem.name.endsWith('AddressCity')) {
            let internalName = formItem.name.substring(0, formItem.name.length - 'AddressCity'.length).replace(':', '_');

            result = {
                xtype: 'combobox',
                store: {
                    type: 'regionalStructureStore',
                },
                valueField: 'id',
                displayField: 'fina_regionalStructureCityName',
                queryMode: 'local',
                forceSelection: true,
                filterPickList: true,
                listeners: {
                    afterrender: function (cmp) {
                        viewModel.set(internalName + "CityComponent", cmp);
                    },
                    focus: function (cmp) {
                        let store = cmp.getStore();
                        let regCmp = viewModel.get(internalName + 'RegionComponent');
                        if (regCmp && regCmp.getSelection() && store.getCount() === 0) {
                            store.getProxy().url = first.config.Config.remoteRestUrl + 'ecm/node/' + regCmp.getSelection().id + '/children';
                            store.load();
                        }
                    },
                }
            };

            if (formItem.name.endsWith('FactualAddressCity')) {
                result.hidden = true;
                result.bind = {
                    hidden: "{isFactualAddressHidden}",
                }
            }

        } else if (formItem.name.endsWith('AddressRegion')) {
            let internalNameRegion = formItem.name.substring(0, formItem.name.length - 'AddressRegion'.length).replace(':', '_');

            result = {
                xtype: 'combobox',
                store: {
                    type: 'regionalStructureStore',
                    autoLoad: true,
                    enableKeyEvents: true,
                    proxy: {
                        url: first.config.Config.remoteRestUrl + 'ecm/node/-root-/children' + '?relativePath=' + first.config.Config.conf.properties.regionalStructureFolderPath + "&orderBy=createdAt"
                    },
                },
                valueField: 'id',
                displayField: 'fina_regionalStructureRegionName',
                queryMode: 'local',
                forceSelection: true,
                filterPickList: true,
                listeners: {
                    afterrender: function (cmp) {
                        viewModel.set(internalNameRegion + "RegionComponent", cmp);
                    },
                    change: function (cmp, newValue, oldValue) {
                        let cityCmp = viewModel.get(internalNameRegion + "CityComponent");
                        let store = cityCmp.getStore();

                        if (newValue !== null && oldValue !== null && newValue !== oldValue) {
                            cityCmp.clearValue()
                        }
                        if (cmp.getSelection()) {
                            store.getProxy().url = first.config.Config.remoteRestUrl + 'ecm/node/' + cmp.getSelection().id + '/children';
                            store.load(function (records) {
                                if (store.getCount() === 1) {
                                    cityCmp.select(records[0])
                                }
                            })
                        } else {
                            store.clearData()
                        }
                    },
                }
            };


            if (formItem.name.endsWith('FactualAddressRegion')) {
                result.hidden = true;

                result.bind = {
                    hidden: "{isFactualAddressHidden}",
                }
            }

        } else if (formItem.name.endsWith('FactualAddress')) {

            result = {
                xtype: 'textfield',
                listeners: {
                    afterrender: function (cmp) {
                        viewModel.set(formItem.name.replace(":", "_") + "Component", cmp)
                    },
                }
            };
            result.hidden = true;
            result.bind = {
                hidden: "{isFactualAddressHidden}",
            };

        } else if (formItem.name.endsWith('IsAddressSame')) {
            let data = [{value: i18n.yes}, {value: i18n.no}];
            data[0][formItem.name] = true;
            data[1][formItem.name] = false;

            result = {
                xtype: 'combobox',
                store: {
                    data: data
                },
                valueField: formItem.name,
                displayField: 'value',
                queryMode: 'local',
                forceSelection: true,

                listeners: {
                    change: function (obj, newVal, oldVal) {
                        viewModel.set("isFactualAddressHidden", newVal);

                        Ext.each(Object.keys(viewModel.data), function (key) {
                            if (key.endsWith("FactualRegionComponent") || key.endsWith("FactualCityComponent") || key.endsWith("FactualAddressComponent")) {
                                viewModel.get(key).allowBlank = newVal;
                            }
                        });
                    }
                }
            };
        } else {
            switch (dataType) {
                case 'd:int':
                case 'd:long':
                case 'd:double':
                    result = {
                        xtype: 'numberfield'
                    };
                    break;
                case 'd:date':
                    result = {xtype: 'datefield', format: first.config.Config.dateFormat};
                    break;
                case first.util.WorkflowHelper.getDataTypeFiType():
                    result = {
                        xtype: 'combobox',
                        store: {
                            type: 'fiTypeStore'
                        },
                        valueField: 'id',
                        displayField: 'code',
                        queryMode: 'local',
                        forceSelection: true,
                        filterPickList: true,
                        listConfig: {
                            itemTpl: [
                                '<div data-qtip="{code}: {description}">{code} - {description}</div>'
                            ]
                        }
                    };
                    break;
                case 'cm:person':
                    result = {
                        xtype: formItem.name === 'bpm_assignee' ? 'combobox' : 'tagfield',
                        store: {
                            type: 'ecmUsersStore'
                        },
                        valueField: 'id',
                        displayField: 'displayName',
                        queryMode: 'local',
                        forceSelection: true,
                        filterPickList: true,
                        listConfig: {
                            itemTpl: [
                                '<div data-qtip="{description}">{displayName}</div>'
                            ]
                        }
                    };
                    break;
                case 'cm:authorityContainer':
                    result = {
                        xtype: formItem.name === 'bpm_groupAssignee' ? 'combobox' : 'tagfield',
                        store: {
                            type: 'ecmGroupStore'
                        },
                        valueField: 'id',
                        displayField: 'displayName',
                        queryMode: 'local',
                        filterPickList: true,
                        forceSelection: true
                    };
                    break;
                case 'd:boolean':
                    let data = [{value: i18n.yes}, {value: i18n.no}];
                    data[0][formItem.name] = true;
                    data[1][formItem.name] = false;

                    result = {
                        xtype: 'combobox',
                        store: {
                            data: data
                        },
                        valueField: formItem.name,
                        displayField: 'value',
                        queryMode: 'local',
                        forceSelection: true
                    };
                    break;
                default:
                    break;
            }
        }

        return result;
    },

    getFormItem: function (formItem, bindObjectRootName, bindKeyObjectName, viewModel, allowBlank, classProperties) {
        let formItemBindKey = '{' + bindKeyObjectName + '.' + bindObjectRootName + '.' + formItem.name + '}';

        let item = this.getFormItemXType(formItem, viewModel);

        if (!first.util.WorkflowHelper.isComboableDataType(formItem.dataType)) {

            if (formItem.allowedValues) {
                let comboBoxData = [];
                Ext.each(formItem.allowedValues, function (allowedValue) {

                    let formItemValue = (allowedValue.formItemValue ? allowedValue.formItemValue : allowedValue);
                    let formItemDisplayValue = (allowedValue.formItemDisplayValue ? allowedValue.formItemDisplayValue : i18n[allowedValue] ? i18n[allowedValue] : allowedValue);

                    comboBoxData.push({
                        formItemValue: formItemValue,
                        formItemDisplayValue: formItemDisplayValue
                    });
                });

                item = {
                    xtype: 'combobox',

                    store: Ext.create('Ext.data.Store', {
                        fields: ['formItemValue', 'formItemDisplayValue'],
                        idProperty: 'formItemValue',
                        data: comboBoxData
                    }),

                    displayField: 'formItemDisplayValue',
                    valueField: 'formItemValue',
                    forceSelection: true,
                    selectOnFocus: true,
                    triggerAction: 'all',
                    queryMode: 'local'
                };
            }
        }

        let title = formItem.title;
        if (!allowBlank) {
            title += ' <b style="color: red;">*</b>'
        }
        item.fieldLabel = title;

        item.itemName = formItem.name;
        item.allowBlank = allowBlank;
        if (item.bind) {
            item.bind.value = formItemBindKey;
        } else {
            item.bind = {
                value: formItemBindKey
            };
        }

        viewModel.set(bindKeyObjectName + '.' + bindObjectRootName + '.' + formItem.name, formItem.defaultValue);

        let itemConstraints = this.getFormItemConstraints(formItem, classProperties);

        this.addValidators(item, itemConstraints);

        if (formItem.value) {
            viewModel.set(bindKeyObjectName + '.' + bindObjectRootName + '.' + formItem.name, formItem.value);
        }

        return item;
    },

    getWindowWithButtons: function (title, controllerName, formId, formItems, buttons, viewModel, width, height) {
        width = (width ? width : 900);
        height = (height ? height : 550);
        return Ext.create('Ext.window.Window', {

            controller: controllerName,

            title: title,

            viewModel: viewModel,

            maximizable: true,

            closable: true,

            height: height,
            width: width,

            modal: true,

            layout: {
                type: 'fit'
            },

            items: [{
                xtype: 'form',
                id: formId,
                scrollable: true,

                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },

                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: first.util.WorkflowHelper.getLabelWidth()
                },

                bodyPadding: 2,
                items: formItems,
            }],

            buttons: buttons
        });
    },

    getFormItemConstraints(formItem, classProperties) {
        let constraints = [];
        if (classProperties) {

            for (let i = 0; i < classProperties.length; i++) {
                let property = classProperties[i];
                if (formItem.name === property.name.replace(':', "_")) {
                    return property.constraints ? property.constraints : constraints;
                }
            }
        }

        return constraints;
    },

    addValidators: function (item, constraints) {
        Ext.each(constraints, function (constraint) {
            switch (constraint.type) {
                case 'MINMAX':
                case 'LENGTH':
                    if (constraint.parameters) {
                        Ext.each(constraint.parameters, function (param) {
                            Object.keys(param).map(function (key, index) {
                                item[key] = param[key];
                            });

                        })
                    }
                    break;
                case 'REGEX':
                    if (constraint.parameters) {
                        let expression = constraint.parameters.find(function (p) {
                            return p.expression && p.expression.trim().length > 0;
                        }).expression;
                        let requiresMatchObj = constraint.parameters.find(function (p) {
                            return p.requiresMatch !== 'undefined';
                        });

                        let requiresMatch = requiresMatchObj ? requiresMatchObj['requiresMatch'] : true;

                        item.validator = function (val) {
                            var regex = new RegExp(expression);
                            let regexMessage = ' characters [' + expression + ']';
                            let errMsg = requiresMatch ? 'Allowed ' + regexMessage : 'Disallowed ' + regexMessage;

                            let valid = regex.test(val);
                            if (!requiresMatch) {
                                valid = !valid;
                            }
                            return valid ? true : errMsg;
                        };

                    }
                    break;
            }
        });
    },

    getProcessDiagramWindow: function (title, processId) {
        return this.getDiagramWindow(title, first.config.Config.remoteRestUrl + 'ecm/workflow/process/' + processId + '/image');
    },

    getProcessDefinitionDiagramWindow: function (title, processDefinitionId) {
        return this.getDiagramWindow(title, first.config.Config.remoteRestUrl + 'ecm/workflow/process/definitions/image/' + processDefinitionId);
    },

    getDiagramWindow: function (title, diagramProxyUrl) {
        let windowViewModel = Ext.create('first.view.task.ProcessDefinitionDiagramViewModel', {
            data: {
                title: title,
                diagramProxyUrl: diagramProxyUrl
            }
        });
        return Ext.create('first.view.task.ProcessDefinitionDiagram', {
            viewModel: windowViewModel
        });
    },

    sendToInspector: function (view, fiId, inspectorGroupId, callback, vm) {
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + "ecm/fi/" + fiId + "/sendToController/" + inspectorGroupId,
            method: 'POST',
            success: function (response) {
                if (vm) {
                    let controller = JSON.parse(response.responseText);
                    if (vm.getParent()) {
                        vm.getParent().set('assignedInspector', controller);
                    } else {
                        vm.set('assignedInspector', controller);
                    }
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
                view.unmask();
            },
            callback: callback
        });
    }

});
