/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.view.repository.sites.FavoritesSitesGridView', {
    extend: 'first.view.repository.sites.PrivateSitesGridView',

    xtype: 'favoritessitesgrid',

    requires: [
        'first.store.repository.sites.FavoriteSitesStore',
        'first.view.repository.sites.FavoriteSitesController'
    ],

    controller: 'favoritesites',

    store: {
        type: 'favoritesites'
    }
});
