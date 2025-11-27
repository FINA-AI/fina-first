Ext.define('first.store.task.TaskStore', {
    extend: 'Ext.data.Store',

    alias: 'store.taskStore',

    storeId: 'taskStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.task.TaskModel'
    ],

    model: 'first.model.task.TaskModel',

    autoLoad: false,

    sorters: [{
        property: 'startedAt',
        direction: 'DESC'
    }],

    remoteSort: true, // remote sort = true is bugged when it is used with grouping feature

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/workflow/tasks",
        extraParams: {
            "where": "(status='any' and includeTaskVariables=true and assignee='-me-')",
        },
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults',
            transform: {
                fn: function (data) {
                    if (data && data.list) {
                        var transform = function (timestamp) {
                            if (timestamp) {
                                return timestamp / 1000 + '';
                            }
                            return timestamp;
                        };
                        Ext.each(data.list, function (record) {
                            record.startedAt = transform(record.startedAt);
                            record.dueAt = transform(record.dueAt);
                            record.endedAt = transform(record.endedAt);
                        }, this);
                    }
                    return data;
                },
                scope: this
            }
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});