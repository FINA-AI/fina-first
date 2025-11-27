Ext.define('first.view.registration.FiProfileController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiProfileEcm',

    requires: [
        'Ext.util.History',
        'first.config.Config',
        'first.util.ErrorHandlerUtil',
        'first.util.WorkflowHelper'
    ],

    listen: {
        controller: {
            '*': {
                validateFiRegistryCall: 'validateFiRegistry',
                validateSanctionedPeopleChecklistModifiedStatusCall: 'validateSanctionedPeopleChecklistModifiedStatus',
                refreshProfileView: 'onRefreshProfileEvent',
                onActionTaskStepChange: 'actionTaskStepChangeEvent',
                getSanctionedPeopleChecklistCall: 'getSanctionedPeopleChecklistCall',
                exportReport: 'exportReport'
            },
            'fiProfileDescriptionEcm': {
                getFiCall: 'getFiCall',
            },
            'fiProfileTaskEcm': {
                getFiCall: 'getFiCall',
            }
        }
    },

    init: function () {
        let itemId = this.getViewModel().get('itemId') ? this.getViewModel().get('itemId') : first.config.Config.historyTokenItemId(),
            tabReference = Ext.History.getToken().split('/')[2],
            me = this;
        if (me.initializing) {
            return
        }
        me.initializing = true;
        me.getViewModel().set('itemId', itemId);
        me.getViewModel().set('tabReference', tabReference);
        me.getViewModel().set('tabRecordId', Ext.History.getToken().split('/')[3]);

        me.getFiCall(itemId, function (obj) {
            let status = obj['fina_fiRegistryStatus'];
            me.getViewModel().set('theFi', obj);
            me.getViewModel().set('theFiStatus', i18n[status]);
            me.getViewModel().set('theFiActionType', i18n[obj['fina_fiActionType']]);
            me.getViewModel().set('theFiLegalFormType', i18n[obj['fina_fiRegistryLegalFormType']]);

            let lastProcessId = obj['fina_fiRegistryLastProcessId'];
            me.setWorkflowVariables(lastProcessId);

            me.getFiCall(obj['fina_fiRegistryLastActionId'], function (actionObj) {
                me.getViewModel().set('fiAction', actionObj);

                if (actionObj["fina_fiRegistryActionRedactingStatus"] === 'WITHDRAWAL') {
                    if (me.getViewModel().get('theFi')["fina_fiRegistryStatus"] === 'DECLINED') {
                        me.getViewModel().set('theFiStatus', me.getViewModel().get('theFiStatus') + ' ' + i18n.documentWithdrawalStatus)
                    } else {
                        me.getViewModel().set('theFiStatus', me.getViewModel().get('theFiStatus') + ' ' + i18n.withdrawalProcessText)
                    }
                }
                me.getFiTypeAndCall(itemId, function (data) {
                    me.getViewModel().set('fiType', data);
                    me.initData(itemId, status);
                    me.changeStyles();
                });
            });

            me.initChangeButton();
        });
        if (!this.wsocket) {
            me.initWebSocket();
        }
    },

    initChangeButton: function () {
        let changeButton = this.lookupReference('changeButtonRef');
        let fi = this.getViewModel().get('theFi');

        if (changeButton.menu.items.items.length !== 2) {
            return
        }

        this.getFiTypeAndCall(fi.id, function (data) {
            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/workflow/process/definition/' + data.changeWorkflowKey,
                method: 'GET',
                success: function (response) {
                    let resultData = JSON.parse(response.responseText);
                    let item = resultData.form.find(d => /_fiChange[a-zA-Z]{0,4}FormType/.test(d.name));

                    if (item) {
                        Ext.each(item.allowedValues, function (formItem) {
                            changeButton.menu.add({
                                iconCls: 'x-fa fa-building',
                                text: i18n[formItem],
                                changePropertyVal: formItem,
                                changePropertyName: item.name,
                                handler: 'onChangeClick',
                            });
                        })
                    }
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            });
        });
    },

    setWorkflowVariables: function (processId) {
        let me = this;
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/workflow/variables/' + processId,
            success: function (response) {
                let resultData = JSON.parse(response.responseText);
                me.getViewModel().set('workflowVariables', resultData);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    actionTaskStepChangeEvent: function (registryId) {
        if (this.getViewModel().get('theFi')['id'] === registryId) {
            this.fireEvent('reloadFiActionsGaps', registryId);
            this.wsocket.send(registryId)
        }
    },

    initWebSocket: function () {
        let me = this;
        let url = first.config.Config.remoteUrl;

        url = (url.startsWith('https')) ? url.replace(/https/, 'wss') : url.replace(/http/, 'ws');

        this.wsocket = new WebSocket(url + 'first/actionTaskStepChange');
        this.wsocket.onmessage = function (msg) {
            me.onRefreshProfileEvent(msg.data);
        };
    },

    initData: function (itemId, registryStatus) {
        this.getViewModel().set('fiRegistryStatus', registryStatus);
        this.initTabs(itemId);
    },

    onRefreshProfileEvent: function (registryId) {
        if (this.getViewModel().get('theFi')['id'] === registryId) {
            this.onRefreshClick();
        }
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().mask(i18n.pleaseWait);
        let tabs = this.lookupReference('fiTabs');
        tabs.setVisible(false);
        tabs.removeAll();
        this.init();
    },

    initTabs: function (itemId) {
        let me = this,
            tabs = this.lookupReference('fiTabs'),
            fiRegistryStatus = this.getViewModel().get('fiRegistryStatus');

        let allItemsCls = 'firstFiProfileSidebarCommonTab';
        let taskSubItemsCls = allItemsCls;
        let taskCls = 'firstFiProfileSidebarCommonTab firstFiProfileSidebarTaskTab';
        if (me.getViewModel().get('theFi')['fina_fiRegistryStatus'] === "IN_PROGRESS" || fiRegistryStatus === 'GAP') {
            taskSubItemsCls += " firstFiProfileSidebarTab"
        }

        me.getView().mask(i18n.pleaseWait);

        if (fiRegistryStatus === 'IN_PROGRESS' || fiRegistryStatus === 'GAP') {
            let fiAction = me.getViewModel().get('fiAction'),
                fi = me.getViewModel().get('theFi'),
                currentUser = first.config.Config.conf.properties.currentUser.id,
                activeItem = fiAction['fina_fiRegistryActionStep'],
                currentStepController = fiAction['fina_fiRegistryActionStepController'],
                controllerStatus = fiAction['fina_fiRegistryActionControlStatus'],
                controller = fi['fina_fiRegistryLastInspectorId'],
                assignee = fiAction['fina_fiRegistryActionAuthor'];

            if (currentUser === controller && controllerStatus === 'REVIEW') {
                activeItem = currentStepController;
            }

            me.addTab(tabs, {
                id: 'fiProfileTaskEcm',
                name: 'tasks'
            }, 'fiProfileTaskEcm', 'Tasks', 'x-fa fa-spinner', activeItem, null, taskCls);
        }

        me.addTab(tabs, {
            id: 'fiProfileDescriptionEcm',
            name: 'general'
        }, 'fiProfileDescriptionEcm', 'General Information', 'x-fa fa-info', null, null, taskSubItemsCls);

        if (fiRegistryStatus === 'IN_PROGRESS' || fiRegistryStatus === 'GAP') {
            me.addTab(tabs, {
                id: 'fiProfileQuestionnaireEcm',
                name: 'questionnaire'
            }, 'fiProfileQuestionnaireEcm', 'Questionnaire', 'x-fa fa-check', null, null, taskSubItemsCls);
        }

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/fi/' + itemId + '/details',
            method: 'GET',
            callback: function (options, success, response) {
                let fiDetails = JSON.parse(response.responseText);

                let details = fiDetails.list;

                Ext.each(details, function (detail) {

                    if (detail.properties["fina:folderConfigChildType"] === "fina:fiDocument") {
                        // add Documentation Tab
                        me.addTab(tabs, detail, null, null, "x-fa", null, null, 'firstFiProfileSidebarTaskTabBorderTop');
                        me.addTab(tabs, {
                                id: 'fiProfileDocumentationEcm',
                                rootNodeId: detail.id,
                                name: 'documents',
                                url: first.config.Config.remoteRestUrl + 'ecm/fi/documents/' + detail.id + '?fiRegistryId=' + me.getViewModel().get('theFi').id,
                            }, 'fiProfileDocumentationEcm', 'Documents', 'x-fa fa-file', null, null, allItemsCls
                        );
                    } else if (detail.properties["fina:folderConfigChildType"] === "fina:sms") {
                        me.addTab(tabs, detail, 'fiProfileCorrespondenceEcm', detail.name, 'x-fa fa-envelope', null, null, allItemsCls);
                    } else if (detail.name === "Authorized Persons") {
                        me.addTab(tabs, detail, 'fiProfileDetailsEcm', detail.name, 'x-fa fa-users', null, null, taskSubItemsCls);
                    } else if (detail.name === "Branches") {
                        me.addTab(tabs, detail, 'fiProfileDetailsEcm', detail.name, 'x-fa fa-map-marker', null, null, taskSubItemsCls);
                    } else if (detail.name === "Gaps") {
                        me.addTab(tabs, detail, 'fiActionsGap', i18n.fiProfileArchivedGapColumnTitle, 'x-fa fa-exclamation', null, null, allItemsCls);
                    } else if (detail.name === "Complex Structures") {
                        me.addTab(tabs, detail, 'complexStructureView', detail.name, 'x-fa fa-sitemap', null, me.getViewModel().get('isIndividualEntrepreneur'), taskSubItemsCls);
                    } else {
                        me.addTab(tabs, detail, 'fiProfileDetailsEcm', detail.name, null, null, null, allItemsCls);
                    }
                });

                //add Linked Information Tab
                me.addTab(tabs, {
                    id: 'fiLinkedInfo',
                    name: 'linkedInfo',
                }, 'linkedInfo', i18n.linkedInformationTitle, 'x-fa fa-link', null, null, allItemsCls);

                me.addTab(tabs, {
                    id: 'fiActionsEcm',
                    name: 'actions'
                }, 'fiActionsEcm', 'Actions', 'x-fa fa-history', null, null, allItemsCls);

                me.setActiveTab(tabs, me.getViewModel().get('tabReference'));
                me.getView().unmask();
                me.initializing = false;

                tabs.setVisible(true);
                me.validateFiRegistryOnVisit();
            }
        });
    },

    addTab: function (tabs, detail, xtype, title, iconCls, activeItem, disabled, cls) {
        let itemId = this.getViewModel().get('itemId'),
            me = this,
            fiRegistryStatus = me.getViewModel().get('fiRegistryStatus');

        let originalTitle = title;

        if (detail.name === "Gaps") {
            let fiRegistryArchivedGapTaskCount = me.getViewModel().get('theFi.fina_fiRegistryArchivedGapTaskCount') ? me.getViewModel().get('theFi.fina_fiRegistryArchivedGapTaskCount') : 0,
                fiRegistryArchivedGapTaskNotificationBackgroundColor = (fiRegistryArchivedGapTaskCount !== 0 ? 'red' : '#2B7FCB');
            title = Ext.String.format('{0}<span style="float:right; height: 20px; background-color: {1}" class="notification-icon">{2}</span>', title, fiRegistryArchivedGapTaskNotificationBackgroundColor, fiRegistryArchivedGapTaskCount);
            originalTitle = detail.name;
        } else if (i18n[title]) {
            title = i18n[title];
        }

        if (!iconCls) {
            iconCls = 'x-fa fa-building';
        }

        let cfg = {
            itemId: 'detail-' + detail.id,
            xtype: xtype,
            originalTitle: originalTitle,
            title: title,
            tabConfig: {
                cls: cls,
            },
            closable: false,
            iconCls: iconCls,
            disabled: disabled,
            viewModel: {
                formulas: {
                    disableSendToControllerButton: function (get) {
                        return !get('existingReportCard')['id'] || (get('fiAction')['fina_fiRegistryActionControlStatus'] === 'REVIEW') || get('reportCardNeedsRegeneration');
                    },
                    isReportDocumentGenerated: function (get) {
                        let reportDocument = get('reportDocument'),
                            isRefusalSelected = get('isRefusalSelected');

                        if (reportDocument) {
                            let reportDocumentType = reportDocument.properties['fina:fiDocumentType'];
                            return (isRefusalSelected && reportDocumentType === 'REPORT_CARD_REFUSAL') || (!isRefusalSelected && reportDocumentType === 'GAP_LETTER');
                        }
                        return false;
                    },
                    isChangeGapLetterGenerated: function (get) {
                        let letter = get('gapLetter'),
                            isRefusalSelected = get('isRefusalSelected');

                        if (letter) {
                            let letterType = letter.properties['fina:fiDocumentType'];
                            return (isRefusalSelected && letterType === 'REFUSAL_LETTER') || (!isRefusalSelected && letterType === 'GAP_LETTER') || (isRefusalSelected && letterType === 'DECREE_CARD_REFUSAL');
                        }
                    },
                    liquidatorReadOnlyFields: function (get) {
                        let fiAction = get('fiAction'),
                            theFi = get('theFi'),
                            currentUser = first.config.Config.conf.properties.currentUser.id,
                            controllerStatus = fiAction['fina_fiRegistryActionControlStatus'],
                            editor = theFi['fina_fiRegistryLastEditorId'],
                            actionStep = get('fiAction').fina_fiRegistryActionStep,
                            inReview = controllerStatus === 'REVIEW',
                            taskRedactor = currentUser === editor;

                        if (actionStep == 1) {
                            if (inReview) {
                                return true;
                            } else {
                                return !taskRedactor;
                            }
                        } else {
                            if (inReview) {
                                return false;
                            } else {
                                return !taskRedactor;
                            }
                        }
                    }
                },
                data: {
                    itemId: itemId,
                    tabId: detail.id,
                    detail: detail,
                    fiRegistryStatus: fiRegistryStatus,
                    theFi: me.getViewModel().get('theFi'),
                    fiType: me.getViewModel().get('fiType'),
                    fiProfileController: me
                }
            }
        };

        if (detail.name) {
            cfg.reference = detail.name.replace(/ /g, '_');
        }

        if (activeItem) {
            cfg.activeItem = activeItem;
        }

        tabs.add(cfg);
    },

    refreshTimeline: function () {
        this.fireEvent('refreshTimeline');
    },

    onChangeClick: function (obj) {
        let me = this, fi = this.getViewModel().get('theFi');
        let wfChangeType = obj.changePropertyVal ? ',' + obj.changePropertyName + '__' + obj.changePropertyVal : '';
        me.getFiTypeAndCall(fi.id, function (data) {
            first.util.WorkflowHelper.createWorkflowViewAsWindow(
                data.changeWorkflowKey,
                'fwf_fiStartTaskBaseFiCode__' + fi.fina_fiRegistryCode + ',fwf_fiStartTaskBaseFiIdentity__' + fi['fina_fiRegistryIdentity'] + wfChangeType,
                true);
        });
    },

    onDisableClick: function () {
        let me = this, fi = this.getViewModel().get('theFi');
        me.checkFiHasFines(fi.id, function (hasFines) {
            if (hasFines) {
                Ext.MessageBox.confirm(i18n.warning, i18n.fiFineWarning, function (btn, text) {
                    if (btn === 'yes') {
                        me.startDisableProcess(me, fi);
                    }
                }, this);
            } else {
                me.startDisableProcess(me, fi);
            }
        })
    },

    startDisableProcess: function (me, fi) {
        me.getFiTypeAndCall(fi.id, function (data) {
            first.util.WorkflowHelper.createWorkflowViewAsWindow(
                data.disableWorkflowKey,
                'fwf_fiStartTaskBaseFiCode__' + fi.fina_fiRegistryCode + ',fwf_fiStartTaskBaseFiIdentity__' + fi['fina_fiRegistryIdentity'],
                true);
        });
    },

    startBranchDisableProcess: function (me, fi) {
        me.getFiTypeAndCall(fi.id, function (data) {
            first.util.WorkflowHelper.createWorkflowViewAsWindow(
                data.branchChangeWorkflowKey,
                'fwf_fiStartTaskBaseFiCode__' + fi.fina_fiRegistryCode + ',fwf_fiStartTaskBaseFiIdentity__' + fi['fina_fiRegistryIdentity'],
                true);
        });
    },


    checkFiHasFines: function (fiRegistryId, callback) {
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/fi/fines/check/' + fiRegistryId,
            method: 'GET',
            callback: function (options, success, response) {
                let hasFines = response.responseText;
                callback(hasFines==='true');
            }
        });
    },

    onDisableBranchesClick:function (){
        let me = this, fi = this.getViewModel().get('theFi');
        me.checkFiHasFines(fi.id, function (hasFines) {
            if (hasFines) {
                Ext.MessageBox.confirm(i18n.warning, i18n.fiFineWarning, function (btn, text) {
                    if (btn === 'yes') {
                        me.startBranchDisableProcess(me, fi);
                    }
                }, this);
            } else {
                me.startBranchDisableProcess(me, fi);
            }
        })
    },

    onChangeBranchesClick: function () {
        let me = this,
            fi = this.getViewModel().get('theFi');
        me.getFiTypeAndCall(fi.id, function (data) {
            first.util.WorkflowHelper.createWorkflowViewAsWindow(
                data.branchChangeWorkflowKey,
                'fwf_fiStartTaskBaseFiCode__' + fi.fina_fiRegistryCode + ',fwf_fiStartTaskBaseFiIdentity__' + fi['fina_fiRegistryIdentity'],
                true);
        });
    },

    onEditBranchesClick: function () {
        let me = this,
            fi = this.getViewModel().get('theFi');
        me.getFiTypeAndCall(fi.id, function (data) {
            first.util.WorkflowHelper.createWorkflowViewAsWindow(
                data.branchEditWorkflowKey,
                'fwf_fiStartTaskBaseFiCode__' + fi.fina_fiRegistryCode + ',fwf_fiStartTaskBaseFiIdentity__' + fi['fina_fiRegistryIdentity'],
                true,
                undefined,
                'BRANCHES_EDIT');
        });
    },

    getFiTypeAndCall: function (registryId, navigationCall) {
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/fi/types/' + registryId,
            method: 'GET',
            callback: function (options, success, response) {
                let data = JSON.parse(response.responseText);
                navigationCall(data);
            }
        });
    },

    onLastProcessViewClick: function () {
        let lastProcessId = this.getViewModel().get('theFi')['fina_fiRegistryLastProcessId'];
        if (lastProcessId) {
            this.fireEvent('navChange', 'wfDetails/' + lastProcessId);
        }
    },

    setActiveTab: function (tabPanel, tabName) {
        let me = this;
        if (tabName) {
            let tab = this.lookupReference(tabName);
            tabPanel.setActiveTab(tab);
            me.selectActiveRecordInGrid(tab);
        } else {
            tabPanel.setActiveTab(0);
            this.redirectTo(Ext.History.getToken() + '/' + tabPanel.getActiveTab().reference);
        }
    },

    setActiveTabAndSelectRecord: function (tabName, recordId, recordEditFunctionName) {
        let me = this,
            tabPanel = this.lookupReference('fiTabs');
        this.getViewModel().set('tabRecordId', recordId);
        if (tabName) {
            let tab = this.lookupReference(tabName);
            tabPanel.setActiveTab(tab);
            me.selectActiveRecordInGrid(tab, recordEditFunctionName);
        } else {
            tabPanel.setActiveTab(0);
            this.redirectTo(Ext.History.getToken() + '/' + tabPanel.getActiveTab().reference);
        }
    },

    selectActiveRecordInGrid: function (tab, recordEditFunctionName) {
        let me = this,
            id = me.getViewModel().get('tabRecordId');

        if (id) {
            let grid = tab.down('grid'),
                store = grid ? grid.getStore() : null,
                tree = tab.lookupReference('complexStructureTreeView');

            if (store) {
                store.load({
                    callback: function () {
                        let record = store.findRecord('id', id);

                        if (tree) {
                            me.selectElementInTree(tree, id);
                        } else if (record) {
                            grid.getSelectionModel().select(record, false);

                            if (recordEditFunctionName) {
                                let rowIndex = store.indexOf(record);
                                grid.getController()[recordEditFunctionName]({
                                    grid: grid
                                }, rowIndex, 1, null, null, record);
                            }
                        }
                    }
                });
            }
        }
    },

    selectElementInTree: function (tree, id) {
        let me = this;
        if (!me.expandIfNodePresent(tree, id)) {
            tree.expandAll(function () {
                tree.getStore().on({
                    load: function () {
                        me.expandIfNodePresent(tree, id)
                    }
                });
            })
        }
    },

    expandIfNodePresent: function (tree, id) {
        let node = tree.getStore().findNode('id', id);
        if (node) {
            tree.collapseAll(function () {
                tree.getSelectionModel().select(node);
                tree.selectPath(node.getPath());
            })
        } else {
            return false;
        }
        return true;
    },

    getTabItemStore: function (tabName) {
        if (tabName) {
            let tab = this.lookupReference(tabName);
            let grid = tab.down('grid');
            return grid.getStore();
        }
        return null;
    },

    refreshTabItemGrid: function (tabReference) {
        let store = this.getTabItemStore(tabReference);
        if (store) {
            store.load();
        }
    },

    beforetabChange: function (tabpanel, newTab, oldTab) {
        if (oldTab) {
            this.redirectTo(Ext.History.getToken().replace(oldTab.reference, newTab.reference));
        }
    },

    tabChange: function (tabPanel, newTab, oldTab, eOpts) {
        let generalViewName = 'general',
            me = this,
            generalVM = this.getView().lookupReference(generalViewName).getViewModel();
        if (newTab.reference === generalViewName) {
            generalVM.set('generalTabIsSelected', true);
        } else {
            if (generalVM.get('generalTabIsSelected')) {
                tabPanel.setActiveTab(oldTab);
                generalVM.set('generalTabIsSelected', false);

                let model = generalVM.get('theFi');

                me.getFiCall(model.id, function (obj) {
                    for (let key in model) {
                        if (key !== "fina_fiRegistryLegalActNumber" && key !== "nbg_fiRegistryNumberOfOrder" && key !== "fina_fiRegistryStatus" && key !== "fina_fiRegistryLastActionId" && key !== "fina_fiActionType" && key !== "cm_versionLabel" && key !== "nodeType" && key !== "id" && model[key] !== "") {
                            let flag;
                            //Check inequality
                            if (model[key] instanceof Date) {
                                flag = obj[key] !== Ext.Date.format(model[key], 'Y-m-d');
                            } else if (key.split("_")[1] === "fiRegistryActivity") {
                                if (obj[key].length !== model[key].length) {
                                    flag = true;
                                } else {
                                    flag = !obj[key].every(elem => model[key].indexOf(elem) > -1);
                                }
                            } else {
                                flag = obj[key] !== model[key]
                            }

                            if (flag) {
                                let window = Ext.create("Ext.window.Window", {
                                    style: "text-align: center;",
                                    height: 150,
                                    width: 400,
                                    modal: true,
                                    title: i18n.warning,
                                    html: i18n.fiInfoDataSaveWarning,
                                    buttons: [
                                        {
                                            xtype: 'button',
                                            text: i18n.yes,
                                            cls: 'finaPrimaryBtn',
                                            handler: function () {
                                                me.fireEvent('saveFiDetail');
                                                window.destroy();
                                                tabPanel.setActiveTab(newTab);
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: i18n.no,
                                            cls: 'finaSecondaryBtn',
                                            handler: function () {
                                                window.destroy();
                                                tabPanel.setActiveTab(newTab);
                                            }
                                        }
                                    ],
                                    listeners: {
                                        'close': function () {
                                            window.destroy();
                                            tabPanel.setActiveTab(newTab);
                                        }
                                    }
                                });
                                window.show();
                                return;
                            }
                        }
                    }
                    tabPanel.setActiveTab(newTab);
                });
            }
        }
    },

    getFiCall: function (itemId, callback) {
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/fi/' + itemId,
            method: 'GET',
            callback: function (options, success, response) {
                let data = JSON.parse(response.responseText),
                    props = data.properties,
                    obj = {
                        id: data.id,
                        nodeType: data.nodeType
                    };

                Ext.Object.each(props, function (key, val) {
                    if (key.endsWith("Date")) {
                        // 2019-08-05T06:51:07.217+0000
                        let d = Ext.Date.parse(val, 'c');
                        val = Ext.Date.format(d, 'Y-m-d');
                    }
                    obj[key.replace(':', '_')] = val;
                });

                callback(obj);
            }
        });
    },

    validateFiRegistryQuestionnaires: function () {
        this.validateFiRegistry(this.getViewModel().get('theFi').id, null, null, null)
    },

    validateFiRegistry: function (fiRegistryId, fnCallIfValid, fnCallIfNotValid, fnFailure) {
        let me = this;
        let fi = this.getViewModel().get('theFi');
        if (fi && (fi.fina_fiActionType === "REGISTRATION" || fi.fina_fiActionType === "CHANGE" || fi.fina_fiActionType === "BRANCHES_CHANGE" || fi.fina_fiActionType === "BRANCHES_EDIT"
            || fi.fina_fiActionType === 'CANCELLATION')
            && fi.fina_fiRegistryStatus === "IN_PROGRESS" && fiRegistryId === fi.id) {
            let fiRegistryActionId = this.getViewModel().get('theFi').fina_fiRegistryLastActionId;
            let tabs = this.lookupReference('fiTabs');
            let invalidMark = '&nbsp;<b class="fa fa-circle x-fa" style="float: right; color: red">&nbsp;</b>';
            Ext.Ajax.request({
                method: 'GET',
                url: first.config.Config.remoteRestUrl + 'ecm/node/' + fiRegistryActionId + '?relativePath=VALIDATION_RESULT',
                success: function (response) {
                    let result = JSON.parse(response.responseText);
                    let tabItems = tabs.items.items;
                    let isRegistryDataValid = true;

                    let validateTabs = ["General Information", "Questionnaire", "Branches", "Authorized Persons", "Complex Structures"];
                    if (fi.fina_fiActionType === 'CANCELLATION') {
                        validateTabs = ['Questionnaire'];
                    }

                    tabItems.forEach(function (tabItem) {
                        if (validateTabs.includes(tabItem.originalTitle)) {
                            tabItem.setTitle(i18n[tabItem.originalTitle]);
                            tabItem.tab.setTooltip(null);
                            tabItem.tab.tooltips = [];
                        }
                    });

                    let tabTooltips = {};

                    Ext.Object.each(result.properties, function (key, value) {
                        let tooltip = i18n.checkInformationValidity;
                        let tabItemReference = null;
                        switch (key) {
                            case 'fina:fiRegistryValidationResultRegistry':
                                tabItemReference = "General Information";
                                break;
                            case 'fina:fiRegistryValidationResultBeneficiaries':
                                break;
                            case 'fina:fiRegistryValidationResultQuestionnaire':
                                tabItemReference = "Questionnaire";
                                break;
                            case 'fina:fiRegistryValidationResultBranchesHeadOfficeExists':
                                tabItemReference = "Branches";
                                if (!result.properties['fina:fiRegistryValidationResultBranchesHeadOfficeExists']) {
                                    tooltip = i18n.noHeadOfficesSpecifiedWarning;
                                }
                                break;
                            case 'fina:fiRegistryValidationResultBranchesHasSingleHeadOffice':
                                tabItemReference = "Branches";
                                if (result.properties['fina:fiRegistryValidationResultBranchesHeadOfficeExists']) {
                                    if (!result.properties['fina:fiRegistryValidationResultBranchesHasSingleHeadOffice']) {
                                        tooltip = i18n.moreThanOneHeadOfficeWarning;
                                    }
                                } else {
                                    tooltip = i18n.noHeadOfficesSpecifiedWarning;
                                }

                                break;
                            case 'fina:fiRegistryHeadOfficeAddressValid':
                                tabItemReference = "Branches";
                                let headOfficeAddressValid = result.properties['fina:fiRegistryHeadOfficeAddressValid'];
                                if (headOfficeAddressValid === false) {
                                    tooltip = i18n.branchAddressIsInvalidMessage;
                                } else {
                                    headOfficeAddressValid = true;
                                }
                                break;
                            case 'fina:fiRegistryValidationResultAuthorizedPersons':
                                tabItemReference = "Authorized Persons";
                                let isValid = result.properties['fina:isAdministratorMandatoryPropertiesSet'];
                                if (isValid === false) {
                                    tooltip = i18n.checkInformationValidity;
                                } else {
                                    if (result.properties['fina:fiRegistryValidationResultSupervisoryBoardMemberValid'] === false) {
                                        tooltip = i18n.directorAndSupervisoryBoardMemberRequired;
                                    } else {
                                        tooltip = i18n.administratorsInvalidTooltipMessage;
                                    }
                                }
                                break;
                            case'fina:fiRegistryValidationResultComplexStructureShare':
                            case 'fina:fiRegistryValidationResultComplexStructure':
                                tabItemReference = "Complex Structures";

                                let isShareValid = result.properties['fina:fiRegistryValidationResultComplexStructureShare'];

                                tooltip =
                                    result.properties['fina:fiRegistryValidationResultComplexStructure']
                                    && isShareValid !== null && isShareValid !== undefined && !isShareValid
                                        ? i18n.complexStructureShareInvalidTooltipMessage : i18n.complexStructureInvalidTooltipMessage;

                                break;
                            default:
                                break;
                        }
                        tooltip = "<span style='font-size: 15px'>" + tooltip + "</span>";

                        if (tabItemReference !== null && tabItemReference !== 'Beneficiaries' && validateTabs.indexOf(tabItemReference) >= 0) {
                            let tabItem = tabItems.find(function (item) {
                                return item.originalTitle === tabItemReference;
                            });

                            if (!value) {
                                isRegistryDataValid = false;
                                tabItem.setTitle(i18n[tabItemReference] + invalidMark);
                                if (tabItemReference !== 'Questionnaire') {
                                    if (tabTooltips[tabItem.originalTitle]) {
                                        tabTooltips[tabItem.originalTitle].concat(tooltip);
                                    } else {
                                        tabTooltips[tabItem.originalTitle] = tooltip;
                                    }
                                }
                            }
                        }
                    });

                    if (result.properties && result.properties["fina:fiRegistryValidationResultQuestionnaireInvalidFolders"]) {
                        let invalidFolders = result.properties["fina:fiRegistryValidationResultQuestionnaireInvalidFolders"];

                        Ext.Object.each(invalidFolders, function (key, value) {
                            let tabItem = tabItems.find(function (item) {
                                return item.originalTitle === key && validateTabs.indexOf(key) >= 0;
                            });

                            if (tabItem) {
                                if (!tabItem.getTitle().includes(invalidMark)) {
                                    tabItem.setTitle(i18n[key] + invalidMark);
                                }
                                let questionnairesTooltipInfo = me.getInvalidQuestionnairesTooltip(value, tabItem.originalTitle);
                                let existingTooltip = tabTooltips[tabItem.originalTitle];
                                if (existingTooltip) {
                                    tabTooltips[tabItem.originalTitle] = existingTooltip + '<br><br>&raquo; ' + questionnairesTooltipInfo;
                                } else {
                                    tabTooltips[tabItem.originalTitle] = questionnairesTooltipInfo;
                                }
                            }
                        });
                    }

                    tabItems.forEach(function (tabItem) {
                        let tabTitle = tabItem.originalTitle;
                        if (tabTooltips[tabTitle]) {
                            me.addTooltipToTab(tabItem, tabTooltips[tabTitle])
                        } else {
                            me.removeTabTooltip(tabItem);
                        }
                    });

                    if (isRegistryDataValid) {
                        if (fnCallIfValid) {
                            fnCallIfValid(result.properties);
                        }
                    } else {
                        if (fnCallIfNotValid) {
                            fnCallIfNotValid(result.properties);
                        }
                    }
                },
                failure: fnFailure
            });
        }
    },

    isEmpty: function (obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },

    getInvalidQuestionnairesTooltip: function (invalidNodes) {
        if (this.isEmpty(invalidNodes)) {
            return;
        }
        let questionnaireTooltips = '';
        questionnaireTooltips += "<span style='font-size:15px'>" + i18n.unmarkedQuestionnaires + '</span>';

        for (let nodeId in invalidNodes) {
            if (invalidNodes.hasOwnProperty(nodeId)) {
                let invalidNode = invalidNodes[nodeId],
                    nodeDescription = invalidNode['description'],
                    questionnaires = invalidNode['invalidQuestionnaires'],
                    nodeTypeDescription = nodeDescription ? nodeDescription['type'] : '',
                    nodeDescriptionText = nodeDescription ? nodeDescription['text'] : '';

                questionnaireTooltips += "<div style='margin-left: 10px'>" + (nodeTypeDescription ? i18n[nodeTypeDescription] : '') + ' ' + nodeDescriptionText + "</div>";

                for (let i = 0; i < questionnaires.length; i++) {

                    const questionnaireTitle = this.getQuestionnaireLocalTitle(questionnaires[i]);

                    questionnaireTooltips +=
                        "<div style='font-size: 13px; margin-left: 20px'>" + "&ring;" +
                        "<a href='#' id='invalidQuestionnaire_" + nodeId + "'> " + questionnaireTitle + "</a>" +
                        "</div>";
                }
            }

            questionnaireTooltips += '<br>';
        }

        return questionnaireTooltips;
    },

    getQuestionnaireLocalTitle: function (questionnaireTitles) {
        const locale = first.config.Config.getLanguageCode();

        let questionnaireTitle = "";

        if (typeof questionnaireTitles === "string") { // For old validations (to avoid tooltip lists with empty items)
            return questionnaireTitles;
        }

        if (questionnaireTitles.hasOwnProperty(locale)) {
            questionnaireTitle = questionnaireTitles[locale];
        } else if (questionnaireTitles.hasOwnProperty("default")) {
            questionnaireTitle = questionnaireTitles["default"];
        }

        return questionnaireTitle;
    },

    removeTabTooltip: function (tabItem) {
        let toolTipReference = tabItem.tab.id.replace("-", "_") + "_tooltip";
        let existingToolTip = this.getView().up().up().lookupReference(toolTipReference);
        if (existingToolTip) {
            existingToolTip.destroy();
        }
    },

    addTooltipToTab: function (tabItem, tooltip) {
        tabItem.tab.tooltips.push(tooltip);
        let existingTips = tabItem.tab.tooltips,
            newTip = "";
        for (let tip of existingTips) {
            newTip += (newTip.length === 0 ? "" : "<br><br>") + "&raquo; " + tip;
        }

        this.removeTabTooltip(tabItem);
        let toolTipReference = tabItem.tab.id.replace("-", "_") + "_tooltip";

        let me = this;
        Ext.create('Ext.tip.ToolTip', {
            target: tabItem.tab.id,
            showDelay: 50,
            reference: toolTipReference,
            closable: true,
            width: '480px',
            maxHeight: '250px',
            items: [{
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                width: '100%',
                scrollable: true,
                bodyStyle: 'background:transparent;',
                padding: '0 10 10 8',

                items: [
                    {
                        html: newTip,
                        bodyStyle: 'background:transparent;',
                        listeners: {
                            element: 'el',
                            click: function (event, element, c) {
                                let elementId = element.id;
                                if (elementId.indexOf('_') >= 0) {
                                    let idPrefix = elementId.split('_')[0],
                                        id = elementId.split('_')[1];
                                    if (idPrefix === 'invalidQuestionnaire') {
                                        me.setActiveTabAndSelectRecord(tabItem.reference, id, null);
                                    }
                                }
                            }
                        }
                    }
                ]
            }],
            listeners: {
                afterrender: function () {
                    this.el.on('mouseover', function () {
                        this.clearTimer('hide');
                        this.clearTimer('dismiss');
                    }, this);

                    this.el.on('mouseout', function () {
                        this.clearTimer('show');
                        if (this.autoHide !== false) {
                            this.delayHide();
                        }
                    }, this);
                }
            }
        });
    },

    validateSanctionedPeopleChecklistModifiedStatus: function (srcRegistryId, srcActionId, fnSuccess, fnFailure) {
        this.getSanctionedPeopleChecklistCall(
            srcRegistryId,
            srcActionId,
            function (response) {
                let result = JSON.parse(response.responseText);
                fnSuccess(result.properties["fina:fiRegistryValidationResultSanctionedPeopleChecklistModified"], result.properties["fina:fiRegistryValidationResultSanctionedPeopleChecklistIsFirstEntry"]);
            },
            fnFailure);
    },

    getSanctionedPeopleChecklistCall: function (srcRegistryId, srcActionId, fnSuccess, fnFailure, callback) {
        let fi = this.getViewModel().get('theFi'),
            actionId = fi['fina_fiRegistryLastActionId'];

        if (fi && srcRegistryId === fi.id && actionId === srcActionId) {
            Ext.Ajax.request({
                method: 'GET',
                url: first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '?relativePath=VALIDATION_RESULT',
                success: fnSuccess,
                fnFailure: fnFailure,
                callback: callback
            });
        }
    },

    onCancelCurrentActionClick: function () {
        let me = this,
            fi = this.getViewModel().get('theFi'),
            warningMessage = fi.fina_fiActionType !== 'REGISTRATION' ? i18n.cancelCurrentActionWarning : i18n.cancelCurrentRegistrationWarning,
            isSentToController = this.getViewModel().get('fiAction')['fina_fiRegistryActionIsSentToController'];

        if (isSentToController) {
            Ext.Msg.alert(i18n.operationFailed, i18n.cantCancelSentAction);
            return;
        }

        Ext.MessageBox.confirm(i18n.warning, warningMessage, function (btn, text) {
            if (btn === 'yes') {
                me.getView().mask(i18n.pleaseWait);
                me.cancelCurrentAction(fi);
            }
        }, this);
    },

    cancelCurrentAction: function (fi) {
        let me = this;
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/' + fi.id + '/cancel/action',
            success: function (response) {
                let result = JSON.parse(response.responseText);
                me.fireEvent('reloadFiRegistryStore');

                if (result.actionType === 'REGISTRATION') {
                    me.getView().destroy();
                } else {
                    me.onRefreshClick();
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                if (me.getView()) {
                    me.getView().unmask();
                }
            }
        });
    },

    onDocumentWithdrawal: function () {
        let me = this,
            fi = this.getViewModel().get('theFi'),
            warningMessage = i18n.documentWithdrawalStartWarning;

        Ext.MessageBox.confirm(i18n.warning, warningMessage, function (btn, text) {
            if (btn === 'yes') {
                me.documentWithdrawal(fi);
            }
        }, this);
    },


    documentWithdrawal: function () {
        let me = this,
            fi = this.getViewModel().get('theFi');
        me.getFiTypeAndCall(fi.id, function (data) {
            first.util.WorkflowHelper.createWorkflowViewAsWindow(
                data.documentWithdrawalWorkflowKey,
                'fwf_fiStartTaskBaseFiCode__' + fi.fina_fiRegistryCode + ',fwf_fiStartTaskBaseFiIdentity__' + fi['fina_fiRegistryIdentity'],
                true);
        });
    },


    changeStyles: function () {
        let vm = this.getViewModel();
        let dockedItems = this.getView().getDockedItems();
        for (let i in dockedItems) {
            let tbar = dockedItems[i];
            if (vm.get("isRegistryActionController")) {
                tbar.addCls("first-fiProfile-tbar-controller")
            } else if (vm.get("isRegistryActionEditor")) {
                tbar.addCls("first-fiProfile-tbar-redactor")
            } else {
                tbar.addCls("first-fiProfile-tbar-default")
            }
        }
    },

    onFinishHistoricDataReview: function () {
        let me = this,
            viewModel = this.getViewModel();
        Ext.MessageBox.confirm(i18n.confirm, i18n.finishHistoricDataReviewConfirmationText, function (btn) {
            if (btn === 'yes') {
                let model = viewModel.get('theFi');

                let jsonData = {
                    'fina:fiRegistryIsHistoricData': false
                };
                me.getView().mask(i18n.pleaseWait);
                Ext.Ajax.request({
                    method: 'PUT',
                    url: first.config.Config.remoteRestUrl + 'ecm/fi/' + model.id,
                    jsonData: jsonData,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    success: function (response) {
                        me.fireEvent('reloadFiRegistryStore');
                        me.onRefreshProfileEvent(model.id);
                    },
                    failure: function (response) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                    },
                    callback: function () {
                        if (me.getView()) {
                            me.getView().unmask();
                        }
                    }
                });
            }
        });
    },

    exportReport: function (reportName, registryId) {
        if (this.getViewModel().get('theFi')['id'] === registryId) {
            let me = this;
            Ext.Ajax.request({
                method: 'GET',
                url: first.config.Config.remoteRestUrl + "ecm/fi/report/templates",
                success: function (response) {
                    let data = JSON.parse(response.responseText);
                    let template = data.find(d => d.properties['fina:reportName'] === reportName);

                    if (!template) {
                        first.util.ErrorHandlerUtil.showReportError(reportName);
                    } else {
                        let fileName = template['name'];
                        let nodeId = template['id'];
                        let fiCode = me.getViewModel().get('theFi')['fina_fiRegistryCode'];
                        let locale = first.config.Config.getLanguageCode();

                        let url = first.config.Config.remoteRestUrl + `ecm/fi/export/${locale}?templateId=${nodeId}&fileName=${fileName}&fiCode=${fiCode}`;
                        window.open(url, '_blank');
                    }
                }
            });
        }

    },

    validateFiRegistryOnVisit: function () {
        if (!this.getViewModel().get('isRegistryActionEditor')) {
            return;
        }

        let action = this.getViewModel().get('fiAction');

        if (action['fina_fiRegistryActionIsFirstVisit']) {
            let me = this;
            me.getView().mask(i18n.pleaseWait);

            if (this.getViewModel().get('theFiActionType') === "Cancellation") {
                this.validateFiRegistryQuestionnaires();
            }

            Ext.Ajax.request({
                method: 'PUT',
                url: first.config.Config.remoteRestUrl + 'ecm/fi/' + action.id,
                jsonData: {'fina:fiRegistryActionIsFirstVisit': false},
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (response) {
                    action['fina_fiRegistryActionIsFirstVisit'] = false;
                },
                callback: function (options, success, response) {
                    me.getView().unmask();
                }
            });
        } else {
            this.validateFiRegistry(this.getViewModel().get('theFi').id);
        }
    },

    onChangeControllerClick: function () {
        const vm = this.getViewModel();

        Ext.create('first.view.registration.reassign.ChangeInspectorView', {
            viewModel: {
                data: {
                    selectedUser: null,
                    group: vm.get('workflowVariables')['wf_inspectorGroupId'],
                    lastInspectorId: vm.get('theFi')['fina_fiRegistryLastInspectorId']
                        || (vm.get('assignedInspector') ? vm.get('assignedInspector').id : null),
                    lastEditorId: vm.get('theFi')['fina_fiRegistryLastEditorId'],
                    fiRegistryId: vm.get('theFi').id
                }
            }
        }).show();
    }

});
