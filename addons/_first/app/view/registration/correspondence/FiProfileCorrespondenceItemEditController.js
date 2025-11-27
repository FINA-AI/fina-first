Ext.define('first.view.registration.correspondence.FiProfileCorrespondenceItemEditController', {
    extend: 'first.view.registration.FiProfileDetailController',
    alias: 'controller.fiProfileCorrespondenceItemEditEcm',


    onCancelButtonClick() {
        this.getView().destroy();
    },

    onSaveButtonClick() {
        this.saveRecord(true);
    },

    onSaveAndSendButtonClick() {
        this.saveRecord(false);
    },

    saveRecord: function (isDraft) {
        let me = this,
            formItems = this.lookupReference('formItems');

        if (formItems.isValid()) {
            let vm = this.getViewModel(),
                theFi = vm.get('theFi'),
                model = vm.get('model'),
                isEdit = vm.get('isEdit'),
                record = vm.get('record'),
                store = vm.get('store');
            me.getView().mask(i18n.pleaseWait);

            let data = {};
            Ext.Object.each(model, function (key, val) {
                data[key.replace('_', ':')] = val;
            });

            data['fina:smsIsDraft'] = isDraft;
            if (!isEdit) {
                data['fina:smsCreationDate'] = new Date();
            }

            delete data.id;

            if (isEdit) {
                record.set(data);
                record.dirty = true;
            } else {
                store.insert(0, data);
            }

            store.sync({
                success: function (response) {
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                },
                callback: function (response) {
                    store.load(function () {
                        me.getView().unmask();
                        me.getView().destroy();
                    });
                }
            });
        }
    }
});