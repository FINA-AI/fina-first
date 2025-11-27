Ext.define('first.view.questionnaire.QuestionnaireGroupEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.questionnaireGroupEditController',

    /**
     * Called when the view is created
     */
    init: function () {

    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onSaveBtnClick: function (component, e) {
        let questionnaireGroup = this.getViewModel().get('questionnaireGroup'),
            isEdit = this.getViewModel().get('isEdit'),
            store = Ext.getStore('questionnaireGroupStore');

        if (isEdit) {
            let selectedQuestionnaireGroup = store.findRecord('id', questionnaireGroup.get('id'));
            selectedQuestionnaireGroup.set('code', questionnaireGroup.get('code'));
            selectedQuestionnaireGroup.set('description', questionnaireGroup.get('description'));
        } else {
            store.add(questionnaireGroup);
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
                first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.questionnaireGroupSaveFailed, batch);

                if (!isEdit) {
                    store.remove(questionnaireGroup);
                }
                store.rejectChanges();
            }
        });
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onCancelBtnClick: function (component, e) {
        this.getView().destroy();
    }
});
