Ext.define('first.store.fi.BranchTypeStore', {
    extend: 'Ext.data.Store',

    alias: 'store.branchTypeStore',

    storeId: 'branchTypeStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config'
    ],

    autoLoad: true,

    proxy: {
        type: 'rest',
        url: first.config.Config.remoteRestUrl + 'ecm/config/properties/existingBranchTypes',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults',
            transform: {
                fn: function (data) {
                    if (data && data.list) {
                        let list = [];
                        Ext.each(data.list, function (item) {
                            const name = item;
                            list.push({
                                name: item,
                                displayName: i18n[name] ? i18n[name] : name
                            });
                        });

                        data.list = list;
                    }

                    return data;
                }
            }
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});