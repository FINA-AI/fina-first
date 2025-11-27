Ext.define('first.view.questionnaire.QuestionnaireManagementEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.editquestionnaireManagementController',

    init: function () {
        this.getViewModel().set('questionnaireGroup', {});
    },


    onGroupComboSelect: function (combo, record) {
        if (this.getViewModel().get('questionnaireGroup').fiType) {
            this.loadCombos();
        }
    },

    onFiTypeComboSelect: function (combo, record) {
        if (this.getViewModel().get('questionnaireGroup').group) {
            this.loadCombos();
        }
    },

    loadCombos: function () {
        let parentStore = this.lookupReference('questionnaireParentCombo').getStore();
        let dependentStore = this.lookupReference('questionnaireGroupsCombo').getStore();
        parentStore.proxy.url = first.config.Config.remoteRestUrl + 'ecm/questionnaire/' + this.getViewModel().get('questionnaireGroup').group.id + '/' + this.getViewModel().get('questionnaireGroup').fiType.id;
        dependentStore.proxy.url = first.config.Config.remoteRestUrl + 'ecm/questionnaire/' + this.getViewModel().get('questionnaireGroup').group.id + '/' + this.getViewModel().get('questionnaireGroup').fiType.id;
        parentStore.load();
        dependentStore.load();
        this.lookupReference('questionnaireParentCombo').enable();
        this.lookupReference('questionnaireGroupsCombo').enable();
    },

    onSaveBtnClick: function () {
        let me = this;
        let data = this.getViewModel().get('questionnaireGroup');
       
        let form = this.lookupReference('questionManagementEditForm');
        if (form.isValid()) {
            if (data.questionnaireParentId && data.groupedIds.indexOf(data.questionnaireParentId) >= 0) {
                data.groupedIds.splice(data.groupedIds.indexOf(data.questionnaireParentId), 1);
            }

            me.getView().mask(i18n.pleaseWait);
            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/questionnaire/management/group/',
                method: 'POST',
                jsonData: data,
                success: function (response) {
                    me.fireEvent('refreshQuestionnaireManagementGrid')
                },
                callback: function () {
                    me.getView().unmask();
                    me.onCancelBtnClick();
                }
            })

        }
    },

    onCancelBtnClick: function () {
        this.getView().destroy();
    }

});

