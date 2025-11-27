Ext.define('first.store.registration.ComplexStuctureStore', {
    extend: 'Ext.data.TreeStore',

    alias: 'store.complexStructureStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config'
    ],


    model: 'Ext.data.TreeModel',
    root: {
        name: 'root',
        id: 'root',
        expanded: true,
        loaded: true,
        glyph: 'xf19c@FontAwesome'
    },

    defaultRootText: '',

    remoteFilter: true,

    proxy: {
        autoLoad: false,
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
                                    switch (record['fina_fiComplexStructureType']) {
                                        case 'LEGAL':
                                            record['nameField'] = record['fina_fiComplexStructureLegalName'];
                                            record['idNumber'] = record['fina_fiComplexStructureIdentificationNumber'];
                                            record['percentage'] = record['fina_fiComplexStructureCapitalPercentage'];
                                            break;
                                        case 'PHYSICAL':
                                            let firstName = record['fina_fiPersonFirstName'];
                                            let lastName = record['fina_fiPersonLastName'];
                                            let name = (firstName ? firstName : '') + ' ' + (lastName ? lastName : '');
                                            record['nameField'] = name.trim().length === 0 ? '' : name;
                                            record['idNumber'] = record['fina_fiPersonPersonalNumber'];
                                            record['percentage'] = record['fina_fiComplexStructureCapitalPercentage'];
                                            record['fina_fiComplexStructureRegistrationCountry'] = record['fina_fiPersonCitizenship'];
                                            break;
                                        default:
                                            record['idNumber'] = record['fina_fiComplexStructureIdentificationNumber'];
                                            record['nameField'] = record['fina_fiComplexStructureLegalName'];
                                            record['percentage'] = record['fina_fiComplexStructureCapitalPercentage'];

                                    }
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

