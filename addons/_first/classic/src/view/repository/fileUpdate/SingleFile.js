Ext.define('first.view.repository.fileUpdate.SingleFile', {
    extend: 'Ext.form.field.File',

    alias: 'widget.singlefilefield',

    multiple: false,
    buttonText: i18n.fileUpdateAddFile,
    hideLabel: true,
    buttonOnly: true,
    buttonConfig: {
        iconCls: 'x-fa fa-plus'
    }
});