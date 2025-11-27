Ext.define('first.view.registration.ComplexStructureTreeController', {
    extend: 'first.view.registration.FiProfileDetailsController',

    alias: 'controller.complexStructureTree',

    init: function () {
        this.callParent();
        this.getView().setSelection(this.getView().getRootNode());
    },

    afterRender: function () {
        let store = Ext.create('first.store.registration.ComplexStuctureStore');
        store.proxy.url = first.config.Config.remoteRestUrl + 'ecm/fi/' + this.getViewModel().get('tabId') + '/details';
        store.addFilter({
            property: 'fina:finalStatus',
            operator: 'in',
            value: ['ACTIVE', 'ADDED']
        }, true);
        this.getView().setStore(store);
        this.onRefreshClick();
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().getStore().load();
    },

    onAddClick: function (component) {
        let type = component.type;

        this.addOrEditRecord(type, {})
    },

    addOrEditRecord: function (type, model, view, record, changeableItems) {
        if (view) {
            view.getSelectionModel().select(record);
        }
        this.constructLegalForm(type, model, view, record, changeableItems);
    },


    constructLegalForm: function (type, model, view, record, changeableItems) {
        let window = Ext.create('first.view.registration.FiProfileDetailView', {}),
            store = this.getView().getStore(),
            selectedNode = this.getViewModel().get('selectedComplexStrucureNode');

        if (!record && selectedNode && !selectedNode.isLeaf() && !selectedNode.isExpanded()) {
            selectedNode.expand(false);
        }

        let complexStructurePercentageValidateFunction = function (form, view) {
            let maxAllowedPercentage = me.validatePercentage(store, selectedNode, record);
            if (maxAllowedPercentage < model['fina_fiComplexStructureCapitalPercentage']) {
                Ext.toast(Ext.String.format(i18n.complexStructurePercentageValidationMessage, maxAllowedPercentage), i18n.error);
                let percentageField = form.getForm().findField("fina_fiComplexStructureCapitalPercentage");
                percentageField.maxValue = maxAllowedPercentage;
                percentageField.validate();
                return false;
            }
            return true;
        };

        let isDisabled = false;
        let booleanFieldsPanel = Ext.create('Ext.panel.Panel', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            margin: 0
        });

        if (view && record) {
            isDisabled = this.isEditDisabled(view, record)
        }

        let windowHeader;
        if (model['id']) {
            let nodeParent = selectedNode.parentNode;
            windowHeader = nodeParent.get("fina_fiComplexStructureLegalName") ? i18n[type] + " | " + nodeParent.get("fina_fiComplexStructureLegalName")
                + (nodeParent.get("fina_fiComplexStructureIdentificationNumber") ? "(" + nodeParent.get("fina_fiComplexStructureIdentificationNumber") + ")" : '')
                : i18n[type];
        } else {
            windowHeader = selectedNode.get("fina_fiComplexStructureLegalName") ? i18n[type] + " | " + selectedNode.get("fina_fiComplexStructureLegalName")
                + (selectedNode.get("fina_fiComplexStructureIdentificationNumber") ? "(" + selectedNode.get("fina_fiComplexStructureIdentificationNumber") + ")" : '')
                : i18n[type];
        }

        model['fina_fiComplexStructureType'] = type;
        window.getViewModel().set('model', model);
        window.getViewModel().set('detail', this.getViewModel().get('detail'));
        window.getViewModel().set('record', record);
        window.getViewModel().set('type', windowHeader);
        window.getViewModel().set('tabId', this.getViewModel().get('tabId'));
        window.getViewModel().set('store', store);
        window.getViewModel().set('edit', model['id']);
        window.getViewModel().set('selectedNode', selectedNode);
        window.getViewModel().set('isTree', true);
        window.getViewModel().set('theFi', this.getViewModel().get('theFi'));
        window.getViewModel().set('fiRegistryLastActionId', this.getViewModel().get('theFi')['fina_fiRegistryLastActionId']);
        window.getViewModel().set('validationFunction', complexStructurePercentageValidateFunction);

        let childType = this.getViewModel().get('detail').properties['fina:folderConfigChildType'];

        let me = this, metaDada = this.getViewModel().get('metaDada'),
            hiddenProperties = this.getViewModel().get('hiddenProperties'),
            formItems = window.lookupReference('formItems'),
            questions = first.view.registration.MetadataUtil.getQuestions((childType + type), metaDada),
            singleLineItems = this.getViewModel().get('singleLineItems'),
            grid = this.createQuestionnaireGrid(),
            fieldList = [],
            left = window.lookupReference('leftColumn'),
            right = window.lookupReference('rightColumn'),
            questionnaire = window.lookupReference('questionnaire'),
            singleLineField = window.lookupReference('singleLineField');

        if (record) {
            this.loadExtraQuestionnaire(grid.getStore(), record.id);
        }

        let formFieldsArray = first.view.registration.complexStructure.ComplexStructureHelper.getComplexStructureField(metaDada, (childType + type + 'FormFields'));

        let visiblePropNames = metaDada
            .map(item => {
                return {name: item.name, type: item.dataType}
            })
            .filter(item => !hiddenProperties.includes(item.name) && !(questions && (questions.find(el => (el === item.name) || (el + 'Note' === item.name)))))
            .map(item => {
                return {name: item.name.replace(':', '_'), type: item.type}
            });

        Ext.each(metaDada, function (i) {
            if (hiddenProperties.indexOf(i.name) < 0) {
                if (questions && questions.find(el => el === i.name)) {
                    me.addQuestionnaireData(grid.getStore(), null, i.name.replace(':', '_'), i.title, record ? record.data[i.name.replace(':', '_')] : null, record ? record.data[i.name.replace(':', '_') + 'Note'] : "", true);
                    return;
                } else if (questions.find(el => el + 'Note' === i.name)) {
                    return;
                }

                if (formFieldsArray.indexOf(i.name) >= 0) {
                    let bindName = i.name.replace(':', '_');
                    let generatedFormItem = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, window.getViewModel(), 'model', visiblePropNames);
                    generatedFormItem.name = bindName;
                    if (changeableItems && changeableItems.indexOf(i.name) < 0) {
                        generatedFormItem.disabled = true;
                    }


                    generatedFormItem.readOnly = isDisabled;
                    generatedFormItem.labelWidth = 220;
                    if (generatedFormItem.bindField) {
                        generatedFormItem.bind = {};
                        generatedFormItem.bind[generatedFormItem.bindField] = '{model.' + bindName + '}';
                    } else {
                        generatedFormItem.bind = {
                            value: '{model.' + bindName + '}'
                        };
                    }

                    if (singleLineItems && singleLineItems.find(el => el === i.name)) {
                        generatedFormItem.margin = '5';
                        generatedFormItem.flex = 1;
                        booleanFieldsPanel.add(generatedFormItem);
                        return;
                    }

                    let workflowVariables = me.getViewModel().get('workflowVariables');

                    if (((changeableItems && changeableItems.length > 0) || isDisabled) && workflowVariables && workflowVariables['wf_resetQuestionnaireOnBeneficiaryShareChange'] && me.getViewModel().get('isChangeMode')
                        && me.getViewModel().get('isChangeTypeManagement') && i.name === 'fina:fiComplexStructureCapitalPercentage') {

                        generatedFormItem.listeners = {
                            change: function (field, newValue) {
                                let questions = field.oldQuestions ? field.oldQuestions : grid.getStore().getData().items;

                                if (!field.oldQuestions) {
                                    field.oldQuestions = questions;
                                    for (let item of questions) {
                                        item.phantom = item.dirty = false;
                                    }
                                }

                                if (newValue > 50 && field.oldVal !== newValue && field.oldVal <= 50 && field.isValid()) {
                                    for (let item of grid.getStore().getData().items) {
                                        if (item.get('predefined')) {
                                            item.set({
                                                status: null,
                                                note: null
                                            });
                                        }
                                    }
                                    grid.setDisabled(false);
                                } else {
                                    if (field.oldVal !== undefined) {
                                        grid.getStore().rejectChanges();
                                        let model = window.getViewModel().get('model');
                                        model.extraQuestionnaireNew = model.extraQuestionnaireRemoved = model.extraQuestionnaireUpdated = [];
                                        window.getViewModel().set('model', model);
                                    }
                                    grid.setDisabled(true);
                                }

                                if (field.oldVal === undefined) {
                                    field.oldVal = newValue;
                                }
                            }
                        };

                    }

                    generatedFormItem.name = bindName;
                    let propWithoutNamespace = i.name.split(":")[1];

                    if (propWithoutNamespace.indexOf('BeneficiaryDocType') > 0) {
                        first.view.registration.MetadataUtil.addNonResidentAndPersonalNubmerValidation(generatedFormItem, formItems, window.getViewModel(), metaDada);
                    }

                    fieldList.push(generatedFormItem);
                }
            }
        });
        singleLineField.add(booleanFieldsPanel);

        for (let i in fieldList) {
            let view = right;
            if (i < fieldList.length / 2) {
                view = left;
            }
            view.add(fieldList[i])
        }

        if (questions.length > 0) {
            grid.setDisabled((changeableItems && changeableItems.length > 0) || isDisabled);
            questionnaire.add(grid);
        }

        window.lookupReference('submitButton').hidden = isDisabled;
        window.show();
    },

    isEditDisabled: function (view, record) {
        if (this.getViewModel().get('fiRegistryStatus') === 'IN_PROGRESS' && this.getViewModel().get('isRegistryActionEditor') && this.getViewModel().get('isChangeMode') && this.getViewModel().get('isChangeTypeManagement') && record.get('fina_status') === 'ACTIVE') {
            return false;
        }
        return first.util.GridActionColumnUtil.isDataEditDisabled(view.ownerGrid.getViewModel(), record);
    },

    onEditClick: function (view, recIndex, cellIndex, item, e, record) {

        let metaDada = this.getViewModel().get('metaDada'),
            fiAction = this.getViewModel().get('fiAction'),
            className = this.getViewModel().get('detail')['properties']['fina:folderConfigChildType'];
        let changeableItems;
        if (this.getViewModel().get('isChangeMode') && this.getViewModel().get('editMode') && record.get('properties')['fina:fiParentRegistryActionId'] !== fiAction.id) {
            changeableItems = first.view.registration.MetadataUtil.getItemsFromConstraints(className, metaDada, 'ChangeableFieldNames');
            changeableItems = changeableItems.length > 0 && changeableItems[0].trim().length > 0 ? changeableItems : null;
        }

        let data = {};
        Ext.Object.each(record.data, function (key, val) {

            let meta = metaDada.find(i => i.name === key.replace('_', ':'));

            if (meta && meta.dataType === 'd:date') {
                val = new Date(val);
            }

            data[key.replace(':', '_')] = val;
        });

        this.addOrEditRecord(record.get('fina_fiComplexStructureType'), data, view, record, changeableItems);
    },

    validatePercentage: function (store, parentNode, record) {
        let sumPercentage = 0;
        if (parentNode) {
            if (store.contains(record)) {
                record.parentNode.childNodes.filter(n => n.id !== record.id && n.get('fina_status') === 'ACTIVE').forEach(function (child) {
                    sumPercentage += child.get('fina_fiComplexStructureCapitalPercentage');
                });

            } else {
                parentNode.childNodes.filter(n => n.get('fina_status') === 'ACTIVE').forEach(function (child) {
                    sumPercentage += child.get('fina_fiComplexStructureCapitalPercentage');
                });
            }

            return parseFloat((100 - sumPercentage).toFixed(10));
        } else {
            record.parentNode.childNodes.forEach(function (child) {
                if (child.id !== record.id) {
                    sumPercentage += child.get('fina_fiComplexStructureCapitalPercentage');
                }
            });

            return parseFloat((100 - sumPercentage).toFixed(10));
        }
        return sumPercentage;
    },

    onHistoryClick: function (view, recIndex, cellIndex, item, e, record) {
        let recordType = this.getViewModel().get('detail').properties['fina:folderConfigChildType'];

        let window = Ext.create('first.view.registration.FiProfileHistoriesView', {
            viewModel: {
                data: {
                    recordId: record.id,
                    recordType: recordType,
                    isComplexStructureItem: true
                }
            }
        });

        window.show();
    },

    onShowAllPersonsClick: function (btn) {
        let pressed = btn.pressed;
        btn.setText(pressed ? i18n.hideDisabled : i18n.showAll);
        btn.setIconCls(pressed ? 'x-fa fa-eye-slash' : 'x-fa fa-eye');
        let store = this.getView().getStore();
        store.clearFilter(true);
        if (!pressed) {
            store.addFilter({
                property: 'fina:finalStatus',
                operator: 'in',
                value: ['ACTIVE', 'ADDED']
            }, true);
        }
        store.load();
    },

    exportTo: function (btn) {
        const cfg = Ext.merge({
            title: 'სტრუქტურა/ბენეფიციარები',
            fileName: 'სტრუქტურა-ბენეფიციარები' + '.' + (btn.cfg.ext || btn.cfg.type)
        }, btn.cfg);

        this.getView().saveDocumentAs(cfg);
    },

    onSearch: function (textfield) {
        let store = this.getView().getStore();
        store.getProxy().setExtraParams({'query': textfield.value});
        store.getProxy().setHeaders({'Accept-Language': '*'});
        store.load();
    }
});
