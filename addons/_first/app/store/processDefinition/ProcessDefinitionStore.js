Ext.define('first.store.common.processDefinition.ProcessDefinitionStore', {
    extend: 'Ext.data.Store',

    alias: 'store.ecmProcessDefinitionStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.common.processDefinition.ProcessDefinitionModel'
    ],

    model: 'first.model.common.processDefinition.ProcessDefinitionModel',

    autoLoad: true,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + 'ecm/workflow/process/definitions',
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