Ext.define('first.store.questionnaire.QuestionnaireGroupStore', {
    extend: 'Ext.data.Store',

    alias: 'store.questionnaireGroupStore',

    storeId: 'questionnaireGroupStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.questionnaire.QuestionnaireGroupModel'
    ],

    model: 'first.model.questionnaire.QuestionnaireGroupModel',

    autoLoad: true,

    sorters: ['code'],

    pageSize: 20,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + 'ecm/questionnaire/group',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});