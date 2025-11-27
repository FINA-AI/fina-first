Ext.define('first.model.organization.OrganizationIndividualLicenseCertificateModel', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'uniqueNumber', type: 'string'},
        {name: 'status', type: 'string'},
        {name: 'issueDate', type: 'date', dateFormat: 'time'},
        {name: 'resolutionDocNumber', type: 'string'},
        {name: 'type'},
        {name: 'expirationDate', type: 'date', dateFormat: 'time'},
        {name: 'suspendDate', type: 'date', dateFormat: 'time'},
        {name: 'suspendReason', type: 'string'},
        {name: 'createdAt', type: 'date', dateFormat: 'time'},
        {name: 'modifiedAt', type: 'date', dateFormat: 'time'},
        {name: 'attachedFiles'}
    ]

});