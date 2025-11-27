Ext.define('first.view.registration.task.GeneralCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.generalCard',

    listen: {
        controller: {
            '*': {
                sanctionedPeopleChecklistUpdate: 'getSanctionedPeopleChecklistModifiedStatus'
            }
        }
    },


    init: function () {
        this.getSanctionedVerificationWindowOpenStatus();
        this.getSanctionedPeopleChecklistModifiedStatus(this.getViewModel().get('theFi').fina_fiRegistryLastActionId);
    },

    onGap: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        if (data['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            data.fina_fiRegistryActionPreviousStep = data.fina_fiRegistryActionStep;
            data.fina_fiRegistryActionStep = '0';

            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
                function (action, that) {
                    me.getViewModel().set('fiAction', action);
                    that.setActivateTab(action.fina_fiRegistryActionStep);
                },
                null,
                function () {
                    me.getView().unmask();
                });
        } else {
            me.getViewModel().get('fiProfileTaskController').setActivateTab(0);
        }
    },

    onReportCard: function () {
        let me = this,
            vm = this.getViewModel(),
            fiRegistryId = vm.get('theFi').id,
            data = vm.get('fiAction');

        this.fireEvent('validateFiRegistryCall', fiRegistryId, function (result) {

            let isSanctionedPeopleChecklistUpdated = result['fina:fiRegistryValidationResultSanctionedPeopleChecklistModified'],
                isSanctionedPeopleChecklistValid = result['fina:fiRegistryValidationResultSanctionedPeopleChecklistValid'],
                isSanctionedPersonFound = result['fina:fiRegistryValidationResultSanctionedPersonFound'],
                invalidQuestionnaireFolders = result['fina:fiRegistryValidationResultQuestionnaireInvalidFolders'],
                ignoreSanctionedPeopleChecklist = vm.get('workflowVariables')['wf_ignoreSanctionedPeopleListValidity'];
            vm.set('isSanctionedPeopleChecklistUpdated', isSanctionedPeopleChecklistUpdated);
            vm.set('isSanctionedPeopleChecklistValid', isSanctionedPeopleChecklistValid);
            vm.set('isSanctionedPersonFound', isSanctionedPersonFound);
            vm.set('ignoreSanctionedPeopleChecklist', !!ignoreSanctionedPeopleChecklist);

            let isQuestionnairesFullyFilled = !invalidQuestionnaireFolders || me.isEmpty(invalidQuestionnaireFolders);
            vm.set('isQuestionnairesFullyFilled', isQuestionnairesFullyFilled);

            if (!isSanctionedPeopleChecklistUpdated && isSanctionedPeopleChecklistValid
                && (!isSanctionedPersonFound || ignoreSanctionedPeopleChecklist) && isQuestionnairesFullyFilled) {

                if (isSanctionedPersonFound) {
                    Ext.toast(i18n.sanctionedPersonFound, i18n.information);
                }
                if (data['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
                    data.fina_fiRegistryActionStep = '2';

                    me.getView().mask(i18n.pleaseWait);
                    me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
                        function (action, that) {
                            me.getViewModel().set('fiAction', action);
                            that.setActivateTab(action.fina_fiRegistryActionStep);
                        },
                        null,
                        function () {
                            me.getView().unmask();
                        });
                } else {
                    me.getViewModel().get('fiProfileTaskController').setActivateTab(2);
                }
            } else {
                if (isSanctionedPeopleChecklistUpdated) {
                    Ext.toast(i18n.checklistUpdated, i18n.information);
                } else if (isSanctionedPersonFound) {
                    Ext.toast(i18n.sanctionedPersonFound, i18n.information);
                } else if (!isSanctionedPeopleChecklistValid) {
                    Ext.toast(i18n.checklistNotValid, i18n.information);
                } else {
                    Ext.toast(i18n.nodeQuestionnairesAreNotFullyFilled, i18n.information);
                }
            }
        }, function () {
            Ext.toast(i18n.pleaseRegenerateReportCard, i18n.error);
            vm.set('reportCardNeedsRegeneration', true);
            me.getView().unmask();
        }, function (response) {
            me.getView().unmask();
            first.util.ErrorHandlerUtil.showErrorWindow(response);
        });

    },

    isEmpty: function (obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },

    onSanctionedPeopleChecklistReviewClick: function () {
        if (this.getViewModel().get('isRegistryActionEditor')) {
            this.onSanctionedVerificationWindowOpen()
        }

        let me = this;

        let window = Ext.create({
            xtype: 'sanctionedPeopleChecklistWindow',
            viewModel: {
                data: me.getViewModel().data
            }
        });

        window.show();
    },

    onAttestationChecklistReviewClick: function () {

        //TODO ...
        if (this.getViewModel().get('isRegistryActionEditor')) {
            this.onSanctionedVerificationWindowOpen()
        }

        let me = this;

        let window = Ext.create({
            xtype: 'sanctionedPeopleChecklistWindow',
            viewModel: {
                data: me.getViewModel().data
            }
        });

        window.show();
    },


    getSanctionedPeopleChecklistModifiedStatus: function (srcActionId) {
        let vm = this.getViewModel(),
            fi = vm.get('theFi'),
            actionId = fi['fina_fiRegistryLastActionId'];

        if (actionId === srcActionId) {
            this.fireEvent('validateSanctionedPeopleChecklistModifiedStatusCall', fi.id, srcActionId, function (isSanctionedPeopleChecklistUpdated, isSanctionedPeopleChecklistIsFirstEntry) {
                vm.set('isSanctionedPeopleChecklistUpdated', isSanctionedPeopleChecklistUpdated);
                vm.set('isSanctionedPeopleChecklistFirstEntry', isSanctionedPeopleChecklistIsFirstEntry);
            }, function (response) {
                console.log(response);
                Ext.toast(i18n.registryDataValidationProgressError, i18n.error);
            });
        }
    },

    onSanctionedVerificationWindowOpen: function () {
        let me = this,
            vm = me.getViewModel(),
            theFi = vm.get('theFi'),
            actionId = theFi['fina_fiRegistryLastActionId'];

        this.fireEvent('getSanctionedPeopleChecklistCall', theFi.id, actionId, null,
            function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            function (options, success, response) {
                let checklistModifiedFlagNode = JSON.parse(response.responseText);

                Ext.Ajax.request({
                    method: 'PUT',
                    url: first.config.Config.remoteRestUrl + 'ecm/node/' + checklistModifiedFlagNode.id,
                    jsonData: {
                        id: checklistModifiedFlagNode.id,
                        properties: {
                            'fina:isSanctionVerificationWindowNotOpenedAtOnce': false
                        }
                    },
                    callback: function (options, success, response) {
                        vm.set('isSanctionVerificationWindowNotOpenedAtOnce', false);
                    }
                });
            });
    },

    getSanctionedVerificationWindowOpenStatus: function () {
        let me = this,
            vm = me.getViewModel(),
            theFi = vm.get('theFi'),
            actionId = theFi['fina_fiRegistryLastActionId'];

        this.fireEvent('getSanctionedPeopleChecklistCall', theFi.id, actionId, null,
            function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            function (options, success, response) {
                let checklistModifiedFlagNode = JSON.parse(response.responseText);
                vm.set('isSanctionVerificationWindowNotOpenedAtOnce', checklistModifiedFlagNode.properties['fina:isSanctionVerificationWindowNotOpenedAtOnce']);
            });
    },

});
