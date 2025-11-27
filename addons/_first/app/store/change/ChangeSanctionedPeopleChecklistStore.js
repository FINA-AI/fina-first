Ext.define('first.store.change.ChangeSanctionedPeopleChecklistStore', {
    extend: 'Ext.data.Store',

    alias: 'store.changeSanctionedPeople',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
    ],


    model: 'first.model.repository.NodeModel',

    autoLoad: false,
    remoteFilter: true,

    proxy: {
        type: 'rest',
        url: first.config.Config.remoteRestUrl,
        enablePaging: true,
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults',
            transform: {
                fn: function (data) {
                    if (data && data.list) {
                        Ext.each(data.list, function (record) {
                            if (record) {
                                let props = record.properties;
                                if (props) {
                                    Ext.Object.each(props, function (key, val) {
                                        record[key.replace(':', '_')] = val;
                                    });
                                }
                            }
                        }, this);
                    }

                    return data;
                },
                scope: this
            }
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            transform: {
                fn: function (data) {
                    Ext.each(data, function (item) {
                        let updatedProps = {};
                        if (item) {
                            Ext.Object.each(item, function (key, value) {
                                if (key !== "id") {
                                    updatedProps[key.replace("_", ":")] = value;
                                }
                            });
                            data = {
                                id: item.id,
                                properties: updatedProps
                            }
                        }
                    });
                    return data;
                },
                scope: this
            }
        }
    }
});
