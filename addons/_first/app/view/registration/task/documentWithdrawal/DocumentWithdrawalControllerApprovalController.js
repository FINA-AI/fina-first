Ext.define('first.view.registration.task.documentWithdrawal.DocumentWithdrawalControllerApprovalController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.documentWithdrawalControllerApproval',

    onApprove: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionControlStatus = 'ACCEPTED';
        data.fina_fiRegistryActionStep = '3';

        me.getView().mask(i18n.pleaseWait);

        me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
            function (action, that) {
                me.getViewModel().set('isControllerButtonDisabled', true);
                me.getViewModel().set('fiAction', action);
                me.getViewModel().set('showTaskStatusMessage', true);
            },
            null,
            function () {
                me.getView().unmask();
            }
        );
    },

    onGap: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionStepController = '1';

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
    }

});
