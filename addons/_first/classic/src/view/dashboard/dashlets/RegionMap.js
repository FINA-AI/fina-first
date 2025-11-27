Ext.define('first.view.dashboard.dashlets.RegionMap', {
    extend: 'Ext.Container',

    xtype: 'regionMap',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Fit',
        'first.view.dashboard.dashlets.RegionMapController'
    ],

    controller: 'regionMap',

    layout: {
        type: 'fit'
    },

    margin: 5,

    listeners: {
        afterrender: 'afterrender'
    }
});