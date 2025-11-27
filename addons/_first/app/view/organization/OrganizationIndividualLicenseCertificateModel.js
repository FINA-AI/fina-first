Ext.define('first.view.organization.OrganizationIndividualLicenseCertificateModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.organizationIndividualLicenseCertificate',

    formulas: {
        hasOrganizationIndividualAmendPermission: function (get) {
            let permissions = first.config.Config.conf['permissions'];
            return (permissions && Ext.Array.contains(permissions, 'net.fina.first.organization.individual.registry.amend'));
        },

        hasOrganizationIndividualDeletePermission: function (get) {
            let permissions = first.config.Config.conf['permissions'];
            return (permissions && Ext.Array.contains(permissions, 'net.fina.first.organization.individual.registry.delete'));
        }
    }

});