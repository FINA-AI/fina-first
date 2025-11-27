Ext.define('first.view.registration.task.change.ChangeSanctionedPeopleCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeSanctionedPeopleCard',

    listen: {
        controller: {
            '*': {
                changesListUpdated: 'onSanctionedPeopleChecklistUpdate'
            }
        }
    },

    init: function () {
        let grid = this.lookupReference('changeSanctionedPeopleGrid');

        const theFi = this.getViewModel().get('theFi'),
            actionId = theFi['fina_fiRegistryLastActionId'];
        let proxyUrl = first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children' + '?relativePath=Performed Changes&orderBy=createdAt desc';
        grid.getStore().getProxy().setUrl(proxyUrl);

        let me = this;

        grid.on('edit', function (editor, e) {
            grid.getStore().getProxy().setUrl(first.config.Config.remoteRestUrl + 'ecm/node/');
            if (grid.getStore().getModifiedRecords().length > 0) {
                me.getView().mask(i18n.pleaseWait);
            }
            grid.getStore().sync({
                callback: function () {
                    grid.getStore().getProxy().setUrl(proxyUrl);
                    me.getView().unmask();
                }
            });
        });
        me.getViewModel().set('disableConfirmationLetter', true);
        this.load();

        grid.getStore().on('load', function (store, records) {
            me.getViewModel().set('disableConfirmationLetter', false);
        });
    },


    onRefreshClick: function () {
        this.load();
    },


    load: function () {
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let grid = this.lookupReference('changeSanctionedPeopleGrid'),
            store = grid.getStore();
        store.getProxy().setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children' + '?relativePath=Performed Changes&orderBy=createdAt desc');
        store.clearFilter(true);
        store.setRemoteFilter(false);
        store.addFilter([{
            property: 'fina_fiManagementChangeObjectValidateInSanctionsPeople',
            value: true
        }], true);

        store.load();
    },


    beforeCellEdit: function (obj, editor) {
        return this.getViewModel().get('isRegistryActionEditor') && !editor.record.get('fina_fiManagementChangeObjectSanctionedStatusNotEditable');
    },


    onViewClick: function (view, recIndex, cellIndex, item, e, record) {
        let tabName = '';
        switch (record.get('fina_fiManagementChangeType')) {
            case 'fiBeneficiary':
                tabName = 'Complex_Structures';
                break;
            case 'fiAuthorizedPerson':
                tabName = 'Authorized_Persons';
                break;

        }
        let fiProfileController = this.getViewModel().get('fiProfileController');
        fiProfileController.setActiveTabAndSelectRecord(tabName, record.get('fina_fiManagementChangeReferenceId'));
    },

    onChangeList: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionPreviousStep = data.fina_fiRegistryActionStep;
        data.fina_fiRegistryActionStep = '1';

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
    },

    onGenerateApprovalLetter: function () {
        let me = this,
            vm = this.getViewModel(),
            data = vm.get('fiAction'),
            fiRegistryId = vm.get('theFi').id;

        me.getView().mask(i18n.pleaseWait);

        let grid = this.lookupReference('changeSanctionedPeopleGrid'),
            store = grid.getStore();
        let ignoreSanctionPeopleCheck = store.getData().length === 0;

        this.fireEvent('validateFiRegistryCall', fiRegistryId, function (result) {
            let isSanctionedPeopleChecklistValid = result['fina:fiRegistryValidationResultSanctionedPeopleChecklistValid'],
                isSanctionedPersonFound = result['fina:fiRegistryValidationResultSanctionedPersonFound'],
                ignoreSanctionedPeopleChecklist = !!vm.get('workflowVariables')['wf_ignoreSanctionedPeopleListValidity'];

            isSanctionedPeopleChecklistValid |= ignoreSanctionPeopleCheck;

            vm.set('isSanctionedPeopleChecklistValid', isSanctionedPeopleChecklistValid);
            vm.set('isSanctionedPersonFound', isSanctionedPersonFound);
            vm.set('ignoreSanctionedPeopleChecklist', ignoreSanctionedPeopleChecklist);

            if (isSanctionedPeopleChecklistValid && (!isSanctionedPersonFound || ignoreSanctionedPeopleChecklist)) {

                if (isSanctionedPersonFound) {
                    Ext.toast(i18n.sanctionedPersonFound, i18n.information);
                }

                data.fina_fiRegistryActionPreviousStep = data.fina_fiRegistryActionStep;
                data.fina_fiRegistryActionStep = '3';

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
                me.getView().unmask();

                if (!isSanctionedPeopleChecklistValid && ignoreSanctionedPeopleChecklist) {
                    Ext.toast(i18n.checklistNotValid, i18n.information);
                } else if (isSanctionedPersonFound) {
                    Ext.toast(i18n.sanctionedPersonFound, i18n.information);
                } else {
                    Ext.toast(i18n.checklistNotValid, i18n.information);
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

    onSanctionedPeopleChecklistUpdate: function (srcActionId) {
        let vm = this.getViewModel(),
            fi = vm.get('theFi'),
            actionId = fi['fina_fiRegistryLastActionId'];

        if (actionId === srcActionId) {
            this.load();
        }
    },

    onGap: function () {
        let me = this;
        let action = this.getViewModel().get('fiAction');

        if (action['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            action.fina_fiRegistryActionPreviousStep = action.fina_fiRegistryActionStep;
            action.fina_fiRegistryActionStep = '0';

            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').updateActionTask(action.id, action,
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

    exportSanctionedPeople: function () {
        this.fireEvent('exportReport', 'exportSanctionedPeopleChange', this.getViewModel().get('theFi')['id']);
    },

    onComboValueChange: function () {
        let record = this.getView().lookupReference('changeSanctionedPeopleGrid').getSelectionModel().getSelection();
        record[0].set('fina_fiManagementChangeObjectSanctionedCheckDate', new Date());
    }

});
