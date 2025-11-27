Ext.define('first.view.repository.version.UpdateFileViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.updateFileViewController',

    init: function () {
        let vm = this.getViewModel(),
            record = this.getViewModel().get('selectedNode'),
            recordVersionBeforeDecimal = Math.floor(parseFloat(record.get('properties')['cm:versionLabel'])),
            recordVersionAfterDecimal = parseInt(record.get('properties')['cm:versionLabel'].split(".")[1]),
            minorRadioBoxLabel = i18n.updateFileVersionMinorChanges + " <span style='border-radius: 2px; background-color: rgba(0,0,0,0.30); padding: 2px; color: #FFFFFF\'>"
                + (recordVersionBeforeDecimal + ".") + (recordVersionAfterDecimal + 1) + "</span>",
            majorRadioBoxLabel = i18n.updateFileVersionMajorChanges + " <span style='border-radius: 2px; background-color: rgba(0,0,0,0.30); padding: 2px; color: #FFFFFF\'>"
                + (recordVersionBeforeDecimal + 1).toFixed(1) + "</span>";

        vm.set('minorRadioBoxLabel', minorRadioBoxLabel);
        vm.set('majorRadioBoxLabel', majorRadioBoxLabel);
        vm.set('fileName', record.get('name'));
    },

    onCancelClick: function (component, e) {
        this.getView().destroy();
    },

    onFilesSubmit: function (component, e) {
        this.getView().mask(i18n.pleaseWait);

        let me = this,
            record = this.getViewModel().get('selectedNode'),
            fd = new FormData(),
            file = this.lookupReference('fileField').fileInputEl.dom.files[0];

        this.lookupReference('fileForm').getValues(true).replace('=', '') === 'versionTypeMajor' ?
            fd.append('majorVersion', true) : fd.append('majorVersion', false);

        fd.append('filedata', file);

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + record.id + '/upload',
            rawData: fd,
            headers: {'Content-Type': null},
            success: function () {
                me.fireEvent('refreshGrid', record.get('parentId'));
                me.onCancelClick();
            },

            failure: function () {
                Ext.toast(i18n.configError, i18n.error);
                me.getView().unmask()
            }
        })
    }
});