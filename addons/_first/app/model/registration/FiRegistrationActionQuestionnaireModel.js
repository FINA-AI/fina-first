Ext.define('first.model.registration.FiRegistrationActionQuestionnaireModel', {
    extend: 'Ext.data.TreeModel',

    requires: [
        'Ext.data.identifier.Negative'
    ],

    identifier: 'negative',
    idProperty: 'id',

    fields: [
        {name: 'id'},
        {name: 'sequence', type: 'int'},
        {name: 'question', type: 'string'},
        {name: 'questionnaireId', type: 'int'},
        {name: 'status'},
        {name: 'note', type: 'string'},
        {name: 'relevanceTime', type: 'date'},
        {name: 'predefined', type: 'bool'},
        {name: 'questionnaireTypeGroup', type: 'string'},
        {name: 'subTypeQuestionnaire', type: 'bool'}
    ]
});