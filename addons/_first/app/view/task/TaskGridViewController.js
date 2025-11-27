Ext.define('first.view.task.TaskGridViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.taskGridViewController',

    init: function () {
        let me = this,
            currentValues = this.getViewModel().get('currentValues'),
            rootFolderId = this.getViewModel().get('rootFolderId');

        if (currentValues && currentValues.length > 0) {
            Ext.Ajax.request({
                method: 'GET',
                url: first.config.Config.remoteRestUrl + 'ecm/node/' + rootFolderId + '/children/full',
                success: function (response) {
                    let resultData = JSON.parse(response.responseText);
                    let gridFormData = [];

                    Ext.each(resultData.list, function (rd) {
                        let existingItem = me.getItemFromListById(currentValues, 'workspace://SpacesStore/' + rd.id);
                        if (existingItem !== null) {

                            let gridDataItem = {
                                cm_name: rd.name,
                                id: rd.id,
                                item: rd
                            };

                            Ext.each(Object.keys(rd.properties), function (propertyKey) {
                                let key = propertyKey.replace(':', '_');
                                gridDataItem[key] = rd.properties[propertyKey];
                            });

                            gridFormData.push(gridDataItem);
                        }
                    });

                    me.initGridPanel(gridFormData);
                },

                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            });
        } else {
            me.initGridPanel([]);
        }

    },

    getHiddenFieldNames: function () {
    },

    initGridPanel: function (gridFormData) {
        let me = this,
            className = this.getViewModel().get('className'),
            isEditable = this.getViewModel().get('editable');

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + className + '/properties',
            success: function (response) {
                let classProperties = JSON.parse(response.responseText),
                    hiddenFieldNames = me.sortAndGetHiddenFields(classProperties, className),
                    gridFormColumns = [];

                Ext.each(classProperties, function (classProperty) {
                    classProperty.name = classProperty.name.replace(':', '_');
                    if (!Ext.Array.contains(hiddenFieldNames, classProperty.name)) {
                        gridFormColumns.push({
                            flex: 1,
                            text: classProperty.title,
                            dataIndex: classProperty.name.replace(':', '_')
                        });
                    }
                });

                if (isEditable) {
                    gridFormColumns.unshift({
                        flex: 0,
                        width: 30,
                        menuDisabled: true,
                        sortable: false,
                        resizable: false,
                        xtype: 'actioncolumn',
                        iconCls: 'x-fa fa-edit',
                        tooltip: i18n.edit,
                        handler: 'onEditActiveTaskGridClick'
                    });

                    gridFormColumns.push({
                        flex: 0,
                        width: 30,
                        menuDisabled: true,
                        sortable: false,
                        xtype: 'actioncolumn',
                        resizable: false,
                        iconCls: 'cell-editing-delete-row',
                        tooltip: i18n.delete,
                        handler: 'onDeleteActiveTaskGridClick'
                    });
                }

                gridFormColumns.unshift({
                    flex: 0,
                    xtype: 'rownumberer'
                });

                me.getViewModel().set('hiddenFieldNames', hiddenFieldNames);
                me.getViewModel().set('classProperties', classProperties);

                let gridFormStore = Ext.create('Ext.data.Store', {
                    data: gridFormData,
                    proxy: {
                        type: 'memory',
                        enablePaging: false
                    }
                });

                me.getView().reconfigure(gridFormStore, gridFormColumns);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    onAddActiveTaskGridClick: function () {
        let me = this,
            formItems = [],
            rootFolderItem = this.getViewModel().get('formItem'),
            classProperties = this.getViewModel().get('classProperties'),
            hiddenFieldNames = this.getViewModel().get('hiddenFieldNames'),
            windowViewModel = new Ext.app.ViewModel({
                data: {
                    formItem: rootFolderItem,
                    rootFolderId: me.getViewModel().get('rootFolderId'),
                    taskId: me.getViewModel().get('taskId'),
                    gridPanelId: me.getView().id
                }
            });

        Ext.each(classProperties, function (classProperty) {
            if (!Ext.Array.contains(hiddenFieldNames, classProperty.name)) {
                let generatedFormItem = new first.util.WorkflowHelper().getFormItem(classProperty, rootFolderItem.name, 'new', windowViewModel, !classProperty.mandatory, classProperties);
                formItems.push(generatedFormItem);
            }
        });

        let window = new first.util.WorkflowHelper().getWindowWithButtons(
            rootFolderItem.title,
            'taskSlaveViewController',
            rootFolderItem.name,
            formItems,
            [{
                text: i18n.cancel,
                handler: 'onCancelTaskGridNewItemButtonClick'
            }, {
                text: i18n.submit,
                handler: 'onSubmitTaskGridNewItemButtonClick'
            }], windowViewModel);
        window.show();

    },

    onEditActiveTaskGridClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        let me = this,
            selectedRecord = record;

        if (selectedRecord) {
            let formItems = [],
                classProperties = selectedRecord.get('item').classProperties,
                className = this.getViewModel().get('className'),
                hiddenFieldNames = this.sortAndGetHiddenFields(classProperties, className),
                rootFolderItem = this.getViewModel().get('formItem'),
                windowViewModel = new Ext.app.ViewModel({
                    data: {
                        formItem: rootFolderItem,
                        rootFolderId: me.getViewModel().get('rootFolderId'),
                        taskId: me.getViewModel().get('taskId'),
                        gridPanelId: me.getView().id,
                        selectedRecord: selectedRecord
                    }
                });

            Ext.each(classProperties, function (classProperty) {
                classProperty.name = classProperty.name.replace(':', '_');
                if (!Ext.Array.contains(hiddenFieldNames, classProperty.name)) {
                    classProperty.value = selectedRecord.get(classProperty.name);

                    let generatedFormItem = new first.util.WorkflowHelper().getFormItem(classProperty, rootFolderItem.name, 'edit', windowViewModel, !classProperty.mandatory);
                    formItems.push(generatedFormItem);
                }
            });

            let window = new first.util.WorkflowHelper().getWindowWithButtons(
                rootFolderItem.title,
                'taskSlaveViewController',
                rootFolderItem.name,
                formItems,
                [{
                    text: i18n.cancel,
                    handler: 'onCancelTaskGridNewItemButtonClick'
                }, {
                    text: i18n.submit,
                    handler: 'onSubmitTaskGridEditItemButtonClick'
                }], windowViewModel);
            window.show();
        }
    },

    onDeleteActiveTaskGridClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        let view = this.getView();
        view.mask(i18n.pleaseWait);
        let activeTaskId = this.getViewModel().get('taskId');
        let formItem = this.getViewModel().get('formItem');
        let removedAssocKey = "assoc_" + formItem.name + "_removed";
        let removedAssoc = {};
        removedAssoc[removedAssocKey] = 'workspace://SpacesStore/' + record.id;

        let store = this.getView().getStore();

        new first.util.WorkflowHelper().addOrRemoveAssociation(view, activeTaskId, removedAssoc, store, record.data, true);
    },

    onCancelTaskGridNewItemButtonClick: function (button, e) {
        button.findParentByType('window').destroy();
    },

    sortAndGetHiddenFields: function (classProperties, className) {
        if (classProperties) {
            let me = this;
            Ext.each(classProperties, function (classProperty) {
                me.formatClassProperty(classProperty);
            });

            first.util.WorkflowHelper.sortFormItems(classProperties, className);

            return first.util.WorkflowHelper.getHiddenFieldNamesArray(classProperties, className, false);
        }
        return [];
    },

    formatClassProperty: function (classProperty) {
        if (classProperty.constraints) {
            Ext.each(classProperty.constraints, function (constraint) {
                if (constraint.type === 'LIST') {
                    Ext.each(constraint.parameters, function (constraintParameter) {
                        if (constraintParameter.allowedValues) {
                            classProperty.allowedValues = constraintParameter.allowedValues;
                        }
                    });
                }
            });
        }
    },

    getItemFromListById: function (values, id) {
        let result = null;
        if (values) {
            Ext.each(values, function (value) {
                Ext.each(value.value, function (v) {
                    if (v === id) {
                        result = value;
                    }
                });

            });
        }
        return result;
    }

});
