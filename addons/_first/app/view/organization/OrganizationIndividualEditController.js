Ext.define('first.view.organization.OrganizationIndividualEditController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.organizationIndividualEdit',

    init: function () {

    },

    onCancelBtnClick: function () {
        this.getView().close();
    },

    onSaveBtnClick: function (component, e) {
        let organizationIndividual = this.getViewModel().get('organizationIndividual'),
            isEdit = this.getViewModel().get('isEdit'),
            store = this.getViewModel().get('store'),
            me = this;

        if (organizationIndividual.isDirty()) {
            me.getView().mask(i18n.pleaseWait);
        }

        store.add(organizationIndividual);
        store.sync({
            success: function (batch, opts) {
                if (!isEdit) {
                    store.load();
                }
                me.getView().close();
            },
            failure: function (batch, opts) {
                first.util.ErrorHandlerUtil.showErrorWindow(null, 'Error occured while saving organization / individual item.', batch);
                if (!isEdit) {
                    store.remove(organizationIndividual);
                }
                store.rejectChanges();
                me.getView().unmask();
            }
        });
    },

    beforeClose: function (win) {
        this.getViewModel().get('store').rejectChanges();
    },

    onFiRegistrySelect: function (selectionModel, record) {
        let branchCombo = this.lookupReference('fiRegistryBranchReference');
        branchCombo.getStore().getProxy().setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + selectionModel.value + '/children?relativePath=Branches');
        branchCombo.getStore().load();
        this.getViewModel().set('organizationIndividual.branchId', null);
    },

    onFiRegistryBranchAfterRender: function (cmp) {
        let registryId = this.getViewModel().get('organizationIndividual.registryId');
        if (registryId) {
            cmp.getStore().getProxy().setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + registryId + '/children?relativePath=Branches');
            cmp.getStore().load();
        }
    },

    onPositionComboBlur: function (cmp, e, eOpts) {
        if (!cmp.value || cmp.value === '') {
            this.getViewModel().set('organizationIndividual.assignmentDate', null);
            this.getViewModel().set('organizationIndividual.documentNumber', null);
            this.getViewModel().set('organizationIndividual.attestationStatus', null);
        }
    },

    onPositionSelect: function (selectionModel, record) {
        this.getViewModel().set('organizationIndividual.attestationStatus', 'underReview');
    }

});