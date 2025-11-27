Ext.define('first.model.fi.FiTypeModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'registrationWorkflowKey', type: 'string'},
        {name: 'changeWorkflowKey', type: 'string'},
        {name: 'disableWorkflowKey', type: 'string'},
        {name: 'branchChangeWorkflowKey', type: 'string'},
        {name: 'branchEditWorkflowKey', type: 'string'},
        {name: 'documentWithdrawalWorkflowKey', type: 'string'},
        {name: 'branchTypes'}
    ],

    idProperty: 'id'
});