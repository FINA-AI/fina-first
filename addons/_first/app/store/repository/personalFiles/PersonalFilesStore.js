Ext.define('first.store.repository.personalFiles.PersonalFilesStore', {
    extend: 'Ext.data.Store',

    alias: 'store.personalFilesStore',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.repository.NodeModel'
    ],

    model: 'first.model.repository.NodeModel',

    autoLoad: true,

    remoteSort: true,
    sorters: [
        {
            property: 'name',
            direction: 'ASC'
        }
    ],

    pageSize: 20,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/node/-root-/children",
        simpleSortMode: true,
        directionParam: 'orderBy',
        sortParam: 'orderBy',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalResults'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    },

    listeners: {
        beforeload: function (store) {
            store.proxy.setUrl(first.config.Config.remoteRestUrl + "ecm/node/" + first.config.Config.conf.properties.userRootNode.id + "/children");
        }
    }

});