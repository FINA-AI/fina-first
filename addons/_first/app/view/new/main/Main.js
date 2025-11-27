Ext.define('first.view.new.main.Main', {
    extend: 'Ext.container.Viewport',

    xtype: 'app-newmain',

    requires: [
        'first.view.new.dashboard.Dashboard',
        'first.view.new.main.MainController',
        'first.view.new.main.MainModel',
        'Ext.ux.TabReorderer',
        'Ext.ux.TabCloseMenu',

    ],

    controller: 'newmain',
    viewModel: 'newmain',

    layout: 'border',

    items: [{
        xtype: 'tabpanel',
        region: 'center',
        plugins: ['tabreorderer', 'tabclosemenu'],
        flex: 1,
        reference: 'main',
        listeners: {
            tabchange: 'onTabChange'
        },
        items: []
    }]

});
