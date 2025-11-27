Ext.define('first.store.common.RegionalStructureStore', {
    extend: 'Ext.data.Store',

    alias: 'store.regionalStructureStore',


    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.fi.FiTypeModel'
    ],

    proxy: {
        type: 'rest',
        enablePaging: true,
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults',
            transform: {
                fn: function (data) {
                    let result = [];

                    Ext.each(data.list,function (dataItem) {
                        let obj = {};
                        Ext.Object.each(dataItem.properties, function (name,value) {
                            obj[name.replace(':','_')]=value
                        });
                        obj['id']=dataItem.id;
                        result.push(obj);
                    });
                    return result;
                },
                scope: this
            }
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    },
});
