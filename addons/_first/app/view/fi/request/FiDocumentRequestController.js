Ext.define('first.view.fi.request.FiDocumentRequestController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiDocumentRequest',

    init: function () {

    },

    onAddClick: function (comp, e, eOpts) {
        let me = this;
        let viewModel = new first.view.fi.request.FiDocumentRequestEditModel({
            data: {
                isEdit: false,
                fiDocumentRequest: Ext.create('first.model.fi.FiDocumentRequestModel', {
                    submitted: false
                }),
                store: me.getView().getStore()
            }
        });

        this.showEditWindow(i18n.fiDocumentRequestAddNewTitle, viewModel, 'x-fa fa-plus-circle');
    },

    onEditClick: function (grid, r, c, btn, event, record) {
        let me = this;
        let viewModel = new first.view.fi.request.FiDocumentRequestEditModel({
            data: {
                isEdit: true,
                fiDocumentRequest: record,
                store: me.getView().getStore()
            }
        });

        this.showEditWindow(i18n.fiDocumentRequestEditSelectedTitle, viewModel, 'x-fa fa-edit');
    },

    showEditWindow: function (title, viewModel, icon) {
        let window = Ext.create('first.view.fi.request.FiDocumentRequestEditView', {
            iconCls: icon,
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
                    success: function () {
                        me.afterRender();
                    },
                    failure: function (batch) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                        store.rejectChanges();
                    }
                });
            }
        });
    },

    isEditActionDisabled: function () {
        return !this.getViewModel().get('hasFiDocumentRequestAmendPermission');
    },

    isDeleteActionDisabled: function () {
        return !this.getViewModel().get('hasFiDocumentRequestDeletePermission');
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().getStore().reload();
    },

    onSelectFiDocumentRequestItem: function (component, record) {
        this.fireEvent('reloadFiDocumentRequestDocuments', record.id);
    },

    afterRender: function () {
        let me = this;
        this.getView().getStore().load(function (records) {
            if (records && records.length > 0) {
                me.getView().getSelectionModel().select(0);
            } else {
                me.fireEvent('reloadFiDocumentRequestDocuments', null);
            }
        });
    }

});