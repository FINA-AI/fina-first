Ext.define('first.view.registration.FiActionsGapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiActionsGap',

    listen: {
        controller: {
            'fiProfileEcm': {
                reloadFiActionsGaps: 'reloadFiActionsGaps',
            }
        }
    },

    /**
     * Called when the view is created
     */
    init: function () {

    },

    reloadFiActionsGaps: function (fiRegistryId) {
        let currentFiRegistryId = this.getViewModel().get('theFi').id;
        if (currentFiRegistryId === fiRegistryId) {
            this.load();
        }
    },

    load: function () {
        let fiRegistryId = this.getViewModel().get('theFi').id,
            store = this.getView().getStore();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + fiRegistryId + '/children?relativePath=Gaps&orderBy=createdAt DESC');
        store.load({
            scope: this,
            callback: function () {
                store.filterBy(function (record, id) {
                    return record.get('fina_fiRegistryGapDetailActive');
                });
            }
        });
    },

    afterRender: function () {
        this.load();
    },

    isRestoreGapTaskActionDisabled: function (x, y, z, l, record) {
        let actionType = this.getViewModel().get('theFi')['fina_fiActionType'],
            fiRegistryStatus = this.getViewModel().get('fiRegistryStatus'),
            fiRegistryAction = this.getViewModel().get('fiAction');

        if (!record.get('fina_fiRegistryGapDetailActive') || actionType === 'REGISTRATION') {
            return true;
        }

        if (fiRegistryStatus === 'ACCEPTED' || fiRegistryStatus === 'CANCELED') {
            return false;
        }

        return !(fiRegistryStatus === 'GAP' || (fiRegistryAction.fina_fiRegistryActionStep === 9 && (actionType === 'BRANCHES_CHANGE' || actionType === 'BRANCHES_EDIT')));
    },

    onRestoreTaskActionClick: function (grid, r, c, btn, event, record) {
        let me = this,
            fiRegistryId = this.getViewModel().get('theFi').id;

        me.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/restore/gapAction/' + fiRegistryId + '/' + record.id,
            success: function (response) {
                me.fireEvent('refreshProfileView', fiRegistryId);
                me.fireEvent('reloadFiRegistryStore');

                if (me.getView()) {
                    me.getView().unmask();
                }
            },
            failure: function (response) {
                if (me.getView()) {
                    me.getView().unmask();
                }
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    onViewDetailsActionClick: function (grid, r, c, btn, event, record) {
        let actionId = record.get('fina_fiRegistryGapActionId'),
            fiRegistry = this.getViewModel().get('theFi'),
            title = 'Gap Task Details',
            window = Ext.create("Ext.window.Window", {
                title: title,
                iconCls: 'x-fa fa-cog',
                modal: true,
                maximizable: true,
                height: Ext.getBody().getViewSize().height - 120,
                width: Ext.getBody().getViewSize().width - 120,

                layout: {
                    type: 'fit'
                },

                items: [{
                    xtype: 'fiProcessHistoryPage',
                    viewModel: {
                        data: {
                            selectedActionGridItem: {id: actionId, documentsFolderId: null},
                            activeFiProcessHistoryItemName: 'Gaps',
                            fiRegistry: fiRegistry
                        }
                    }
                }]
            });
        window.show();
    },

    onDeleteGapDetailObjectClick: function (grid, r, c, btn, event, record) {
        let me = this;
        Ext.Msg.prompt(i18n.delete, i18n.deleteItemGeneralWarningMessage, function (button, text) {
            if (button === 'ok') {
                me.getView().mask(i18n.pleaseWait);

                let store = me.getView().getStore();
                store.remove(record);

                Ext.Ajax.request({
                    method: 'POST',
                    url: first.config.Config.remoteRestUrl + 'ecm/fi/gapAction/' + record.id + '?comment=' + text,
                    failure: function (response) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                        store.rejectChanges();
                    },
                    callback: function () {
                        me.getView().unmask();
                    }
                });
            }
        });
    }

});