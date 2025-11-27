Ext.define('first.view.questionnaire.QuestionnaireEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.questionnaireEditController',

    requires: [
        'first.config.Config'
    ],

    init: function () {

    },

    onSaveBtnClick: function () {
        let me = this,
            isEdit = this.getViewModel().get('isEdit'),
            form = this.getView().lookupReference('questionEditForm');

        me.getView().mask(i18n.pleaseWait);

        if (form.isValid()) {
            let httpMethod = 'PUT',
                newQuestionnaire = this.getViewModel().get('questionnaire'),
                store = Ext.getStore('questionnaireStore'),
                groupStore = Ext.getStore('questionnaireEditGroupStore'),
                fiTypeStore = Ext.getStore('questionnaireEditFiTypeStore');

            let questionnaireJsonDataItem = {
                id: newQuestionnaire.id,
                question: newQuestionnaire.question,
                obligatory: newQuestionnaire.obligatory,
                checkSize: newQuestionnaire.checkSize,
                questionnaireGroupName: newQuestionnaire.questionnaireGroupName,
                questionnaireParentId: newQuestionnaire.questionnaireParentId,
                sequence: newQuestionnaire.sequence,
                fiType: fiTypeStore.findRecord('id', newQuestionnaire.fiType.id).data,
                group: groupStore.findRecord('id', newQuestionnaire.group.id).data,
                code: newQuestionnaire.code,
                defaultValue: newQuestionnaire.defaultValue
            };

            if (!isEdit) {
                questionnaireJsonDataItem.id = null;
                httpMethod = 'POST';
            }

            Ext.Ajax.request({
                method: httpMethod,
                url: first.config.Config.remoteRestUrl + 'ecm/questionnaire',
                jsonData: questionnaireJsonDataItem,
                success: function (response) {
                    store.load({
                        callback: function () {
                            me.getView().close();
                        }
                    });
                },
                failure: function (response) {
                    me.getView().unmask();
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            });

        } else {
            me.getView().unmask();
            Ext.Msg.show({
                title: i18n.warning,
                message: i18n.fillRequiredFieldsWarning,
                buttons: Ext.Msg.CANCEL,
                icon: Ext.Msg.INFO
            });
        }
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onCancelBtnClick: function (component, e) {
        this.getView().destroy();
    }

});
