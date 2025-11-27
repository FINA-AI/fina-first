Ext.define('first.view.questionnaire.QuestionnaireManagementController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.questionnaireManagement',

    listen: {
        controller: {
            '*': {
                refreshQuestionnaireManagementGrid: 'refreshGrid'
            }
        }
    },

    refreshGrid: function () {
        this.getView().getStore().load();
    },

    onAddQuestionnaireClick: function () {
        let window = Ext.create('first.view.questionnaire.QuestionnaireManagementEditView', {
            title: 'Add',
            viewModel: {}
        });
        window.show();
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


    onFilterButtonClick: function (component) {
        let me = this;
        let store = this.getView().getStore();
        store.proxy.setExtraParams({
            query: component.filter
        });


        store.load({
            callback: function () {
                switch (component.filter) {
                    case 'subGroup':
                        me.getView().getStore().group('questionnaireParentId');
                        break;
                    default:
                        me.getView().getStore().group('questionnaireGroupName');
                        break
                }
            }
        });
    },

    onDeleteQuestionnaireClick: function () {
        let me = this;

        Ext.MessageBox.confirm(i18n.confirm, i18n.questionnaireGroupDeleteSelectedWarning, function (btn) {
            if (btn === 'yes') {
                me.getView().mask(i18n.pleaseWait);
                let selectedItems = me.getView().getSelectionModel().getSelection();
                let data = [];
                Ext.each(selectedItems, function (record) {
                    data.push(record.data);
                });

                Ext.Ajax.request({
                    url: first.config.Config.remoteRestUrl + 'ecm/questionnaire/management/group/',
                    method: 'DELETE',
                    jsonData: data,
                    success: function (response) {
                        me.fireEvent('refreshQuestionnaireManagementGrid')
                    },
                    callback: function () {
                        me.getView().unmask();
                    }
                });
            }
        });

    }

});