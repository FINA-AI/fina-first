Ext.define('first.view.registration.task.branchChange.BranchChangeControllerGapCardController', {
    extend: 'first.view.registration.task.cancellation.CancellationControllerGapCardController',

    alias: 'controller.branchChangeControllerGapCard',

    onSendGap: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionControlStatus = 'DECLINED';
        data.fina_fiRegistryActionStep = '1';

        if(data.fina_fiRegistryActionRedactingStatus ==='WITHDRAWAL'){
            data.fina_fiRegistryActionStep = '6';
        }else{
            data.fina_fiRegistryActionStep = '1';
        }

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                me.getViewModel().getParent().set('fiAction', action);
                me.getViewModel().set('showTaskStatusMessage', true);
                me.lookupReference('controllerGapGridView').getStore().load();
            },
            null,
            function () {
                me.getView().unmask();
            }
        );
        me.getViewModel().get('fiProfileTaskController').initRedactorAndController();
    }
});
