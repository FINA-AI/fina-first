/**
 * Created by oto on 25.05.20.
 */
Ext.define('first.view.repository.version.VersionsViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.versions',

    requires: [
        'first.config.Config',
        'first.util.DocumentRepositoryHelper'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        let versionGrid = this.lookupReference('versiongridView'),
            selectedDocument = this.getViewModel().get('selectedNode'),
            url = first.config.Config.remoteRestUrl + "ecm/version/" + selectedDocument.get('id');

        versionGrid.getStore().getProxy().setUrl(url);
        versionGrid.getStore().load();
        this.initUploadVersionsCardData();
    },

    initUploadVersionsCardData: function () {
        let me = this,
            vm = me.getViewModel(),
            selectedDocument = me.getViewModel().get('selectedNode'),
            recordVersionBeforeDecimal = Math.floor(parseFloat(selectedDocument.get('properties')['cm:versionLabel'])),
            recordVersionAfterDecimal = parseInt(selectedDocument.get('properties')['cm:versionLabel'].split(".")[1]),
            minorRadioBoxLabel = i18n.updateFileVersionMinorChanges + " <span style='border-radius: 2px; background-color: rgba(0,0,0,0.30); padding: 2px; color: #FFFFFF\'>"
                + (recordVersionBeforeDecimal + ".") + (recordVersionAfterDecimal + 1) + "</span>",
            majorRadioBoxLabel = i18n.updateFileVersionMajorChanges + " <span style='border-radius: 2px; background-color: rgba(0,0,0,0.30); padding: 2px; color: #FFFFFF\'>"
                + (recordVersionBeforeDecimal + 1).toFixed(1) + "</span>";

        vm.set('minorRadioBoxLabel', minorRadioBoxLabel);
        vm.set('majorRadioBoxLabel', majorRadioBoxLabel);
        vm.set('fileName', selectedDocument.get('name'));

    },

    onRefreshVersionsGrid: function () {
        this.doCardNavigation(-1);
        this.lookupReference('versiongridView').getStore().load();

    },

    doCardNavigation: function (incr) {
        var me = this.getView(),
            l = me.getLayout(),
            i = l.activeItem.id.split('card-')[1],
            next = parseInt(i, 10) + incr;

        l.setActiveItem(next);
    },

    onAddNewVersionButtonClick: function (component, e) {
        this.doCardNavigation(1);
    },

    onCloseClick: function (component, e) {

    },

    onRestoreVersion: function (view, rowIndex, colIndex, item, event, record) {
        let me = this,
            versionGrid = me.lookupReference('versiongridView'),
            selectedDocument = me.getViewModel().get('selectedNode'),
            nodeId = selectedDocument.get('id'),
            versionId = record.get('id');
        let postBody = {
            majorVersion: true,
            comment: ''
        };

        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
            if (btn === 'yes') {
                me.getView().mask(i18n.pleaseWait);
                Ext.Ajax.request({
                    url: first.config.Config.remoteRestUrl + 'ecm/version/' + nodeId + '/versions/' + versionId + '/revert',
                    method: 'POST',
                    jsonData: postBody,
                    success: function (response, options) {
                        me.postUpdateVersion(JSON.parse(response.responseText));
                    },
                    callback: function () {
                        me.getView().unmask();
                    }
                });
            }
        });
    },

    onDownloadVersion: function (view, rowIndex, colIndex, item, event, record) {
        let selectedNode = this.getViewModel().get('selectedNode');
        let documentRepositoryHelper = new first.util.DocumentRepositoryHelper();
        documentRepositoryHelper.openDownloadFileVersionUrl(selectedNode.get('id'), record.get('id'));
    },

    onRemoveVersion: function (view, rowIndex, colIndex, item, event, record) {
        let me = this,
            versionGrid = me.lookupReference('versiongridView'),
            selectedDocument = me.getViewModel().get('selectedNode'),
            nodeId = selectedDocument.get('id'),
            versionId = record.get('id');
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function (btn) {
            if (btn === 'yes') {
                me.getView().mask(i18n.pleaseWait);
                Ext.Ajax.request({
                    url: first.config.Config.remoteRestUrl + 'ecm/version/nodes/' + nodeId + '/versions/' + versionId,
                    method: 'DELETE',
                    success: function (response) {
                        me.postUpdateVersion(JSON.parse(response.responseText));
                    },
                    callback: function () {
                        me.getView().unmask();
                    }
                });
            }
        });

    },


    onCancelClick: function (component, e) {
        this.doCardNavigation(-1);
    },

    onFilesSubmit: function (component, e) {
        this.getView().mask(i18n.pleaseWait);

        let me = this,
            record = this.getViewModel().get('selectedNode'),
            fd = new FormData(),
            file = this.lookupReference('fileField').fileInputEl.dom.files[0],
            formView = this.lookupReference('fileForm');

        formView.getValues(true).replace('=', '') === 'versionTypeMajor' ?
            fd.append('majorVersion', true) : fd.append('majorVersion', false);

        fd.append('filedata', file);

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + record.id + '/upload',
            rawData: fd,
            headers: {'Content-Type': null},
            success: function (response) {
                me.postUpdateVersion(JSON.parse(response.responseText));
                me.onCancelClick();
            },

            failure: function () {
                Ext.toast(i18n.configError, i18n.error);
                me.getView().unmask()
            },
            callback: function () {
                me.getView().unmask();
            }
        })
    },

    postUpdateVersion: function (node) {
        let me = this,
            record = this.getViewModel().get('selectedNode'),
            formView = this.lookupReference('fileForm'),
            versionGrid = this.lookupReference('versiongridView');
        record.get('properties')['cm:versionType'] = node.properties['cm:versionType'];
        record.get('properties')['cm:versionLabel'] = node.properties['cm:versionLabel'];
        record.set('fileName', node['name']);

        formView.reset();
        me.fireEvent('refreshGrid', record.get('parentId'));
        versionGrid.getStore().load();
        me.initUploadVersionsCardData();
    }
});