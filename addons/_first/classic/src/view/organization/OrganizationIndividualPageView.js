Ext.define('first.view.organization.OrganizationIndividualPageView', {
    extend: 'Ext.panel.Panel',

    xtype: 'organizationIndividualPage',

    title: i18n.menuOrganizationIndividualRegistry,

    requires: [
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.resizer.Splitter',
        'first.store.blacklist.BlacklistDocumentStore',
        'first.store.organization.OrganizationDocumentStore',
        'first.view.blacklist.BlacklistDocumentController',
        'first.view.blacklist.BlacklistDocumentModel',
        'first.view.common.DocumentsUploadView',
        'first.view.organization.OrganizationDocumentController',
        'first.view.organization.OrganizationIndividualLicenseCertificateView',
        'first.view.organization.OrganizationIndividualPageController',
        'first.view.organization.OrganizationIndividualPageModel',
        'first.view.organization.OrganizationIndividualView'
    ],

    controller: 'organizationIndividualPage',

    viewModel: 'organizationIndividualPage',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'organizationIndividual',
                    collapsible: false,
                    flex: 3
                },
                {
                    flex: 0,
                    xtype: 'splitter',
                    collapseTarget: 'prev',
                    width: '2px',
                    border: '4',
                    style: {
                        color: 'rgb(236, 236, 236)',
                        borderStyle: 'solid'
                    }
                },
                {
                    flex: 1.5,
                    xtype: 'documentsUpload',
                    collapsible: true,
                    animCollapse: false,
                    collapseDirection: 'left',
                    controller: 'organizationDocument',
                    header: {
                        titlePosition: 1
                    },
                    store: {
                        type: 'organizationDocument',
                    },
                    viewModel: {}
                }
            ]
        }, {
            flex: 0,
            xtype: 'splitter',
            collapseTarget: 'next',
            width: '2px',
            border: '4',
            style: {
                color: 'rgb(236, 236, 236)',
                borderStyle: 'solid'
            }
        }, {
            flex: 1,
            xtype: 'organizationIndividualLicenseCertificate',
            animCollapse: false,
            header: {
                titlePosition: 1
            },
            collapsible: true,
            collapseDirection: 'bottom'
        }]
});