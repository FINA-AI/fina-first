Ext.define('first.view.organization.OrganizationIndividualController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.organizationIndividual',

    init: function () {

    },

    onAddOrganizationClick: function (comp, e, eOpts) {
        let me = this;
        let viewModel = new first.view.organization.OrganizationIndividualEditModel({
            data: {
                isEdit: false,
                organizationIndividual: Ext.create('first.model.organization.OrganizationIndividualModel', {
                    type: 'ORGANIZATION'
                }),
                store: me.getView().getStore(),
                isOrganization: true
            }
        });

        this.showEditWindow(i18n.organizationIndividualAddNewOrganizationWindowTitle, viewModel);
    },

    onAddIndividualClick: function (comp, e, eOpts) {
        let me = this;
        let viewModel = new first.view.organization.OrganizationIndividualEditModel({
            data: {
                isEdit: false,
                organizationIndividual: Ext.create('first.model.organization.OrganizationIndividualModel', {
                    type: 'INDIVIDUAL'
                }),
                store: me.getView().getStore(),
                isOrganization: false
            }
        });

        this.showEditWindow(i18n.organizationIndividualAddNewIndividualWindowTitle, viewModel);
    },

    onEditClick: function (grid, r, c, btn, event, record) {
        let me = this,
            isOrganization = record.get('type') === 'ORGANIZATION';
        let viewModel = new first.view.organization.OrganizationIndividualEditModel({
            data: {
                isEdit: true,
                organizationIndividual: record,
                store: me.getView().getStore(),
                isOrganization: isOrganization
            }
        });

        this.showEditWindow(isOrganization ? i18n.organizationIndividualEditOrganizationWindowTitle : i18n.organizationIndividualEditIndividualWindowTitle, viewModel);
    },

    showEditWindow: function (title, viewModel) {
        let window = Ext.create('first.view.organization.OrganizationIndividualEditView', {
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

    isEditActionDisabled: function () {
        return !this.getViewModel().get('hasOrganizationIndividualAmendPermission');
    },

    isDeleteActionDisabled: function () {
        return !this.getViewModel().get('hasOrganizationIndividualDeletePermission');
    },

    onRefreshClick: function (comp, e, eOpts) {
        let store = this.getView().getStore();
        store.getProxy().setExtraParams({'query': null});
        store.reload();
    },

    onSelectOrganizationIndividualItem: function (component, record) {
        this.fireEvent('reloadOrganizationIndividualLicenseCertificates', record.id);
        this.fireEvent('reloadOrganizationDocuments', record.id);
    },

    afterRender: function () {
        let me = this;
        this.getView().getStore().load(function (records) {
            if (records && records.length > 0) {
                me.getView().getSelectionModel().select(0);
            }
        });
    },

    onAfterExportButtonRender: function (component) {
        let menu = component.getMenu(),
            me = this;
        if (menu && menu.items && menu.items.items) {
            Ext.each(menu.items.items, function (item) {
                menu.remove(item);
            });
        }

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + "ecm/fi/report/templates?tags=OrganizationsAndIndividualsRegistryReport",
            success: function (response) {
                let data = JSON.parse(response.responseText);
                me.renderExportMenuData(component, data);
            }
        });
    },

    renderExportMenuData: function (component, data) {
        let menu = component.getMenu();

        if (data && data.length > 0) {
            Ext.each(data, function (record) {
                let fileName = record['name'];
                let text = fileName.substring(0, fileName.lastIndexOf('.')) ;

                let menuItem = {
                    text: text,
                    tooltip: text,
                    fileName: fileName,
                    nodeId: record['id'],
                    handler: 'onExportButtonClick'
                };
                menu.add(menuItem);
            });
            component.setDisabled(false)
        } else {
            first.util.ErrorHandlerUtil.showReportError('Individuals Registry');
        }
    },

    onExportButtonClick: function (item) {
        const store = this.getView().getStore(),
            query = store.getProxy().getExtraParams()['query'];

        let filter = [];
        for (let i of store.filters.items) {
            filter.push(i.serialize());
        }

        let url = first.config.Config.remoteRestUrl + 'ecm/fi/export/' + first.config.Config.getLanguageCode()
            + '?templateId=' + item.nodeId + '&fileName=' + encodeURIComponent(item.fileName)
            + (query ? "&reportQuery=" + encodeURIComponent(query) : "")
            + (filter && filter.length > 0 ? "&reportFilter=" + encodeURIComponent(JSON.stringify(filter)) : "");

        window.open(url, '_blank');
    },

    onSearch: function (textfield) {
        let store = this.getView().getStore();
        store.getProxy().setExtraParams({'query': textfield.value});
        store.getProxy().setHeaders({'Accept-Language': '*'});
        store.load({page: 1});
    }

});