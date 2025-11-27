Ext.define('first.view.repository.fileUpdate.FileUpdateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fileUpdateController',

    requires: [
        'Ext.data.StoreManager',
        'first.config.Config'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        this.getViewModel().set('isSubmitting', false);
        this.getViewModel().set('isAlreadySelected', false);
    },

    onCancelClick: function (component, e) {
        this.getView().destroy();
    },

    onFilesSubmit: function (component, e) {
        let store = this.getView().down('grid').getStore();
        this.postFile(store);
    },

    postFile: function (store) {
        let me = this,
            nodeId = this.getViewModel().get('nodeId'),
            isNewFile = this.getViewModel().get('isNewFile'),
            relativePath = this.getViewModel().get('relativePath'),
            progressBar = Ext.getCmp('fileUploadProgressBar'),
            itemCount = store.data.items.length;

        if (itemCount !== 1) {
            Ext.toast(i18n.fileUpdateWarningSelectSingleFile, i18n.error);
        } else {
            progressBar.setVisible(true);

            let record = store.getData().getAt(0);
            if (record.get('status') === 'READY' || record.get('status') === 'ERROR') {
                me.getViewModel().set('isSubmitting', true);

                let progress = {fileCount: 0},
                    fd = new FormData();

                fd.append('filedata', record.get('file'));
                fd.append('autoRename', "true");

                if (relativePath) {
                    fd.append('relativePath', relativePath);
                }

                record.set('status', 'PENDING');

                if (!isNewFile) {
                    me.uploadFile(fd, nodeId, store, record, progress, progressBar);
                } else {
                    me.uploadNewFile(fd, nodeId, store, record, progress, progressBar);
                }
            }
        }
    },

    updateProgress: function (record, nodeId, progress, progressBar, status) {
        let me = this;
        record.set('status', status ? 'UPLOADED' : 'ERROR');
        record.commit();

        progressBar.updateText(i18n.fileUpdateCompleted);
        progressBar.updateProgress(1);

        if (progress.fileCount === 1) {
            me.fireEvent('refreshGrid', nodeId);
            me.getViewModel().set('isSubmitting', false);

            let uploadFinishCallbackEventFunctionName = me.getViewModel().get('uploadFinishCallbackEventFunctionName');
            if (uploadFinishCallbackEventFunctionName) {
                me.fireEvent(uploadFinishCallbackEventFunctionName);
                me.onCancelClick();
            }
        }
    },

    uploadFile: function (fd, nodeId, store, record, progress, progressBar) {
        let me = this;
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + nodeId + '/upload',
            rawData: fd,
            headers: {'Content-Type': null},
            callback: function (options, success, response) {
                progress.fileCount++;
                me.updateProgress(record, nodeId, progress, progressBar, success);
            }
        })
    },

    uploadNewFile: function (fd, nodeId, store, record, progress, progressBar) {
        let me = this;
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + nodeId + '/upload/' + record.get('name'),
            rawData: fd,
            headers: {'Content-Type': null},
            callback: function (options, success, response) {
                progress.fileCount++;
                me.updateProgress(record, nodeId, progress, progressBar, success);
            }
        })
    },

    onFilesChoose: function (fileField, value) {
        let files = fileField.fileInputEl.dom.files,
            store = this.getView().down('grid').getStore();

        Ext.Array.forEach(Ext.Array.from(files), function (file) {
            store.add({
                file: file,
                name: file.name,
                size: file.size,
                status: 'READY'
            });
        });

        this.getViewModel().set('isAlreadySelected', true);
    },

    onRemoveFileClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        let store = this.getView().down('grid').getStore();
        store.remove(record);

        this.getViewModel().set('isAlreadySelected', false);
    }
});