Ext.define('first.view.fi.FiTypeEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiTypeEditController',

    /**
     * Called when the view is created
     */
    init: function () {

    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onSaveFiTypeBtnClick: function (component, e) {
        let fiType = this.getViewModel().get('fiType'),
            isEdit = this.getViewModel().get('isEdit'),
            store = Ext.getStore('fiTypeStore');

        if (isEdit) {
            let selectedFiType = store.findRecord('id', fiType.get('id'));
            selectedFiType.set('code', fiType.get('code'));
            selectedFiType.set('description', fiType.get('description'));
            selectedFiType.set('registrationWorkflowKey', fiType.get('registrationWorkflowKey'));
            selectedFiType.set('changeWorkflowKey', fiType.get('changeWorkflowKey'));
            selectedFiType.set('disableWorkflowKey', fiType.get('disableWorkflowKey'));
            selectedFiType.set('branchChangeWorkflowKey', fiType.get('branchChangeWorkflowKey'));
            selectedFiType.set('branchEditWorkflowKey', fiType.get('branchEditWorkflowKey'));
            selectedFiType.set('documentWithdrawalWorkflowKey', fiType.get('documentWithdrawalWorkflowKey'));
            selectedFiType.set('branchTypes', fiType.get('branchTypes'));
        } else {
            store.add(fiType);
        }

        let me = this;
        store.sync({
            success: function (batch, opts) {
                if (!isEdit) {
                    store.load();
                }
                console.log(opts);
                console.log(batch);
                me.getView().close();
            },
            failure: function (batch, opts) {
                first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.fiTypeSaveError, batch);
                if (!isEdit) {
                    store.remove(fiType);
                }
                store.rejectChanges();
            }
        });
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onCancelFiTypeBtnClick: function (component, e) {
        this.getView().destroy();
    }
});
