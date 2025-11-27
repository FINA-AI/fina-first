/**
 * Created by oto on 26.04.20.
 */
Ext.define('first.view.repository.sites.PublicSitesGridView', {
    extend: 'first.view.repository.sites.PrivateSitesGridView',

    xtype: 'publicsitesgrid',

    requires: [
        'first.view.repository.sites.PublicSitesViewController'
    ],

    controller: 'publicsitesview'
});