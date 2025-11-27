Ext.define('first.view.registration.task.change.ChangeGeneralCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeGeneralCard',

    listen: {
        controller: {
            '*': {
                changesListUpdated: 'onChangesListUpdated'
            }
        }
    },

    init: function () {
        this.load();
    },

    load: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let grid = this.lookupReference('changesGridView'),
            store = grid.getStore();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=Performed Changes&orderBy=createdAt desc');
        store.load();
        store.on('load', function (store, records) {
            me.getViewModel().set('disableSanctionPeopleCheckButton', records.length === 0);
        });
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

    onSanctionedPeopleCheck: function () {
        let me = this;
        let action = this.getViewModel().get('fiAction');

        action.fina_fiRegistryActionPreviousStep = action.fina_fiRegistryActionStep;
        action.fina_fiRegistryActionStep = '2';

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

    onRefreshClick: function () {
        this.load();
    },

    onChangesListUpdated: function (srcActionId) {
        let vm = this.getViewModel(),
            fi = vm.get('theFi'),
            actionId = fi['fina_fiRegistryLastActionId'];
        if (actionId === srcActionId) {
            this.load();
        }
    }

});
