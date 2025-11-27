Ext.define('first.view.page.FirstIsNotAvailablePageView', {
    extend: 'Ext.container.Viewport',

    xtype: 'firstIsNotAvailablePage',

    requires: [
        'Ext.layout.container.VBox'
    ],

    anchor: '100% -1',

    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'center'
    },

    items: [{
        xtype: 'box',
        cls: 'first-is-not-available-page-container',
        html: '<div class=\'fa-outer-class\'><span class=\'x-fa fa-plug\'></span></div><h1>' + i18n.firstIsNotAvailableTitle + '</h1><span class=\'blank-page-text\'>' + i18n.appName + '</span>'
    }]

});