Ext.define('first.view.registration.task.cancellation.CancellationGapCardController', {
    extend: 'first.view.registration.task.change.ChangeGapCardController',

    alias: 'controller.cancellationGapCard',

    init: function () {
        this.callParent();
    },

    onGap: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionStepController = '3';
        data.fina_fiRegistryActionRedactingStatus = 'DECLINED';

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                me.getViewModel().getParent().set('fiAction', action);
                that.setActivateTab(action.fina_fiRegistryActionStepController);
            },
            null,
            function () {
                me.getView().unmask();
            }
        );
    },

    onMoveProcessToGappedState: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');

        let data = this.getViewModel().get('fiAction');

        me.getView().mask(i18n.pleaseWait);


        if (data['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            data.fina_fiRegistryActionStep = '5';
            data.fina_fiRegistryActionControlStatus = 'NONE';
            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
                function (action, that) {
                    me.getViewModel().set('fiAction', action);
                    that.setActivateTab(action.fina_fiRegistryActionStep);
                    me.getViewModel().set('fiRegistryStatus', 'IN_PROGRESS');
                    me.getViewModel().set('fiAction', data);
                    theFi['fina:fiRegistryStatus'] = 'IN_PROGRESS';
                    me.getViewModel().set('theFi', theFi);
                    me.fireEvent('onActionTaskStepChange', me.getViewModel().get('theFi').id);
                    me.changeRegistryAndControllerStatus("GAP", function (response) {
                        Ext.Ajax.request({
                            method: 'POST',
                            url: first.config.Config.remoteRestUrl + 'ecm/notification/' + me.getViewModel().get('fiAction').id +
                                '?fiRegistryId=' + me.getViewModel().get('theFi').id + '&userLogin=' + first.config.Config.conf.properties.currentUser.id + '&isPausedOnGap=true',

                            success: function (response) {
                                me.getView().unmask();
                                me.fireEvent('refreshProfileView', me.getViewModel().get('theFi').id)
                            }
                        });
                    });
                },
                null,
                function () {
                    me.getView().unmask();
                });

        }
        me.updateGapLetter();
    },

});
