Ext.define('first.util.DocumentRepositoryHelper', {

    requires: [
        'first.config.Config'
    ],

    openDownloadFileVersionUrl: function (nodeId, versionId) {
        window.open(first.config.Config.remoteRestUrl + "ecm/version/" + nodeId + "/versions/" + versionId + "/content?attachment=true", '_self');
    },

    openDownloadFileUrl: function (nodeId) {
        window.open(first.config.Config.remoteRestUrl + "ecm/node/" + nodeId + "/content?attachment=true", '_self');
    },

    onFolderDownload: function (nodeId, view, name) {
        let body = {
            nodeIds: [nodeId]
        };

        let me = this;
        Ext.Ajax.request({
            method: 'POST',
            url: first.config.Config.remoteRestUrl + "ecm/downloads",
            jsonData: body,
            success: function (response) {
                console.log(response);
                let result = JSON.parse(response.responseText);
                let progressBar = me.createProgressBar();
                let window = Ext.create({
                    xtype: 'window',
                    closeable: true,
                    autoShow: true,
                    header: false,
                    width: 300,
                    flex: 1,
                    border: false,
                    modal: true,
                    items: [
                        progressBar
                    ]
                });
                me.checkDownload(result['entry']['id'], progressBar, window, name);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                view.unmask();
            }
        })
    },

    checkDownload: function (nodeId, progressBar, window, name) {
        let me = this,
            url = first.config.Config.remoteRestUrl + "ecm/downloads/" + nodeId;
        if (name) {
            url += "?name=" + name;
        }
        Ext.Ajax.request({
            method: 'GET',
            url: url,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                switch (result['entry']['status']) {
                    case 'DONE':
                        me.openDownloadFileUrl(nodeId);
                        progressBar.updateText('100% completed...');
                        progressBar.updateProgress(100);
                        window.destroy();
                        break;
                    case 'PENDING':
                    case 'IN_PROGRESS':
                        let i = 0;
                        if (result['entry']['totalFiles'] > 0) {
                            i = result['entry']['filesAdded'] / result['entry']['totalFiles'];
                        }
                        progressBar.updateText(Math.round(100 * i) + '% completed...');
                        progressBar.updateProgress(i);

                        setTimeout(Ext.bind(function () {
                            me.checkDownload(nodeId, progressBar, window, name)
                        }, me), 500);
                        break;
                    case 'CANCELLED':
                    case 'MAX_CONTENT_SIZE_EXCEEDED':
                        window.destroy();
                        Ext.Msg.alert('Error', 'Download Filed');
                        break;

                }
            },
            failure: function (response) {
                window.destroy();
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        })

    },

    createProgressBar: function () {
        return Ext.create({
            xtype: 'progressbar',
            id: 'DispatchDoVehicleCapactiyGraphid',
            style: {
                backgroundColor: '#DCDCDC'
            },
            value: 0,
            text: '0%'
        });
    }

});
