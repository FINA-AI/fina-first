Ext.define('first.view.registration.FiProfileDetailsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiProfileDetailsEcm',

    requires: [
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Ext.util.Format',
        'first.config.Config',
        'first.util.ErrorHandlerUtil',
        'first.util.GridActionColumnUtil',
        'first.ux.form.field.SearchField',
        'first.view.registration.MetadataUtil',
        'Ext.exporter.text.CSV',
        'Ext.exporter.text.Html',
        'Ext.exporter.text.TSV',
        'Ext.exporter.excel.Xlsx',
        'Ext.exporter.excel.Xml',
    ],

    required: [],

    init: function () {
        let me = this,
            detail = me.getViewModel().get('detail');

        if (detail.properties && detail.properties.hasOwnProperty('fina:folderConfigChildType')) {
            let columns = [],
                childType = detail.properties['fina:folderConfigChildType'],
                isTree = detail.properties["fina:folderConfigTree"];

            let view = this.getDetailsView(me, isTree);
            this.getView().add(view);
            view.getViewModel().set('isTree', isTree);
            this.getViewModel().set('childType', childType);
            let editClickHandlerFn = (me.getViewModel().get('detail').name === 'Branches') ? 'onEditBranchClick' : 'onEditClick';

            columns.push({
                xtype: 'rownumberer'
            });

            columns.push({
                xtype: 'actioncolumn',
                width: 90,
                locked: true,
                resizable: false,
                menuDisabled: true,
                sortable: false,
                align: 'center',
                items: [{
                    tooltip: i18n.edit,
                    iconCls: 'x-fa fa-edit icon-margin',
                    isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.id === 'root';
                    },
                    handler: editClickHandlerFn,
                }, {
                    iconCls: 'x-fa fa-history icon-margin',
                    tooltip: i18n.changeHistory,
                    cls: 'firstSystemButtons',
                    text: i18n.changeHistory,
                    handler: 'onHistoryClick'
                }, {
                    iconCls: 'x-fa fa-minus-circle icon-margin redColor',
                    tooltip: i18n.delete,
                    handler: 'onRemoveClick',
                    isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                        let vm = view.grid.ownerGrid.getViewModel();
                        return !first.util.GridActionColumnUtil.getDeleteButtonEnabled(vm, record);
                    },
                    getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                        return first.util.GridActionColumnUtil.getDeleteButtonClassName(view.grid.ownerGrid.getViewModel(), record);
                    }
                }, {
                    iconCls: 'x-fa fa-ban redColor',
                    tooltip: i18n.changesDisable,
                    handler: 'onDisableClick',
                    isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                        return !first.util.GridActionColumnUtil.getDisableButtonEnabled(view.grid.ownerGrid.getViewModel(), record);
                    },
                    getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                        return first.util.GridActionColumnUtil.getDisableClassName(view.grid.ownerGrid.getViewModel(), record);
                    }
                }],

                renderer: function (value, cell) {
                    cell.css = 'first-action-column-locked';
                }
            });

            // add Status Columns for Beneficiaries and Auth persons and Complex Structure grid
            let type = me.getViewModel().get('detail').name;
            switch (type) {
                case 'Beneficiaries':
                case 'Authorized Persons':
                case 'Complex Structures':
                case 'Branches':
                    let colRenderer = function (content, cell, record) {
                        switch (content) {
                            case 'CANCELED':
                                cell.style = 'color:red;';
                                break;
                        }
                        if (record.get('fina:ComplexStructureBeneficiary')) {
                            cell.style = "background-color:#F8EEB1;";
                        }
                        return i18n[content] ? i18n[content] : content;
                    };
                    columns.push({
                        width: 200,
                        dataIndex: 'fina:finalStatus',
                        text: i18n.status,
                        tooltip: i18n.status,
                        renderer: colRenderer,
                        exportRenderer: colRenderer,
                        filter: {
                            type: 'list',
                            labelField: 'name',
                            options: [
                                {id: 'ACTIVE', name: i18n['ACTIVE']},
                                {id: 'CANCELED', name: i18n['CANCELED']},
                                {id: 'ADDED', name: i18n['ADDED']},
                                {id: 'DECLINED', name: i18n['DECLINED']}],
                            dataIndex: 'fina:finalStatus',
                            serializer: function (filter) {
                                filter['type'] = 'LIST';
                            }
                        }
                    });
                    break;
            }

            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + childType.replace(':', '_') + '/properties',
                method: 'GET',
                callback: function (options, success, response) {
                    let metaDada = JSON.parse(response.responseText),
                        hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(childType, metaDada),
                        questions = first.view.registration.MetadataUtil.getQuestions(childType, metaDada),
                        singleLineItems = first.view.registration.MetadataUtil.getSingleLineItemGroup(childType, metaDada),
                        nonEditableItems = first.view.registration.MetadataUtil.getNonEditableProps(childType, metaDada);

                    me.getViewModel().set('metaDada', metaDada);
                    me.getViewModel().set('hiddenProperties', hiddenProperties);
                    me.getViewModel().set('type', i18n[detail.name]);
                    me.getViewModel().set('questions', questions);
                    me.getViewModel().set('singleLineItems', singleLineItems);
                    me.getViewModel().set('nonEditableItems', nonEditableItems);


                    let questionNotes = [];
                    Ext.each(questions, function (question) {
                        questionNotes.push(question + 'Note');
                    });

                    Ext.each(metaDada, function (item) {
                        if (hiddenProperties.indexOf(item.name) < 0 && questions.indexOf(item.name) < 0
                            && questionNotes.indexOf(item.name) < 0) {
                            let col = {
                                width: 200,
                                dataIndex: item.name,
                                text: item.title,
                                tooltip: item.title,
                                filter: {
                                    type: 'string',
                                    dataIndex: item.name,
                                    serializer: function (filter) {
                                        filter['type'] = 'STRING';
                                    }
                                }
                            };

                            if (item.dataType === 'd:date') {
                                col.xtype = 'datecolumn';
                                col.format = first.config.Config.dateFormat;
                                col.exportRenderer = Ext.util.Format.dateRenderer(first.config.Config.dateFormat);
                                col.filter = {
                                    type: 'date',
                                    dataIndex: item.name,
                                    dateFormat: first.config.Config.dateFormat,
                                    serializer: function (filter) {
                                        filter['type'] = 'DATE';
                                    }
                                };
                            }

                            if (item.dataType === 'd:boolean') {
                                col.renderer = col.exportRenderer = function (value) {
                                    return value != null ? (value ? i18n.yes : i18n.no) : value;
                                };
                                col.filter = {
                                    type: 'boolean',
                                    dataIndex: item.name,
                                    serializer: function (filter) {
                                        filter['type'] = 'BOOLEAN';
                                    }
                                };
                            } else if ((item.constraints && me.containsConstraint(item.constraints, "LIST"))) {
                                col.renderer = col.exportRenderer = function (value) {
                                    return i18n[value] ? i18n[value] : value;
                                };
                                col.filter = {
                                    type: 'list',
                                    labelField: 'name',
                                    options: first.view.registration.MetadataUtil.getAllowedValuesWithTranslations(item.constraints),
                                    dataIndex: item.name,
                                    serializer: function (filter) {
                                        filter['type'] = 'LIST';
                                    }
                                };
                            } else if (item.name.includes('FromAdministrators')) {
                                col.renderer = col.exportRenderer = function (value, meta, record) {
                                    return record.get(item.name + 'FullName');
                                };
                            }

                            columns.push(col);
                        }
                    });

                    if (isTree) {
                        for (let c of columns) {
                            if (c.xtype !== 'actioncolumn') {
                                c.xtype = 'treecolumn';
                                c.renderer = function (content, cell, record) {
                                    let tooltip = i18n[record.get('fina:status')];
                                    cell.tdAttr = 'data-qtip="' + (tooltip ? tooltip : '') + '"';
                                    if (record.get('fina:status') === 'CANCELED') {
                                        cell.glyph = 'xf05e@FontAwesome';
                                    }
                                    return content;
                                };
                                break;
                            }
                        }
                    }

                    view.setColumns(columns);
                }
            });

            if (view) {
                view.addListener({
                    itemdblclick: {
                        fn: function (view, record) {
                            let metaDada = me.getViewModel().get('metaDada'),
                                data = {};

                            Ext.Object.each(record.data, function (key, val) {
                                let meta = metaDada.find(i => i.name === key);

                                if (meta && meta.dataType === 'd:date') {
                                    val = new Date(val);
                                }

                                data[key.replace(':', '_')] = val;
                            });
                            me.addOrEdit(data, view, record, view.getStore());
                        }
                    }
                });
            }
        }
    },

    containsConstraint: function (constraints, type) {
        let res = false;
        Ext.each(constraints, function (constraint) {
            if (constraint.type === type) {
                res = true;
            }
        });
        return res;
    },

    onAddButtonClick: function () {
        let model = {};
        this.addOrEdit(model);
    },

    onEditBranchClick(view, recIndex, cellIndex, item, e, record) {
        let type = this.getViewModel().get('detail').name;
        if (type === 'Branches') {
            let branchType = record.data['fina:fiRegistryBranchType'];
            let me = this;
            me.getView().mask(i18n.pleaseWait);
            this.getMetaDataForBranchType(this.getViewModel().get('childType'), branchType, function () {
                me.getView().unmask();
                me.onEditClick(view, recIndex, cellIndex, item, e, record)
            });
        }
    },

    onEditClick: function (view, recIndex, cellIndex, item, e, record) {

        let metaDada = this.getViewModel().get('metaDada');

        let data = {};
        Ext.Object.each(record.data, function (key, val) {

            let meta = metaDada.find(i => i.name === key);

            if (meta && meta.dataType === 'd:date') {
                val = new Date(val);
            }

            data[key.replace(':', '_')] = val;
        });

        this.addOrEdit(data, view, record);
    },

    onRemoveClick: function (view, recIndex, cellIndex, item, e, record) {
        let me = this;
        Ext.MessageBox.confirm(i18n.confirm, i18n.removeConfirmQuestion, function (btn) {
            if (btn === 'yes') {
                let store = me.getView().getStore(), type = me.getViewModel().get('type');
                if (me.getViewModel().get('isTree')) {
                    let node = store.getNodeById(record.get('id'));
                    node.removeAll();
                    node.remove();
                } else {
                    store.remove(record);
                }

                store.sync({
                    callback: function () {
                        me.fireEvent('onAfterSubmitFiRegistryDetailCall', null, me.getViewModel().get('theFi'), null, type === 'Branches' ? me.displayBranchesWarning : null);
                    }
                });
            }
        });
    },

    onDisableClick: function (view, recIndex, cellIndex, item, e, record) {
        if (record.get('fina:status') === 'CANCELED') {
            return;
        }

        let me = this;
        Ext.MessageBox.confirm(i18n.confirm, i18n.disableConfirmationQuestion, function (btn) {
            if (btn === 'yes') {
                let store = me.getView().getStore(),
                    isChangeMode = view.grid.ownerGrid.getViewModel().get('isChangeMode'),
                    isChangeBranchMode = view.grid.ownerGrid.getViewModel().get('isChangeBranchMode'),
                    isChangeTypeManagement = view.grid.ownerGrid.getViewModel().get('isChangeTypeManagement'),
                    fiAction = me.getViewModel().get('fiAction'),
                    data = {'fina:status': 'CANCELED', 'fina:ignoreWarnings': true},
                    type = me.getViewModel().get('type'),
                    theFi = me.getViewModel().get('theFi'),
                    nodeType = me.getViewModel().get('detail').name,
                    isSuperUserChangeMode = view.grid.ownerGrid.getViewModel().get('theFi')['fina_fiRegistryStatus'] !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin;

                if (isSuperUserChangeMode) {
                    data['fina:finalStatus'] = 'CANCELED';
                }

                if ((isChangeMode && isChangeTypeManagement) || isChangeBranchMode || isSuperUserChangeMode) {

                    switch (nodeType) {
                        case 'Beneficiaries':
                        case 'Authorized Persons':
                        case 'Branches':
                        case 'Complex Structures':
                            data['fina:fiRegistryActionId'] = theFi['fina_fiRegistryLastActionId'];
                            break;
                    }

                    record.set(data);
                    if (record.dirty) {
                        me.getView().mask(i18n.pleaseWait);
                        store.sync({
                            callback: function () {
                                me.getView().unmask();
                                if (me.getViewModel().get('isTree')) {
                                    let node = store.getNodeById(record.get('id'));
                                    store.load({node: node});
                                }
                                me.fireEvent('onAfterSubmitFiRegistryDetailCall', null, me.getViewModel().get('theFi'), null, type === 'Branches' ? me.displayBranchesWarning : null);
                            }
                        });
                    }
                }
            }
        });
    },

    displayBranchesWarning: function (validationResults) {
        if (!validationResults["fina:fiRegistryValidationResultBranchesHeadOfficeExists"]) {
            Ext.toast(i18n.noHeadOfficesSpecifiedWarning, i18n.information);
        } else if (!validationResults["fina:fiRegistryValidationResultBranchesHasSingleHeadOffice"]) {
            Ext.toast(i18n.moreThanOneHeadOfficeWarning, i18n.information);
        }
    },

    addOrEdit: function (model, view, record, store, submitSuccessCallback) {
        let window = Ext.create('first.view.registration.FiProfileDetailView', {}),
            type = this.getViewModel().get('type'),
            me = this,
            isDisabled = false,
            booleanFieldsPanel = Ext.create('Ext.panel.Panel', {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                margin: 0
            });

        if (view && record) {
            isDisabled = me.isEditDisabled(view, record)
        }

        window.getViewModel().set('model', model);
        window.getViewModel().set('detail', this.getViewModel().get('detail'));
        window.getViewModel().set('nodeType', this.getViewModel().get('nodeType'));
        window.getViewModel().set('record', record);
        window.getViewModel().set('type', type);
        window.getViewModel().set('tabId', this.getViewModel().get('tabId'));
        window.getViewModel().set('store', store ? store : this.getView().getStore());
        window.getViewModel().set('edit', model['id']);
        window.getViewModel().set('selectedNode', this.getViewModel().get('selectedNode'));
        window.getViewModel().set('isTree', this.getViewModel().get('isTree'));
        window.getViewModel().set('theFi', this.getViewModel().get('theFi'));
        window.getViewModel().set('fiRegistryLastActionId', this.getViewModel().get('theFi')['fina_fiRegistryLastActionId']);
        window.getViewModel().set('editMode', this.getViewModel().get('editMode'));

        if (window.getViewModel().get('detail').name === "Branches" && window.getViewModel().get('theFi')['fina_fiActionType'] === 'BRANCHES_EDIT' && record) {
            window.getViewModel().set('lastAddressValues', {
                region: record.get("fina:fiRegistryBranchAddressRegion"),
                city: record.get("fina:fiRegistryBranchAddressCity"),
                address: record.get("fina:fiRegistryBranchAddress"),
            });
        }

        if (submitSuccessCallback) {
            window.getViewModel().set('submitSuccessCallback', submitSuccessCallback);
        }

        let metaDada = this.getViewModel().get('metaDada'),
            hiddenProperties = this.getViewModel().get('hiddenProperties'),
            formItems = window.lookupReference('formItems'),
            questionnaire = window.lookupReference('questionnaire'),
            singleLineField = window.lookupReference('singleLineField'),
            questions = this.getViewModel().get('questions'),
            singleLineItems = this.getViewModel().get('singleLineItems'),
            nonEditableItems = this.getViewModel().get('nonEditableItems'),
            grid = this.createQuestionnaireGrid(),
            fieldList = [],
            left = window.lookupReference('leftColumn'),
            right = window.lookupReference('rightColumn');

        if (record) {
            this.loadExtraQuestionnaire(grid.getStore(), record.id);
        }

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
                    me.addQuestionnaireData(grid.getStore(), null, i.name.replace(':', '_'), i.title, record ? record.data[i.name] : null, record ? record.data[i.name + 'Note'] : "", true);
                    return;
                } else if (questions.find(el => el + 'Note' === i.name)) {
                    return;
                }

                let bindName = i.name.replace(':', '_');
                let generatedFormItem = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, window.getViewModel(), 'model', visiblePropNames);
                generatedFormItem.name = bindName;

                let propWithoutNamespace = i.name.split(":")[1];
                let type = me.getViewModel().get('detail').name;

                if (type === 'Authorized Persons' && propWithoutNamespace === 'fiAuthorizedPersonDocType') {
                    // validateNonResidentAndPersonalNumberFormItem = generatedFormItem;
                    first.view.registration.MetadataUtil.addNonResidentAndPersonalNubmerValidation(generatedFormItem, formItems, window.getViewModel(), metaDada);

                }

                generatedFormItem.readOnly = isDisabled;
                if (generatedFormItem.bindField) {
                    generatedFormItem.bind = {};
                    generatedFormItem.bind[generatedFormItem.bindField] = '{model.' + bindName + '}';
                } else {
                    generatedFormItem.bind = {
                        value: '{model.' + bindName + '}'
                    };
                }
                generatedFormItem.labelWidth = 320;

                if (singleLineItems && singleLineItems.find(el => el === i.name)) {
                    generatedFormItem.margin = '5';
                    generatedFormItem.flex = 1;
                    booleanFieldsPanel.add(generatedFormItem);
                    return;
                }

                me.isFieldDisabled(i.name, generatedFormItem, window.getViewModel(), nonEditableItems);

                let workflowVariables = me.getViewModel().get('workflowVariables');

                if (workflowVariables && workflowVariables['wf_resetQuestionnaireOnBranchAddressChange'] && me.getViewModel().get('isBranchesEditMode')
                    && (i.name === "fina:fiRegistryBranchAddress" || i.name === "fina:fiRegistryBranchAddressCity")) {

                    if (!generatedFormItem.listeners) {
                        generatedFormItem.listeners = {}
                    }

                    if (!generatedFormItem.listeners.change) {
                        generatedFormItem.listeners.change = function (field, newVal, oldVal) {
                            let newValue = field.getValue();
                            let questions = field.oldQuestions ? field.oldQuestions : grid.getStore().getData().items;

                            if (!field.oldQuestions) {
                                field.oldQuestions = questions;
                                for (let item of questions) {
                                    item.phantom = item.dirty = false;
                                }
                            }

                            if (field.oldVal === undefined) {
                                field.oldVal = newValue;
                            }

                            if (newValue === field.oldVal) {
                                let vm = window.getViewModel();
                                let rawValues = [vm.get('fina_fiRegistryBranchRegionComponent.value'), vm.get('fina_fiRegistryBranchCityComponent.value'), vm.get('fina_fiRegistryBranchAddressComponent.value')];
                                let lastValues = [vm.get('lastAddressValues.region'), vm.get('lastAddressValues.city'), vm.get('lastAddressValues.address')];

                                if (JSON.stringify(lastValues) === JSON.stringify(rawValues)) {
                                    grid.getStore().rejectChanges();
                                }
                            }

                            if (field.oldVal !== newValue && field.isValid()) {
                                for (let item of grid.getStore().getData().items) {
                                    if (item.get('predefined')) {
                                        item.set({
                                            status: null,
                                            note: null
                                        });
                                    } else {
                                        grid.getStore().remove(item);
                                    }
                                }
                            }
                        }
                    }
                }

                fieldList.push(generatedFormItem);
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
            grid.setDisabled(isDisabled);
            questionnaire.add(grid);
        }

        window.lookupReference('submitButton').hidden = isDisabled;
        window.show();
    },

    isFieldDisabled: function (fieldName, item, vm, nonEditableItems) {
        let name = fieldName.split(':')[1];
        if (name === "fiRegistryBranchReportCardNumber") {
            item.disabled = true;
        }

        if (nonEditableItems && nonEditableItems.includes(fieldName)) {
            item.disabled = true;
        }

    },

    isEditDisabled: function (view, record) {
        return first.util.GridActionColumnUtil.isDataEditDisabled(view.grid.ownerGrid.getViewModel(), record);
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().getStore().reload();
    },

    getDetailsView: function (me, isTree) {
        let store = isTree ? me.getDetailsStore(me, true) : me.getDetailsStore(me, false);

        let tbar = {
            cls: 'firstFiRegistryTbar',
            items: []
        };

        let type = me.getViewModel().get('detail').name;
        if (type === 'Branches') {
            let branchTypeMenuItems = this.getBranchTypeMenuItems();

            tbar.items.push({
                text: i18n.add,
                iconCls: 'x-fa fa-plus',
                cls: 'finaPrimaryBtn',
                disabled: false,
                bind: {
                    hidden: '{isCancellationMode || !editMode || isEditBranchMode || (isChangeMode && !isChangeTypeManagement) || (isChangeBranchMode && detail.name!=="Branches")}',
                },
                menu: {
                    items: branchTypeMenuItems
                }
            });
        } else {
            tbar.items.push({
                iconCls: 'x-fa fa-plus',
                cls: 'finaPrimaryBtn',
                text: i18n.add,
                handler: 'onAddButtonClick',
                bind: {
                    hidden: '{isCancellationMode || !editMode || isEditBranchMode || (isChangeBranchMode && detail.name!=="Branches") ' +
                        '|| (isChangeMode && !isChangeTypeManagement)||(isChangeMode && detail.name!=="Beneficiaries" && detail.name!=="Authorized Persons") ' +
                        '|| (isIndividualEntrepreneur && detail.name==="Authorized Persons")}'
                }
            });
        }

        if (this.getViewModel().get('theFi')['fina_fiActionType'] !== 'REGISTRATION'
            || (this.getViewModel().get('theFi')['fina_fiActionType'] === 'REGISTRATION')
            && this.getViewModel().get('theFi')['fina_fiRegistryStatus'] !== 'IN_PROGRESS') {

            switch (type) {
                case 'Beneficiaries':
                case 'Authorized Persons':
                case 'Complex Structures':
                case 'Branches':
                    tbar.items.push({
                        iconCls: 'x-fa fa-eye-slash',
                        cls: 'firstSystemButtons',
                        tooltip: i18n.showAll,
                        text: i18n.showAll,
                        handler: 'onShowAllPersonsClick',
                        enableToggle: true,
                        pressed: false
                    });
                    store.addFilter({
                        property: 'fina:finalStatus',
                        operator: 'in',
                        value: ['ACTIVE', 'ADDED']
                    }, true);
                    break;
            }

        }

        tbar.items.push({
            xtype: 'ux-searchField',
            reference: 'searchField',
            flex: 1,
            onSearch: 'onSearch'
        }, {
            xtype: 'export-to-button'
        });

        return Ext.create({
            xtype: isTree ? 'treepanel' : 'grid',
            viewModel: me.getView().getViewModel(),
            store: store,

            rootVisible: true,
            scrollable: true,
            columnLines: true,

            viewConfig: {
                getRowClass: function (record, index, rowParams) {
                    let status = record.get('properties') ? record.get('properties')['fina:status'] : record.get('fina:status');
                    if (status === 'CANCELED') {
                        return 'grid-canceled-row';
                    }
                }
            },

            enableLocking: true,
            lockedGridConfig: {
                style: {
                    border: 'none'
                }
            },

            bind: {
                selection: '{selectedNode}'
            },

            plugins: [{
                ptype: 'gridfilters'
            }, {
                ptype: 'gridexporter'
            }],

            columns: [],

            tbar: tbar,

            bbar: isTree ? null : {
                xtype: 'pagingtoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                }
            }
        });
    },

    getBranchTypeMenuItems: function () {
        let branchTypes = this.getViewModel().get('fiType').branchTypes,
            branchTypeMenuItems = [];

        if (branchTypes && branchTypes.length > 0) {
            let me = this;
            Ext.each(branchTypes, function (branchType) {
                branchTypeMenuItems.push({
                    text: i18n[branchType] ? i18n[branchType] : branchType,
                    handler: 'onAddBranch',
                    iconCls: me.getBranchTypeIconCls(branchType),
                    type: branchType,
                    disabled: false,
                });
            });
        } else { // Default menu items
            branchTypeMenuItems = [
                {
                    text: i18n.HEAD_OFFICE,
                    tooltip: i18n.HEAD_OFFICE,
                    handler: 'onAddBranch',
                    iconCls: 'x-fa fa-building',
                    type: 'HEAD_OFFICE',
                }, {
                    text: i18n.SUBDIVISION,
                    tooltip: i18n.SUBDIVISION,
                    handler: 'onAddBranch',
                    iconCls: 'x-fa fa-map-marker',
                    type: 'SUBDIVISION'
                }
            ];
        }

        return branchTypeMenuItems;
    },

    getBranchModelSuffix: function (branchTypeCode) {
        let res = '';

        if (branchTypeCode) {
            let words = branchTypeCode.split('_');
            words.forEach(function (word) {
                word = word.toLowerCase();
                res += word.charAt(0).toUpperCase() + word.slice(1);
            });
        }

        return res;
    },

    getBranchTypeIconCls: function (branchTypeCode) {
        let res = '';

        switch (branchTypeCode) {
            case 'HEAD_OFFICE':
                res = 'x-fa fa-building';
                break;
            case 'STOCKROOM':
                res = 'x-fa fa-box-open'; // fa-truck-loading, fa-warehouse, fa-boxes,
                break;
            case 'ELECTRONIC_DEVICE':
                res = 'x-fa fa-tablet-alt';
                break;
            default:
                res = 'x-fa fa-map-marker';
                break;
        }

        return res;
    },

    onAddBranch: function (component) {
        const childType = this.getViewModel().get('childType'),
            branchType = component.type;
        let me = this;
        this.getMetaDataForBranchType(childType, branchType, function () {
            const vm = me.getViewModel(),
                fiAction = vm.get('fiAction'),
                processes = ['REGISTRATION', 'BRANCHES_CHANGE'];

            let model = {};

            if (processes.includes(fiAction['fina_fiRegistryActionType'])) {
                Ext.Object.each(vm.get('theFi'), (key, value) => {
                    if (key.endsWith('fiRegistryTaskNumber')) {
                        let formItemName = 'fina_fiRegistryBranchTaskNumber';
                        model[formItemName] = fiAction['fina_fiRegistryActionType'] === 'BRANCHES_CHANGE'
                            ? fiAction['fina_fiRegistryActionTaskNumber'] : value;

                    } else if (key.endsWith('fiRegistryTaskReceiptDate')) {
                        let formItemName = 'fina_fiRegistryBranchTaskReceiptDate';
                        model[formItemName] = fiAction['fina_fiRegistryActionType'] === 'BRANCHES_CHANGE'
                            ? fiAction['fina_fiRegistryActionTaskReceiptDate'] : value;
                    }
                })
            }

            me.addOrEdit(model);
        });
    },

    getMetaDataForBranchType(nodeType, branchType, successCallback) {
        let me = this,
            branchNodeType = this.getViewModel().get('childType') + this.getBranchModelSuffix(branchType);
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + branchNodeType.replace(':', '_') + '/properties',
            method: 'GET',
            callback: function (options, success, response) {
                if (success) {
                    me.bindBranchPropertiesData(me.getViewModel(), response, branchNodeType, branchType, successCallback);
                } else {
                    // If properties for given branch type are not configured, use Subdivision properties
                    branchNodeType = nodeType + me.getBranchModelSuffix('SUBDIVISION');
                    Ext.Ajax.request({
                        url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + branchNodeType.replace(':', '_') + '/properties',
                        method: 'GET',
                        success: function (response) {
                            me.bindBranchPropertiesData(me.getViewModel(), response, branchNodeType, branchType, successCallback);
                        },
                        failure: function (response) {
                            first.util.ErrorHandlerUtil.showErrorWindow(response, i18n.unsupportedBranchType);
                        }
                    });
                }
            }
        });
    },

    bindBranchPropertiesData: function (viewModel, response, branchNodeType, branchType, afterFn) {
        let metaData = JSON.parse(response.responseText),
            hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(branchNodeType, metaData),
            questions = first.view.registration.MetadataUtil.getQuestions(branchNodeType, metaData),
            singleLineItems = first.view.registration.MetadataUtil.getSingleLineItemGroup(branchNodeType, metaData);

        viewModel.set('metaDada', metaData);
        viewModel.set('nodeType', branchNodeType);
        viewModel.set('hiddenProperties', hiddenProperties);
        viewModel.set('type', i18n[branchType]);
        viewModel.set('questions', questions);
        viewModel.set('singleLineItems', singleLineItems);

        if (afterFn) {
            afterFn();
        }
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

    getDetailsStore: function (me, isTree) {
        return Ext.create(isTree ? 'Ext.data.TreeStore' : 'Ext.data.Store', {
            model: isTree ? 'Ext.data.TreeModel' : 'Ext.data.Model',

            fields: [],

            nodeParam: 'parentId',
            remoteFilter: !isTree,

            proxy: {
                type: 'rest',
                enablePaging: true,
                url: first.config.Config.remoteRestUrl + 'ecm/fi/' + me.getViewModel().get('tabId') + '/details',
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'totalResults',
                    transform: {
                        fn: function (data) {
                            let result = [];
                            if (data && data.list) {

                                if (!isTree) {
                                    // sort by creation time desc
                                    data.list.sort(function (x, y) {
                                        return y.createdAt - x.createdAt;
                                    });
                                }

                                Ext.each(data.list, function (record) {
                                    if (record) {
                                        let props = record.properties;
                                        if (props) {
                                            props.id = record.id;
                                            result.push(props);
                                        }
                                    }
                                }, this);
                                data.list = result;
                            }
                            return data;
                        },
                        scope: this
                    }
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                }
            },

            autoLoad: true,
            pageSize: 30,
        });
    },

    createQuestionnaireGrid: function () {

        let extraQuestionnaireNew = [],
            extraQuestionnaireUpdated = [];

        const removeExtraQuestionnaire = (store, records, index, isMove, eOpts) => {
            extraQuestionnaireNew = extraQuestionnaireNew.filter(function (obj) {
                return obj.id !== records[0].id;
            });

            const removedRecords = [];
            Ext.each(store.getRemovedRecords(), function (removedRecord) {
                removedRecords.push(removedRecord.id);
            });
            grid.up().up().up().getViewModel().get('model').extraQuestionnaireRemoved = removedRecords;
        };

        const updateQuestionnaire = (store, record) => {
            let model = grid.up().up().up().getViewModel().get('model'),
                data = record.data;

            if (data.predefined) {
                model[data.type + 'Note'] = data.note;
                model[data.type] = data.status;
            } else {
                let item = {
                    id: data.id,
                    question: data.question,
                    status: data.status,
                    note: data.note
                };

                if (item.id.startsWith('extModel')) { // new records
                    extraQuestionnaireNew = extraQuestionnaireNew.filter(function (obj) {
                        return obj.id !== item.id;
                    });
                    Ext.Array.push(extraQuestionnaireNew, item);
                    model.extraQuestionnaireNew = extraQuestionnaireNew;
                } else { // updated
                    extraQuestionnaireUpdated = extraQuestionnaireUpdated.filter(function (obj) {
                        return obj.id !== item.id;
                    });
                    Ext.Array.push(extraQuestionnaireUpdated, item);
                    model.extraQuestionnaireUpdated = extraQuestionnaireUpdated;
                }
            }
        };

        let grid = Ext.create('Ext.grid.Panel', {
            loadMask: true,
            columnLines: true,

            reference: 'questionGrid',

            store: {
                groupField: 'predefined',
                groupDir: 'desc',
                listeners: {
                    update: updateQuestionnaire,
                    remove: removeExtraQuestionnaire
                }
            },

            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },

            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    if (context.record.get("predefined") && context.colIdx < 2) {
                        return false;
                    }
                }
            },

            bind: {
                selection: '{selectedQuestionnaireItem}'
            },

            features: [{
                ftype: 'grouping',
                startCollapsed: false,
                groupHeaderTpl: [
                    "<tpl if='name === \"true\"'>",
                    i18n.fiActionQuestionnairePredefined,
                    "<tpl else>",
                    i18n.fiActionQuestionnaireExtra,
                    "</tpl>"
                ]
            }],

            tbar: {
                items: [{
                    text: i18n.delete,
                    iconCls: 'x-fa fa-trash-alt',
                    disabled: true,
                    handler: function (comp, e, eOpts) {
                        grid.getStore().remove(grid.getSelectionModel().getSelection()[0]);
                    },
                    bind: {
                        disabled: '{selectedQuestionnaireItem.predefined}'
                    }
                }, {
                    text: i18n.add,
                    iconCls: 'x-fa fa-plus',
                    cls: 'finaSecondaryBtn',
                    handler: function (comp, e, eOpts) {
                        let store = grid.getStore();
                        store.add({
                            predefined: false
                        });

                        grid.findPlugin('cellediting').startEditByPosition({
                            row: store.getData().length,
                            column: 1
                        });
                    },
                }]
            },

            columns: [{
                flex: 0,
                xtype: 'rownumberer',
                enableGroupContext: true
            }, {
                header: i18n.fiActionQuestionnaireQuestion,
                dataIndex: 'question',
                flex: 4,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                },
                renderer: function (value, call, record) {
                    let encodedValue = Ext.util.Format.htmlEncode(value);
                    let status = record.get('status');
                    let color = status != null ? status ? "#73b51e" : '#cf4c35' : "";
                    let isObligatory = record.data.obligatory;
                    let val = encodedValue ? encodedValue : "";

                    return "<span data-qtip='" + val + "'"
                        + (color ? " style='color:" + color + "'" : "")
                        + ">" + (isObligatory ? "* " : "") + val + "</span>";
                },

            }, {
                xtype: 'actioncolumn',
                width: 80,
                menuDisabled: true,
                sortable: false,
                items: [{
                    iconCls: 'x-fa fa-check green icon-margin',
                    handler: function (view, recIndex, cellIndex, item, e, record) {
                        record.set('status', true);
                    },
                }, {
                    iconCls: 'x-fa fa-ban red icon-margin',
                    handler: function (view, recIndex, cellIndex, item, e, record) {
                        record.set('status', false);
                    },
                }, {
                    iconCls: 'x-fa fa-eraser',
                    handler: function (view, recIndex, cellIndex, item, e, record) {
                        record.set('status', null);
                        record.set('note', "");
                    },
                }]
            }, {
                header: i18n.fiActionQuestionnaireNote,
                dataIndex: 'note',
                flex: 2,
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                },
                renderer: function (value) {
                    if (value) {
                        let encodedValue = Ext.util.Format.htmlEncode(value);
                        return "<span data-qtip='" + encodedValue + "'>" + encodedValue + "</span>";
                    }
                    return null;
                }
            }],
        });

        return grid;
    },

    loadExtraQuestionnaire: function (store, itemId) {
        let me = this;
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/fi/item/' + itemId + '/questionnaires/extra',
            method: 'GET',
            callback: function (options, success, response) {
                let result = JSON.parse(response.responseText)
                if (result && result.list) {
                    Ext.each(result.list, function (questionnaireItem) {
                        let status = (questionnaireItem.status === 'OK' ? true : questionnaireItem.status === 'NO' ? false : null);
                        me.addQuestionnaireData(store, questionnaireItem.id, null, questionnaireItem.question, status, questionnaireItem.note, false);
                    });
                }
            }
        });
    },

    addQuestionnaireData: function (store, id, questionType, questionTitle, status, note, predefined) {
        let d = {
            type: questionType,
            question: questionTitle,
            status: status,
            note: note,
            predefined: predefined
        };

        if (id) {
            d.id = id;
        }

        store.add(d);
    },

    onHistoryClick: function (view, recIndex, cellIndex, item, e, record) {

        let recordType = this.getViewModel().get('detail').properties['fina:folderConfigChildType'];

        let window = Ext.create('first.view.registration.FiProfileHistoriesView', {
            viewModel: {
                data: {
                    recordId: record.id,
                    recordType: recordType
                }
            }
        });

        window.show();
    },

    onSearch: function (textfield) {
        let store = this.getView().getStore();
        store.getProxy().setExtraParams({'query': textfield.value});
        store.getProxy().setHeaders({'Accept-Language': '*'});
        store.load({page: 1});
    },

    exportTo: function (btn) {
        const title = this.getViewModel().get('type') || i18n.export,
            view = this.getView(),
            store = this.getView().getStore();

        const cfg = Ext.merge({
            title: title,
            fileName: title + '.' + (btn.cfg.ext || btn.cfg.type)
        }, btn.cfg);

        if (store && store.getTotalCount() > store.getPageSize()) {
            const page = store.currentPage;

            view.mask(i18n.exporting);
            store.load({
                page: 1,
                limit: store.getTotalCount(),
                start: 0,
                callback: function () {
                    view.saveDocumentAs(cfg);

                    store.load({
                        page: page,
                        start: (page - 1) * store.getPageSize(),
                        callback: function () {
                            view.unmask();
                        }
                    });
                }
            });
        } else {
            view.saveDocumentAs(cfg);
        }
    }
});
