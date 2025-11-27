Ext.define('first.view.registration.reassign.ChangeInspectorController', {
    extend: 'first.view.registration.reassign.ReassignTaskController',
    alias: 'controller.changeInspector',

    init: function () {
        const combo = this.lookupReference("userCombo"),
            store = combo.getStore(),
            vm = this.getViewModel();

        store.getProxy().setUrl(first.config.Config.remoteRestUrl + "ecm/group/" + vm.get('group') + "/members");
        store.getProxy().getReader().setTransform({
            fn: function(data) {
                const notIncluded = [vm.get('lastInspectorId'), vm.get('lastEditorId')];
                data = data ? data.filter(item => !notIncluded.includes(item.id)) : [];
                if (data.length === 0) {
                    Ext.Msg.alert(i18n.information, i18n.changeControllerWindowNoAvailableControllers);
                }
                return data;
            },
            scope: this
        });
        store.load();

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/people/person/' + vm.get('lastInspectorId'),
            success: function (response) {
                let data = JSON.parse(response.responseText);
                vm.set('lastInspector', data);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    onProceedButtonClick: function (component, e) {
        let me = this,
            vm = this.getViewModel(),
            newInspector = vm.get('selectedUser').getData(),
            lastInspector = vm.get('lastInspector') || vm.get('lastInspectorId'),
            confirmationText = '<div>' + i18n.changeControllerWindowLastController + ': ' + this.getDisplayName(lastInspector) + '</div>'
                + '<div>' + i18n.changeControllerWindowNewController + ': ' + this.getDisplayName(newInspector) + '</div><br>'
                + '<div>' + i18n.changeControllerWindowConfirmMsg + '</div>';

        me.getView().mask(i18n.pleaseWait);
        Ext.Msg.confirm(i18n.confirm, confirmationText, function (choice) {
            if (choice === 'yes') {
                Ext.Ajax.request({
                    method: 'POST',
                    url: first.config.Config.remoteRestUrl + 'ecm/fi/' + vm.get('fiRegistryId') + '/changeController/'
                        + vm.get('group') + '/' + vm.get('selectedUser').id,
                    success: function () {
                        Ext.Msg.alert(i18n.information, i18n.changeControllerWindowSuccess);
                        me.fireEvent('onActionTaskStepChange', vm.get('fiRegistryId'));
                    },
                    failure: function (response) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                    },
                    callback: function () {
                        me.getView().unmask();
                        me.getView().destroy();
                    }
                });
            } else {
                me.getView().unmask();
            }
        });
    }

});