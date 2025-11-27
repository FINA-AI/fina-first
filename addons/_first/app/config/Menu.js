Ext.define('first.config.Menu', {

    statics: {
        menuItem: {
            home: {
                id: 'home',
                text: i18n.dashboard,
                leaf: true,
                iconCls: 'x-fa fa-tachometer-alt'
            },
            search: {
                permission: 'net.fina.first.search.review',
                id: 'search',
                text: i18n.Search,
                leaf: true,
                iconCls: 'x-fa fa-search'
            },
            fis: {
                permission: 'net.fina.first.registry.review',
                id: 'fis',
                text: i18n.menuFiRegistry,
                leaf: true,
                iconCls: 'x-fa fa-home'
            },
            attestations: {
                permission: 'net.fina.first.attestation.review',
                id: 'attestations',
                text: i18n.attestation,
                leaf: true,
                iconCls: 'x-fa fa-graduation-cap'
            },
            blacklistPage: {
                permission: 'net.fina.first.blacklist.review',
                id: 'blacklistPage',
                text: i18n.menuBlacklist,
                leaf: true,
                iconCls: 'x-fa fa-user-secret'
            },
            taskView: {
                permission: 'net.fina.first.task.review',
                id: 'taskView',
                text: i18n.menuTaskManager,
                leaf: true,
                iconCls: 'x-fa fa-tasks'
            },
            repository: {
                permission: 'net.fina.first.document.review',
                id: 'repository',
                text: i18n.menuDocumentManagement,
                leaf: true,
                iconCls: 'x-fa fa-folder'
            },
            organizationIndividualPage: {
                permission: 'net.fina.first.organization.individual.registry.review',
                id: 'organizationIndividualPage',
                text: i18n.menuOrganizationIndividualRegistry,
                leaf: true,
                iconCls: 'x-fa fa-book'
            },
            fiDocumentRequestPage: {
                permission: 'net.fina.first.fi.document.request.review',
                id: 'fiDocumentRequestPage',
                text: i18n.menuDocumentRequestRegistry,
                leaf: true,
                iconCls: 'x-fa fa-file-invoice'
            },
            tags: {
                permission: 'net.fina.tag.review',
                id: 'tags',
                text: i18n.menuTags,
                leaf: true,
                iconCls: 'x-fa fa-tags'
            },
            questionnaire: {
                permission: 'net.fina.first.config.review',
                id: 'questionnaire',
                text: i18n.menuConfiguration,
                leaf: true,
                iconCls: 'x-fa fa-wrench'
            },
            dashboardUserManual: {
                id: 'dashboardUserManual',
                text: i18n.menuUserManual,
                leaf: true,
                iconCls: 'x-fa fa-address-book'
            },
            mfoDashboard: {
                id: 'mfoDashboard',
                text: i18n.mfoDashboard,
                leaf: true,
                fiType: 'MFO'
            },
            fexDashboard: {
                id: 'fexDashboard',
                text: i18n.fexDashboard,
                leaf: true,
                fiType: 'FEX'
            },
            leDashboard: {
                id: 'leDashboard',
                text: i18n.leDashboard,
                leaf: true,
                fiType: 'LE'
            }
        }
    }

});