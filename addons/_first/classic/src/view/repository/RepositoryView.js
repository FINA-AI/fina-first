/**
 * Created by oto on 5/30/19.
 */
Ext.define('first.view.repository.RepositoryView', {
    extend: 'Ext.panel.Panel',

    xtype: 'repository',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.list.Tree',
        'Ext.panel.Panel',
        'first.store.repository.RepositoryNavigationTree',
        'first.view.repository.RepositoryController',
        'first.view.repository.RepositoryNavigationView'
    ],

    controller: 'repository',
    layout: 'fit',
    border: true,

    title: i18n.menuDocumentManagement,

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            handler: function () {
                Ext.History.back();
            },
            iconCls: 'x-fa fa-arrow-left',
            cls: 'firstSystemButtons'
        }, {
            handler: function () {
                Ext.History.forward();
            },
            iconCls: 'x-fa fa-arrow-right',
            cls: 'firstSystemButtons'
        }],
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "repository"}'
        }
    },

    items: [{
        xtype: 'repositorynavigation',
        flex: 1
    }]

});
