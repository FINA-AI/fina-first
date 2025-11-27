Ext.define('first.model.questionnaire.QuestionnaireModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id'},
        {name: 'group'},
        {name: 'fiType'},
        {name: 'question', type: 'string'},
        {name: 'obligatory', type: 'bool'},
        {name: 'defaultValue', type: 'string'},
        {name: 'code', type: 'string'}
    ],

    idProperty: 'id'
});