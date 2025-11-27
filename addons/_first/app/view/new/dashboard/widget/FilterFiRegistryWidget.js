Ext.define('first.view.new.dashboard.widget.FilterFiRegistryWidget', {
    extend: 'Ext.panel.Panel',

    xtype: 'filterFiRegistryWidget',

    requires: [
        'Ext.panel.Panel',
        'first.view.new.dashboard.widget.FilterFiRegistryWidgetController',
        'first.view.new.dashboard.widget.FilterFiRegistryWidgetModel'
    ],

    viewModel: 'filterFiRegistryWidget',

    controller: 'filterFiRegistryWidget',

    cls: 'fi-registry-filter-item',

    containerColor: '',


    data: {
        amount: 0,
        title: '',
        icon: '',
        filter: null,
        dependsOnFiType: false
    },

    tpl: '<div><span>{title}</span><div>' +
        '<div><h2>{amount}</h2><div>' +
        '<a class="fi-registry-filter">'+i18n.dashboardWidgetViewButtonTitle+'></a>',

    listeners: {
        element: 'el',
        delegate: 'a.fi-registry-filter',
        click: 'fiRegistryFilterHandler'
    },

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            cls: me.config.containerColor
        });

        me.callParent(arguments);
    }

});