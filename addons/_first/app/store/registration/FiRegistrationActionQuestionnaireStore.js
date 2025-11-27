Ext.define('first.store.registration.FiRegistrationActionQuestionnaireStore', {
    extend: 'Ext.data.Store',

    alias: 'store.registrationActionQuestionnaireStatusStoreEcm',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.registration.FiRegistrationActionQuestionnaireModel'
    ],

    model: 'first.model.registration.FiRegistrationActionQuestionnaireModel',

    groupField: 'questionnaireTypeGroup',
    groupDir: 'asc',

    sorters: [{
        property: 'sequence',
        direction: 'ASC'
    }],

    pageSize: 200,
    proxy: {
        type: 'rest',
        enablePaging: true,
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allowSingle: true,
            writeRecordId: false
        }
    }
});