Ext.define('first.view.fi.request.FiDocumentRequestPageView', {
    extend: 'Ext.panel.Panel',

    xtype: 'fiDocumentRequestPage',

    title: i18n.menuDocumentRequestRegistry,

    requires: [
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.resizer.Splitter',
        'first.view.fi.request.FiDocumentRequestPageModel',
        'first.view.fi.request.FiDocumentRequestPageController',
        'first.view.fi.request.FiDocumentRequestView',
        'first.view.fi.request.FiDocumentRequestDocumentView'
    ],

    controller: 'fiDocumentRequestPage',

    viewModel: 'fiDocumentRequestPage',

    layout: 'fit',

    items: [{
        layout: {
            type: 'hbox',
            align: 'stretch'
        },

        defaults: {
            collapsible: true
        },

        items: [{
            flex: 3,
            xtype: 'fiDocumentRequest',
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
            xtype: 'fiDocumentRequestDocument',
            collapsible: true,
            collapseDirection: 'left',
            animCollapse: false,
            header:{
                titlePosition: 1
            }
        }]
    }]
});