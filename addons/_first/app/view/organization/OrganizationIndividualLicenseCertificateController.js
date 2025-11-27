Ext.define('first.view.organization.OrganizationIndividualLicenseCertificateController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.organizationIndividualLicenseCertificate',

    listen: {
        controller: {
            'organizationIndividual': {
                reloadOrganizationIndividualLicenseCertificates: 'load'
            }
        }
    },

    init: function () {
        this.getViewModel().set('enableTbarItems', false);
    },

    onAddClick: function () {
        let me = this;
        let viewModel = new first.view.organization.OrganizationIndividualLicenseCertificateEditModel({
            data: {
                isEdit: false,
                organizationIndividualLicenseCertificate: Ext.create('first.model.organization.OrganizationIndividualLicenseCertificateModel'),
                store: me.getView().getStore()
            }
        });

        this.showEditWindow(i18n.organizationIndividualLicenseCertificateAddNewLicenseCertificateWindowTitle, viewModel);
    },

    onEditClick: function (grid, r, c, btn, event, record) {
        let me = this;
        let viewModel = new first.view.organization.OrganizationIndividualLicenseCertificateEditModel({
            data: {
                isEdit: true,
                organizationIndividualLicenseCertificate: record,
                store: me.getView().getStore()
            }
        });

        this.showEditWindow(i18n.organizationIndividualLicenseCertificateEditLicenseCertificateWindowTitle, viewModel);
    },

    showEditWindow: function (title, viewModel) {
        let window = Ext.create('first.view.organization.OrganizationIndividualLicenseCertificateEditView', {
            title: title,
            viewModel: viewModel
        });
        window.show();
    },

    onDeleteClick: function (grid, r, c, btn, event, record) {
        let me = this;

        Ext.Msg.confirm(i18n.delete, i18n.deleteItemGeneralWarningMessage, function (button) {
            if (button === 'yes') {
                let store = me.getView().getStore();
                store.remove(record);
                store.sync({
                    failure: function (batch) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                        store.rejectChanges();
                    }
                });
            }
        });
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().getStore().reload();
    },

    isEditActionDisabled: function () {
        return !this.getViewModel().get('hasOrganizationIndividualAmendPermission');
    },

    isDeleteActionDisabled: function () {
        return !this.getViewModel().get('hasOrganizationIndividualDeletePermission');
    },

    load: function (organizationIndividualItemId) {
        if (organizationIndividualItemId) {
            this.getViewModel().set('selectedOrganizationIndividualItemId', organizationIndividualItemId);
            this.getViewModel().set('enableTbarItems', true);

            let store = this.getView().getStore();
            store.proxy.setUrl(first.config.Config.remoteRestUrl + 'organizationIndividual/licenseCertificates/' + organizationIndividualItemId);
            store.load();
        }

    },

    onSearch: function (textfield) {
        let store = this.getView().getStore();
        store.getProxy().setExtraParams({'query': textfield.value});
        store.getProxy().setHeaders({'Accept-Language': '*'});
        store.load({page: 1});
    }

});