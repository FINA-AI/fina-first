Ext.define('first.store.dashboard.FiRegistrationByYear', {
    extend: 'Ext.data.Store',
    alias: 'store.fiRegistrationByYear',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config'
    ],

    fields: ['year', 'le', 'fex', 'mfo', 'cru'],

    proxy: {
        type: 'rest',
        enablePaging: false,
        url: first.config.Config.remoteRestUrl + 'ecm/dashboard/fiRegistryStatusCountByYear?year=' + new Date().getFullYear(),
        reader: {
            type: 'json',
            transform: {
                fn: function (data) {
                    let transformedData = [];
                    if (data && Ext.isArray(data)) {
                        let currentYear = new Date().getFullYear();
                        for (let i = currentYear - 4; i <= currentYear; i++) {
                            let transformedObject = {};
                            Ext.each(data, function (d) {
                                if (d.year === i) {
                                    transformedObject.year = i;
                                    transformedObject[d.fiType.toLowerCase()] = d.active;
                                }

                            });
                            transformedData.push(transformedObject);
                        }
                    }
                    return transformedData;
                },
                scope: this
            }
        }
    }

});