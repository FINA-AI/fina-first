Ext.define('first.view.fi.FiTypeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiTypeController',

    requires: [
        'Ext.app.ViewModel',
        'first.model.fi.FiTypeModel'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onAddFiTypeClick: function (component, e) {
        let viewModel = new Ext.app.ViewModel({
            data: {
                isEdit: false,
                fiType: Ext.create('first.model.fi.FiTypeModel')
            }
        });

        this.showEditFiTypeWindow(i18n.fiTypeAddNew, viewModel);
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onEditFiTypeClick: function (component, e) {
        let selectedRecord = this.getViewModel().get('selectedFiType');
        let viewModel = new Ext.app.ViewModel({
            data: {
                selectedFiType: selectedRecord,
                fiType: Ext.create('first.model.fi.FiTypeModel', {
                    id: selectedRecord.get('id'),
                    code: selectedRecord.get('code'),
                    description: selectedRecord.get('description'),
                    branchTypes: selectedRecord.get('branchTypes'),
                    registrationWorkflowKey: selectedRecord.get('registrationWorkflowKey'),
                    changeWorkflowKey: selectedRecord.get('changeWorkflowKey'),
                    disableWorkflowKey: selectedRecord.get('disableWorkflowKey'),
                    branchChangeWorkflowKey: selectedRecord.get('branchChangeWorkflowKey'),
                    branchEditWorkflowKey: selectedRecord.get('branchEditWorkflowKey'),
                    documentWithdrawalWorkflowKey: selectedRecord.get('documentWithdrawalWorkflowKey'),
                }),
                isEdit: true
            }
        });

        this.showEditFiTypeWindow(i18n.fiTypeEditSelected, viewModel);
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onDeleteFiTypeClick: function (component, e) {
        let me = this;
        Ext.Msg.confirm(i18n.delete, i18n.fiTypeDeleteSelectedWarning, function (button) {
            if (button === 'yes') {
                let selectedRecord = me.getViewModel().get('selectedFiType');

                let store = me.getView().getStore();
                store.remove(selectedRecord);
                store.sync({
                    failure: function (batch) {
                        first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.fiTypeDeleteFailed, batch);
                        store.rejectChanges();
                    }
                });
            }
        });
    },

    showEditFiTypeWindow: function (title, viewModel) {
        let window = Ext.create('first.view.fi.FiTypeEditView', {
            title: title,
            viewModel: viewModel
        });
        window.show();
    }
});
