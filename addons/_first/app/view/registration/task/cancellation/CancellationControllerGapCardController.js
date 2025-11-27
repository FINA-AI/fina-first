Ext.define('first.view.registration.task.cancellation.CancellationControllerGapCardController', {
    extend: 'first.view.registration.task.change.ChangeControllerGapCardController',

    alias: 'controller.cancellationControllerGapCard',

    onBack: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        if(data.fina_fiRegistryActionRedactingStatus === 'DECLINED'){
            data.fina_fiRegistryActionStepController = '0';
        }else if(data.fina_fiRegistryActionRedactingStatus ==='WITHDRAWAL') {
            data.fina_fiRegistryActionStepController = '7';
        }else{
            data.fina_fiRegistryActionStepController = '2';
        }

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                that.setActivateTab(action.fina_fiRegistryActionStepController);
            },
            null,
            function () {
                me.getView().unmask();
            });
    }

});
