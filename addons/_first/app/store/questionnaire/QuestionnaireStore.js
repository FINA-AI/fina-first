Ext.define('first.store.questionnaire.QuestionnaireStore', {
    extend: 'Ext.data.Store',

    alias: 'store.questionnaireStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.questionnaire.QuestionnaireModel'
    ],

    model: 'first.model.questionnaire.QuestionnaireModel',

    autoLoad: false,

    pageSize: 20,

    grouper: {
        property: i18n.questionnaireGroup,
        groupFn: function (item) {
            return '<i>' + item.get('group').code + '</i> | ' + i18n.questionnaireFiType + ': <i>' + item.get('fiType').code + '</i>';
        }
    },

    sorters: [{
        property: 'sequence',
        direction: 'ASC'
    }],

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + 'ecm/questionnaire',
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