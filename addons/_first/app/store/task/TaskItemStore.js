Ext.define('first.store.task.TaskItemStore', {
    extend: 'Ext.data.Store',

    alias: 'store.taskItemStore',

    storeId: 'taskItemStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.model.task.TaskItemModel'
    ],

    model: 'first.model.task.TaskItemModel',

    autoLoad: false,

    proxy: {
        type: 'rest',
        enablePaging: true,

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
                            record.createdAt = transform(record.createdAt);
                            record.modifiedAt = transform(record.modifiedAt);
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