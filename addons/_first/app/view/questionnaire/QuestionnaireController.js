Ext.define('first.view.questionnaire.QuestionnaireController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.questionnaireController',

    requires: [
        'Ext.app.ViewModel'
    ],

    init: function () {
        this.refreshGrid();
    },

    refreshGrid: function () {
        this.getView().getStore().load();
    },

    onAddQuestionnaireClick: function () {
        let viewModel = new Ext.app.ViewModel({
            questionnaire: {},
            data: {
                isEdit: false
            }
        });

        this.showEditQuestionnaireWindow(i18n.questionnaireAddNewQuestion, viewModel);
    },


    onEditQuestionnaireClick: function () {
        let selectedRecord = this.getViewModel().get('selectedQuestionnaire');
        let viewModel = new Ext.app.ViewModel({
            data: {
                questionnaire: {
                    id: selectedRecord.get('id'),
                    fiType: selectedRecord.get('fiType'),
                    group: selectedRecord.get('group'),
                    question: selectedRecord.get('question'),
                    obligatory: selectedRecord.get('obligatory'),
                    checkSize: selectedRecord.get('checkSize'),
                    questionnaireGroupName: selectedRecord.get('questionnaireGroupName'),
                    questionnaireParentId: selectedRecord.get('questionnaireParentId'),
                    sequence: selectedRecord.get('sequence'),
                    code: selectedRecord.get('code'),
                    defaultValue: selectedRecord.get('defaultValue')
                },
                isEdit: true
            }
        });

        this.showEditQuestionnaireWindow(i18n.questionnaireEditQuestion, viewModel);
    },


    showEditQuestionnaireWindow: function (title, viewModel) {
        let window = Ext.create('first.view.questionnaire.QuestionnaireEditView', {
            title: title,
            viewModel: viewModel
        });
        window.show();
    },

    onDeleteQuestionnaireClick: function () {
        let me = this;
        Ext.Msg.confirm(i18n.delete, i18n.questionnaireDeleteWarning, function (button) {
            if (button === 'yes') {
                let model = me.getViewModel().get('selectedQuestionnaire');
                let store = me.getView().getStore();
                store.remove(model);
                store.sync({
                    failure: function (batch) {
                        first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.questionnaireCouldNotDelete, batch);
                        store.rejectChanges();
                    }
                });
            }
        });
    },

    renderGroupColumn: function (x, y, record) {
        if (record) {
            let group = record.get('group');
            return Ext.String.format('<span>{0} - {1}</span>', group.code, group.description);
        }
        return '<span></span>';
    },

    renderFiTypeColumn: function (x, y, record) {
        if (record) {
            let fiType = record.get('fiType');
            return Ext.String.format('<span>{0} - {1}</span>', fiType.code, fiType.description);
        }
        return '<span></span>';
    },

    renderDefaultValueColumn: function (x, y, record) {
        let defaultValue = record.get('defaultValue');
        return defaultValue ? i18n[defaultValue] || defaultValue : '';
    },

    onMoveDownRecord: function () {
        let record = this.getViewModel().get('selectedQuestionnaire');
        this.updateQuestionSequenc(record, 1);
    },
    onMoveUpRecord: function () {
        let record = this.getViewModel().get('selectedQuestionnaire');
        this.updateQuestionSequenc(record, -1);
    },


    updateQuestionSequenc: function (record, sequence) {
        let me = this;
        me.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/questionnaire/sequence/' + sequence,
            method: 'PUT',
            jsonData: record.data,
            success: function (response) {
            },
            callback: function () {
                me.getView().unmask();
                me.refreshGrid();
            }
        })
    }
});
