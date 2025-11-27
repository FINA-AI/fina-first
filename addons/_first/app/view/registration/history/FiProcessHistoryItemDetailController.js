Ext.define('first.view.registration.history.FiProcessHistoryItemDetailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiProcessHistoryItemDetailController',

    listen: {
        controller: {
            'fiProcessHistoryItemController': {
                reloadFiProcessHistoryItemDetails: 'load'
            }
        }
    },

    /**
     * Called when the view is created
     */
    init: function () {

    },

    load: function (actionId, fiProcessHistoryItem) {
        let selectedActionGridItem = this.getViewModel().get('selectedActionGridItem');
        if (selectedActionGridItem.id === actionId) {
            this.initDetailView(selectedActionGridItem, fiProcessHistoryItem);
        }
    },

    initDetailView: function (selectedActionGridItem, fiProcessHistoryItem) {
        this.getView().mask(i18n.pleaseWait);
        this.getView().removeAll(true);

        this.getViewModel().set('title', (i18n[fiProcessHistoryItem.name] || fiProcessHistoryItem.name) + ' ' + i18n.details);

        if (fiProcessHistoryItem && fiProcessHistoryItem.properties) {
            let childType = fiProcessHistoryItem.properties['fina:folderConfigChildType'];
            switch (childType) {
                case 'fina:fiRegistryActionQuestionnaire':
                    this.initQuestionnaire(selectedActionGridItem);
                    break;
                case 'fina:fiSanctionedPeopleChecklistItem':
                    this.initSanctionedPeopleChecklist(selectedActionGridItem);
                    break;
                case 'fina:fiDocument':
                    this.initDocuments(selectedActionGridItem, fiProcessHistoryItem);
                    break;
                case 'fina:fiBranchesChange':
                    this.initBranchedChange(selectedActionGridItem);
                    break;
                case 'fina:fiGap':
                    this.initGap(selectedActionGridItem, fiProcessHistoryItem, fiProcessHistoryItem.name === "ControllerGaps");
                    break;
                case 'fina:fiManagementChange':
                    this.initManagementChange(selectedActionGridItem);
                    break;
                case 'fina:fiActionLiquidator':
                    this.initActionLiquidator(selectedActionGridItem);
                    break;
                default:
                    this.initNotAvailable();
                    break;
            }

        } else {
            this.initNotAvailable();
        }
        this.getView().unmask();
    },

    initNotAvailable: function () {
        this.getView().add({
            margin: 5,
            html: i18n.processHistoryItemDetailsNotAvailable
        });
    },

    initQuestionnaire: function (selectedActionGridItem) {
        let questionnaireView = Ext.create('first.view.registration.FiProfileQuestionnaireView', {
            emptyText: i18n.processHistoryItemQuestionnaireNotPresentedEmpty,
            viewModel: {},
            tbar: null
        });

        questionnaireView.getStore().proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/actions/' + selectedActionGridItem.id + '/questionnaires?fiRegistryId=' + this.getViewModel().get('fiRegistry').id);
        this.getView().add(questionnaireView);
    },

    initSanctionedPeopleChecklist: function (selectedActionGridItem) {
        let sanctionedPeopleView = Ext.create('first.view.registration.history.registration.SanctionedPeopleChecklistView', {
            emptyText: i18n.processHistoryItemSanctionedPeopleNotPresentedEmpty,
            viewModel: {
                data: {
                    fiRegistryActionId: selectedActionGridItem.id
                }
            }
        });
        this.getView().add(sanctionedPeopleView);
    },

    initDocuments: function (selectedActionGridItem, fiProcessHistoryItem) {
        let documentationView = Ext.create('first.view.registration.FiProfileDocumentationView', {
            tbar: null,
            viewModel: {
                data: {
                    detail: {
                        rootNodeId: fiProcessHistoryItem.id,
                        url: first.config.Config.remoteRestUrl + 'ecm/fi/documents/' + fiProcessHistoryItem.id
                    },
                    isGoToProcessDisabled: true
                }
            }
        });
        this.getView().add(documentationView);
    },

    initBranchedChange: function (selectedActionGridItem) {
        let branchChangeView = Ext.create('first.view.registration.history.change.BranchChangeGridView', {
            emptyText: i18n.processHistoryItemBranchChangesNotPresentedEmpty,
            viewModel: {
                data: {
                    fiRegistryActionId: selectedActionGridItem.id
                }
            }
        });
        this.getView().add(branchChangeView);
    },

    initGap: function (selectedActionGridItem, fiProcessHistoryItem, displayCorrectionFields) {
        let gapView = Ext.create('first.view.registration.history.registration.GapGridView', {
            emptyText: i18n.processHistoryGapsAreNotPresented,
            viewModel: {
                data: {
                    fiRegistryActionId: selectedActionGridItem.id,
                    relativePath: fiProcessHistoryItem.name,
                    displayCorrectionFields: displayCorrectionFields
                }
            }
        });
        this.getView().add(gapView);
    },

    initManagementChange: function (selectedActionGridItem) {
        if (selectedActionGridItem.get('changeFormType') === 'organizationalForm') {
            this.initOrganizationalChangeForm(selectedActionGridItem, this.getViewModel().get('fiRegistry')['nodeType']);
        } else {
            let managementChangeView = Ext.create('first.view.registration.history.change.ManagementChangeGridView', {
                emptyText: i18n.processHistoryManagementChangeAreNotPresented,
                viewModel: {
                    data: {
                        fiRegistryActionId: selectedActionGridItem.id
                    }
                }
            });
            this.getView().add(managementChangeView);
        }
    },

    initActionLiquidator: function (selectedActionGridItem) {
        let liquidatorView = Ext.create('first.view.registration.task.shared.ActionLiquidatorView', {
            tbar: null,
            viewModel: {
                data: {
                    fiAction: {
                        id: selectedActionGridItem.id
                    }
                }
            }
        });
        this.getView().add(liquidatorView);
    },

    initOrganizationalChangeForm: function (selectedActionGridItem, dataType) {
        let me = this;
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + selectedActionGridItem.get('id') + '/children',
            method: 'GET',
            success: function (response) {
                let data = JSON.parse(response.responseText).list.find(d => d.name === 'ORGANIZATIONAL_FORM_AND_NAME_CHANGE_DATA');

                let changedData = {};
                Ext.Object.each(data.properties, function (key, val) {
                    let newKey = key.replace(':', '_');
                    changedData[newKey] = val
                });

                me.getViewModel().set('changedData', changedData);
                me.getViewModel().set('currentData', {});
                me.drawOrganizationalChangeView(selectedActionGridItem, dataType);
            }
        });
    },

    drawOrganizationalChangeView: function (selectedActionGridItem, dataType) {
        let me = this;
        Ext.suspendLayouts();

        let vbox = Ext.create(
            {
                'xtype': 'container',
                flex: 1,
                'layout': {
                    type: 'vbox',
                    align: 'stretch'
                }
            }
        );

        let fieldSet = Ext.create(
            {
                xtype: 'fieldset',
                title: i18n.changesGridTitle,
                flex: 0,
                items: [vbox]
            }
        );
        me.loadFiPreviousVersion();
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + dataType.replace(':', '_') + '/properties',
            method: 'GET',
            callback: function (options, success, response) {

                let metaDada = JSON.parse(response.responseText),
                    hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(dataType, metaDada),
                    editableProps = first.view.registration.MetadataUtil.getGeneralInfoEditableProperties(dataType, metaDada),
                    editablePropNames = [];

                Ext.each(editableProps, function (prop) {
                    editablePropNames.push(prop.name);
                });

                editablePropNames = (!!editablePropNames && editablePropNames.length > 0) ? editablePropNames : ['fina:fiRegistryLegalFormType', 'fina:fiRegistryName'];

                Ext.each(metaDada, function (i) {
                    if (hiddenProperties.indexOf(i.name) < 0 && editablePropNames.includes(i.name)) {
                        let bindName = i.name.replace(':', '_');
                        i.mandatory = false;

                        let oldValue = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, me.getViewModel());
                        oldValue.fieldLabel = oldValue.fieldLabel + ' (' + i18n.oldValue + ')';
                        let newValue = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, me.getViewModel());
                        newValue.fieldLabel = newValue.fieldLabel + ' (' + i18n.newValue + ')';

                        oldValue.labelWidth = 200;
                        oldValue.disabled = false;
                        oldValue.margin = '10';
                        oldValue.flex = 1;
                        oldValue.bind = {
                            value: '{currentData.' + bindName + '}',
                            readOnly: true,
                        };


                        newValue.labelWidth = 200;
                        newValue.disabled = false;
                        newValue.margin = '10';
                        newValue.flex = 1;
                        newValue.bind = {
                            value: '{changedData.' + bindName.replace('fina_fiRegistry', 'fina_fiOrganisationalFormAndNameChange') + '}',
                            readOnly: true,
                        };

                        let hboxLayout = Ext.create(
                            {
                                'xtype': 'container',
                                flex: 1,
                                'layout': {
                                    type: 'hbox',
                                    align: 'stretch'
                                }
                            });
                        hboxLayout.add(oldValue);
                        hboxLayout.add(newValue);
                        vbox.add(hboxLayout);

                    }
                });
                me.getView().add(fieldSet);

                Ext.resumeLayouts(true);
            }
        });
    },

    loadFiPreviousVersion: function () {
        let me = this,
            theFi = this.getViewModel().get('fiRegistry'),
            fiRegistryId = theFi['id'],
            lastActionId = theFi['fina_fiRegistryLastActionId'],
            currentActionId = me.getViewModel().get('selectedActionGridItem').get('id'),
            registryStatus = theFi['fina_fiRegistryStatus'];

        var currentData = {};

        if (registryStatus === 'IN_PROGRESS' && currentActionId === lastActionId) {
            for (var propertyName in theFi) {
                currentData[propertyName] = theFi[propertyName];
            }
            me.getViewModel().set('currentData', currentData);
        } else {

            Ext.Ajax.request({
                    url: first.config.Config.remoteRestUrl + 'ecm/version/' + fiRegistryId,
                    method: 'GET',
                    callback: function (options, success, response) {
                        let metaDada = JSON.parse(response.responseText);
                        let fltered = metaDada.list.filter(registry => registry.properties['fina:fiRegistryLastActionId'] === currentActionId);
                        let beforeChangeItemInCurrProcess=fltered[fltered.length - 1];
                        if (beforeChangeItemInCurrProcess.properties['fina:fiRegistryLastActionId'] === currentActionId) {
                            for (var propertyName in beforeChangeItemInCurrProcess.properties) {
                                let bindPropname = propertyName.replace(':', '_');
                                currentData[bindPropname] = beforeChangeItemInCurrProcess.properties[propertyName];
                            }
                        }
                        me.getViewModel().set('currentData', currentData);
                    }
                }
            );
        }

    }

});