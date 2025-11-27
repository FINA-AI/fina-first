Ext.define('first.view.questionnaire.QuestionnaireGroupController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.questionnaireGroupController',

    requires: [
        'Ext.app.ViewModel',
        'first.model.questionnaire.QuestionnaireGroupModel'
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
    onAddQuestionnaireGroupClick: function (component, e) {

        let viewModel = new Ext.app.ViewModel({
            data: {
                isEdit: false,
                questionnaireGroup: Ext.create('first.model.questionnaire.QuestionnaireGroupModel')
            }
        });

        this.showEditQuestionnaireGroupWindow(i18n.questionnaireGroupAddNewGroup, viewModel);
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onEditQuestionnaireGroupClick: function (component, e) {
        let selectedRecord = this.getViewModel().get('selectedQuestionnaireGroup');
        let viewModel = new Ext.app.ViewModel({
            data: {
                selectedQuestionnaireGroup: selectedRecord,
                questionnaireGroup: Ext.create('first.model.questionnaire.QuestionnaireGroupModel', {
                    id: selectedRecord.get('id'),
                    code: selectedRecord.get('code'),
                    description: selectedRecord.get('description')
                }),
                isEdit: true
            }
        });

        this.showEditQuestionnaireGroupWindow(i18n.questionnaireGroupEditSelected, viewModel);
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onDeleteQuestionnaireGroupClick: function (component, e) {
        let me = this;
        Ext.Msg.confirm(i18n.delete, i18n.questionnaireGroupDeleteSelectedWarning, function (button) {
            if (button === 'yes') {
                let selectedRecord = me.getViewModel().get('selectedQuestionnaireGroup');

                let store = me.getView().getStore();
                store.remove(selectedRecord);
                store.sync({
                    failure: function (batch) {
                        first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.questionnaireGroupDeleteFailed, batch);
                        store.rejectChanges();
                    }
                });
            }
        });
    },

    showEditQuestionnaireGroupWindow: function (title, viewModel) {
        let window = Ext.create('first.view.questionnaire.QuestionnaireGroupEditView', {
            title: title,
            viewModel: viewModel
        });
        window.show();
    }

});
