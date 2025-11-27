/**
 * Created by oto on 6/4/19.
 */
Ext.define('first.view.repository.fileUpload.MultiFile', {
    extend: 'Ext.form.field.File',

    alias: 'widget.multifilefield',

    multiple: true,
    buttonText: i18n.addFiles,
    hideLabel: true,
    buttonOnly: true,
    buttonConfig: {
        iconCls: 'x-fa fa-plus',
        cls:'finaSecondaryBtn'
    },

    initComponent: function () {
        var me = this;

        me.on('render', function () {
            me.fileInputEl.set({multiple: true});
        });

        me.callParent(arguments);
    }
});
