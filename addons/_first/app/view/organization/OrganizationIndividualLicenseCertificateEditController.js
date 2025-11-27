Ext.define('first.view.organization.OrganizationIndividualLicenseCertificateEditController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.organizationIndividualLicenseCertificateEdit',

    init: function () {
        this.getViewModel().get('store').addListener('write', this.onFinishStoreWrite, this);
    },

    onCancelBtnClick: function () {
        this.getView().close();
    },

    onSaveBtnClick: function (component, e) {
        let organizationIndividualLicenseCertificate = this.getViewModel().get('organizationIndividualLicenseCertificate'),
            isEdit = this.getViewModel().get('isEdit'),
            store = this.getViewModel().get('store'),
            me = this,
            licenseType = me.lookupReference('LicenseTypeCombo').getSelection();

        licenseType.set('registrationDate', null);
        organizationIndividualLicenseCertificate.set('type', licenseType.data);
        if (organizationIndividualLicenseCertificate.isDirty()) {
            me.getView().mask(i18n.pleaseWait);
        }

        store.add(organizationIndividualLicenseCertificate);
        store.sync({
            success: function (batch, opts) {
                if (!isEdit) {
                    store.load();
                }
                me.getView().unmask();
                me.getView().close();
            },
            failure: function (batch, opts) {
                first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.fiTypeSaveError, batch);
                if (!isEdit) {
                    store.remove(organizationIndividualLicenseCertificate);
                }
                me.getView().unmask();
                store.rejectChanges();
            }
        });
    },

    onFinishStoreWrite: function (aStore, aOperation) {
        if (aOperation.getResponse().responseText) {
            this.getViewModel().set('licenseCertificateFolderId', JSON.parse(aOperation.getResponse().responseText).id);
        }
    },

    beforeClose: function (win) {
        this.getViewModel().get('store').rejectChanges();
    }

});