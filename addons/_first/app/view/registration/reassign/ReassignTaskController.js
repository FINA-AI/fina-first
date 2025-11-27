/**
 * Created by meryc on 12.05.2020.
 */
Ext.define('first.view.registration.reassign.ReassignTaskController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reassignTask',

    requires: [
        'first.config.Config',
        'first.util.ErrorHandlerUtil'
    ],


    init: function () {
        this.getViewModel().set('selectedUser', null);
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onCancelButtonClick: function (component, e) {
        this.getView().destroy();
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onProceedButtonClick: function (component, e) {
        let record = this.getView().record,
            newAssignee = this.getViewModel().get('selectedUser'),
            confirmationText = '<div>' + i18n.currentAssignee + ': ' + this.getDisplayName(record.get('lastEditor')) + '</div>'
                + '<div>' + i18n.newAssignee + ': ' + newAssignee.get('displayName') + '</div>'
                + '<div>' + i18n.confirmReassign + '</div>',
            processId = record.get('lastProcessId'),
            data = {
                login: newAssignee.id
            },
            me = this;

        this.getView().mask(i18n.pleaseWait);
        Ext.Msg.confirm(i18n.confirm, confirmationText, function (choice) {
            if (choice === 'yes') {
                Ext.Ajax.request({
                    method: 'PUT',
                    url: first.config.Config.remoteRestUrl + 'ecm/workflow/process/' + processId + '/assignee',
                    jsonData: data,
                    success: function () {
                        me.fireEvent('reloadFiRegistryStore');
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
    },

    getDisplayName(person) {
        let firstName = person['firstName'],
            lastName = person['lastName'],
            login = person['id'];

        return firstName ? firstName + (lastName ? ' ' + lastName : '') + ' (' + login + ')' : login;
    }
});