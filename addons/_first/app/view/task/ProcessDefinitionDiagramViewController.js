Ext.define('first.view.task.ProcessDefinitionDiagramViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.processDefinitionDiagramViewController',

    init: function () {

        let proxyUrl = this.getViewModel().get('diagramProxyUrl');

        let me = this;
        Ext.Ajax.request({
            url: proxyUrl,
            method: 'GET',
            success: function (response) {
                let img = Ext.create('Ext.Img', {
                    src: response.responseText
                });
                me.getView().add(img);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            },
            callback: function () {
                me.getView().unmask();
            }
        });
    }

});
