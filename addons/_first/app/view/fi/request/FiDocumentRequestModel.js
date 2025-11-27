Ext.define('first.view.fi.request.FiDocumentRequestModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.fiDocumentRequest',

    formulas: {
        hasFiDocumentRequestAmendPermission: function (get) {
            let permissions = first.config.Config.conf['permissions'];
            return (permissions && Ext.Array.contains(permissions, 'net.fina.first.fi.document.request.amend'));
        },

        hasFiDocumentRequestDeletePermission: function (get) {
            let permissions = first.config.Config.conf['permissions'];
            return (permissions && Ext.Array.contains(permissions, 'net.fina.first.fi.document.request.delete'));
        }
    }

});