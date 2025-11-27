Ext.define('first.view.attestation.AttestationPageView', {
    extend: 'Ext.panel.Panel',

    xtype: 'attestations',

    title: i18n.attestation,

    requires: [
        'Ext.layout.container.HBox',
        'Ext.resizer.Splitter',
        'first.view.attestation.AttestationList',
    ],


    viewModel: 'attestation',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    defaults: {
        collapsible: true
    },
    items: [{
            flex: 3,
            xtype: 'attestationsList',
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
            controller: 'attestationDocuments',
            collapsible: true,
            collapseDirection: 'left',
            animCollapse: false,
            header:{
                titlePosition: 1
            },
            viewModel: {
                type: 'attestation'
            },
            store: {
                type: 'attestationDocument',
            },

    }]
});