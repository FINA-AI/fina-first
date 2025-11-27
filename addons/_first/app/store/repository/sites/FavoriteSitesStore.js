/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.store.repository.sites.FavoriteSitesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.favoritesites',

    requires: [
        'Ext.data.proxy.Rest',
        'first.config.Config',
        'first.model.repository.NodeModel'
    ],


    model: 'first.model.repository.NodeModel',

    autoLoad: true,

    proxy: {
        type: 'rest',
        enablePaging: true,
        url: first.config.Config.remoteRestUrl + "ecm/sites/favorites",
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
                            record.modifiedAt = transform(record.modifiedAt);
                            record.createdAt = transform(record.createdAt);
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