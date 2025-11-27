Ext.define('first.view.task.WorkflowDetailsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.workflowDetailsViewModel',

    stores: {
        /*
        A declaration of Ext.data.Store configurations that are first processed as binds to produce an effective
        store configuration. For example:

        users: {
            model: 'Task',
            autoLoad: true
        }
        */
    },

    formulas: {
        completed: function (get) {
            if (get('workflowDetails.processMetaModel.completed')) {
                return i18n.yes;
            }
            return i18n.no;
        },
        startedAt: function (get) {
            return Ext.Date.format(new Date(parseInt(get('workflowDetails.processMetaModel.startedAt'))), first.config.Config.timeFormat);
        }
    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    }
});