Ext.define('first.view.blacklist.BlacklistPage', {
    extend: 'Ext.panel.Panel',

    xtype: 'blacklistPage',

    title: i18n.menuBlacklist,

    requires: [
        'Ext.layout.container.HBox',
        'Ext.resizer.Splitter',
        'first.view.blacklist.BlacklistPageModel',
        'first.view.blacklist.BlacklistPageController',
        'first.view.blacklist.BlacklistView',
    ],

    controller: 'blacklistPage',

    viewModel: 'blacklistPage',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    defaults: {
        collapsible: true
    },
    items: [

        {
            flex: 3,
            xtype: 'blacklists',
            collapsible: false,
        }, {
            flex: 0,
            xtype: 'splitter',
            collapseTarget: 'prev',
            width: '2px',
            border: '4',
            style: {
                color: 'rgb(236, 236, 236)',
                borderStyle: 'solid'
            }
        }, {
            flex: 1.5,
            xtype: 'documentsUpload',
            collapsible: true,
            animCollapse: false,
            collapseDirection: 'left',
            controller: 'blacklistDocument',
            header:{
                titlePosition: 1
            },
            store: {
                type: 'blacklistDocument',
            },
            viewModel: {
                type: 'blacklistDocument'
            }
        }]

});