/**
 * Created by oto on 6/4/19.
 */
Ext.define('first.view.repository.fileUpload.FileUploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fileUploadController',

    requires: [
        'Ext.data.StoreManager',
        'first.config.Config',
        'first.util.ErrorHandlerUtil'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },

    onCancelClick: function (component, e) {
        this.getView().up('window').destroy();
    },


    onFilesSubmit: function (component, e) {

        let store = this.getView().up().down('grid').getStore();
        this.postFiles(store)

    },


    noop: function (e) {
        e.stopEvent();
    },

    addDropZone: function (e) {
        if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
            return;
        }

        e.stopEvent();

        this.getView().addCls('drag-over');
    },

    removeDropZone: function (e) {
        let el = e.getTarget(),
            thisEl = this.getView().getEl();

        e.stopEvent();


        if (el === thisEl.dom) {
            this.getView().removeCls('drag-over');
            return;
        }

        while (el !== thisEl.dom && el && el.parentNode) {
            el = el.parentNode;
        }

        if (el !== thisEl.dom) {
            this.getView().removeCls('drag-over');
        }

    },

    drop: function (e) {
        e.stopEvent();
        let store = this.getView().up().down('grid').getStore();
        Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {
            let record = store.findRecord('name', file.name);
            if (!record) {

                store.add({
                    file: file,
                    name: file.name,
                    size: file.size,
                    status: 'READY'

                });
            }
        });
        this.getView().removeCls('drag-over');
    },

    postFiles: function (store) {
        let me = this;
        let nodeId = this.getViewModel().get('folderNodeId'),
            relativePath = this.getViewModel().get('relativePath');

        let progressBar = Ext.getCmp('fileUploadProgressBar');
        progressBar.setVisible(true);

        let filesToBeSubmitted = [];

        for (let i = 0; i < store.data.items.length; i++) {
            let record = store.getData().getAt(i);
            if (record.get('status') === 'READY' || record.get('status') === 'ERROR') {
                filesToBeSubmitted.push(record);
            }
        }

        let progress = {fileCount: 0};

        for (let i = 0; i < filesToBeSubmitted.length; i++) {
            me.getViewModel().set('isSubmitting', true);
            let fd = new FormData();
            let record = filesToBeSubmitted[i];
            fd.append('filedata', record.get('file'));
            fd.append('autoRename', "true");

            if (relativePath) {
                fd.append('relativePath', relativePath);
            }

            let extraProps = me.getViewModel().get('extraProps');
            if (extraProps) {
                for (let prop in extraProps) {
                    fd.append(prop, extraProps[prop]);
                }
            }

            record.set('status', 'PENDING');
            me.uploadFile(fd, nodeId, store, record, progress, progressBar, filesToBeSubmitted);
        }
    },

    updateProgress: function (filesToBeSubmitted, record, nodeId, progress, progressBar, status) {
        let me = this;
        record.set('status', status ? 'UPLOADED' : 'ERROR');
        record.commit();
        progressBar.updateText(Math.round(100 * ((progress.fileCount) / filesToBeSubmitted.length)) + '% completed...');
        progressBar.updateProgress(((progress.fileCount + 1) / filesToBeSubmitted.length));

        if (progress.fileCount === filesToBeSubmitted.length) {
            me.fireEvent('refreshGrid', nodeId);
            me.getViewModel().set('isSubmitting', false);

            let uploadFinishCallbackEventFunctionName = me.getViewModel().get('uploadFinishCallbackEventFunctionName');
            if (uploadFinishCallbackEventFunctionName) {
                me.fireEvent(uploadFinishCallbackEventFunctionName);
                let store = this.getView().up().down('grid').getStore();
                for (let i = 0; i < store.data.items.length; i++) {
                    let record = store.getData().getAt(i);
                    if (record.get('status') === 'ERROR') {
                        return;
                    }
                }
                me.onCancelClick();
            }

        }
    },

    uploadFile: function (fd, nodeId, store, record, progress, progressBar, filesToBeSubmitted) {
        let me = this;
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + "ecm/node/" + nodeId + '/upload/' + record.get('file').name,
            rawData: fd,
            headers: {'Content-Type': null},
            callback: function (o, s, r) {
                progress.fileCount++;
                if (s) {
                    me.createNodeTags(JSON.parse(r.responseText).id, record.get('tags'));
                    me.updateProgress(filesToBeSubmitted, record, nodeId, progress, progressBar, true);
                } else {
                    me.updateProgress(filesToBeSubmitted, record, nodeId, progress, progressBar, false);
                }
            }
        })
    },

    onFilesChoose: function (fileField, value) {
        let files = fileField.fileInputEl.dom.files;
        let store = this.getView().up().down('grid').getStore();
        Ext.Array.forEach(Ext.Array.from(files), function (file) {
            store.add({
                file: file,
                name: file.name,
                size: file.size,
                status: 'READY'
            });
        });
    },

    onRemoveFileClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        var store = this.getView().up().down('grid').getStore();
        store.remove(record);
    },

    createNodeTags: function (nodeId, tags) {
        if (tags && tags.length > 0) {

            let httpPostUrl = first.config.Config.remoteRestUrl + 'ecm/tag/node/' + nodeId,
                jsonData = [];

            if (tags.length === 1) {
                jsonData = {
                    tag: tags[0]
                }
            } else {
                httpPostUrl = first.config.Config.remoteRestUrl + 'ecm/tag/node/multi/' + nodeId;
                Ext.each(tags, function (tagName) {
                    jsonData.push({
                        tag: tagName
                    });
                });
            }

            Ext.Ajax.request({
                method: 'POST',
                url: httpPostUrl,
                jsonData: jsonData,
                callback: function (o, success, response) {
                    if (!success) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                    }
                }
            });
        }
    }
});