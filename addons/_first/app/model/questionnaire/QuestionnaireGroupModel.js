Ext.define('first.model.questionnaire.QuestionnaireGroupModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'description', type: 'string'}
    ],

    idProperty: 'id'
});