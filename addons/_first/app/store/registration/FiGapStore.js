Ext.define('first.store.registration.FiGapStore', {
    extend: 'Ext.data.Store',

    alias: 'store.fiGapStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.repository.NodeModel'
    ],


    model: 'first.model.repository.NodeModel',

    autoLoad: false,

    grouper: {
        property: i18n.gapObjectColumnTitle,
        groupFn: function (record) {
            let value = record.get('properties')['fina:fiGapObject'];
            let translatedValue = i18n[value] ? i18n[value] : value;
            let description = record.get('properties')['fina:fiGapDescription'];
            if (description) {
                translatedValue = description + ' - ' + translatedValue;
            }
            return translatedValue;
        }
    },

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

                        let getBranchGroupingTitle = function (properties) {
                            let result = '',
                                array = ['fina:fiRegistryBranchType', 'fina:fiRegistryBranchAddressRegion', 'fina:fiRegistryBranchAddressCity', 'fina:fiRegistryBranchAddress']

                            Ext.each(array, function (arrayElement, index) {
                                let value = properties[arrayElement];
                                if (value) {
                                    result += i18n[value] ? i18n[value] : value;
                                    if (index !== array.length - 1) {
                                        result += ', ';
                                    }
                                }
                            });

                            return result;
                        };

                        Ext.each(data.list, function (record) {
                            if (record) {
                                let props = record.properties;
                                if (props) {

                                    if (props['branch']) {
                                        let branchGroupingTitle = getBranchGroupingTitle(props['branch'].properties);
                                        record['branchGroupingTitle'] = branchGroupingTitle;
                                    }

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
            writeAllFields: false
        }
    }
});
