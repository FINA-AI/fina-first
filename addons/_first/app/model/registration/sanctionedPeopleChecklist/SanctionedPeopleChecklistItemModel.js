Ext.define('first.model.registration.sanctionedPeopleChecklist.SanctionedPeopleChecklistItemModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'personNodeId', type: 'string'},
        {name: 'personType', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'identificationNumber', type: ''},
        {name: 'isSanctioned', type: 'bool'},
        {name: 'dateChecked', type: 'date'},
        {name: 'comment', type: 'string'}
    ]
});