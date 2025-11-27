Ext.define('first.view.attestation.AttestationWindowController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.attestationWindow',

    onSaveClick: function () {
        let me = this;
        let record = me.getViewModel().get('record'),
            store = me.getViewModel().get('store'),
            prefix = me.getViewModel().get('prefix'),
            properties = {},
            propNames = ['fiAttestationStatus', 'fiAttestationType', 'fiAttestationInterviewDate',
                'fiAttestationInterviewStatus', 'fiAttestationComments'];

        for (let i of propNames) {
            properties[prefix + ":" + i] = record[i];
        }

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + record.id,
            jsonData: {
                properties: properties
            },
            success: function (response) {
                store.load();
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                me.getView().destroy();
            }
        });
    },

    changeAttestationType: function (obj, newValue) {
        let record = this.getViewModel().get('record');
        if (newValue === "SHORT") {
            record['fiAttestationInterviewDate'] = null;
            record['fiAttestationInterviewStatus'] = null;
            this.getViewModel().set('record', record);
        }
    },

    onCancelClick: function () {
        this.getView().destroy();
    },

});
