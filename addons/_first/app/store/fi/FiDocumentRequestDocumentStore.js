Ext.define('first.store.fi.FiDocumentRequestDocumentStore', {
    extend: 'Ext.data.Store',

    alias: 'store.fiDocumentRequestDocument',

    requires: [
        'Ext.data.proxy.Rest'
    ],

    groupField: 'fiRequestDocumentType',

    autoLoad: false,

    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
            totalProperty: 'totalResults',
            transform: {
                fn: function (data) {
                    if(data && Ext.isArray(data)){
                        Ext.each(data,function (d) {
                            d['fiRequestDocumentType'] = i18n[d.properties.fiRequestDocumentType] || d.properties.fiRequestDocumentType;
                        });
                    }

                    return data;
                },
                scope: this
            }
        }
    }
});