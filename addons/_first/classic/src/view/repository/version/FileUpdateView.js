Ext.define('first.view.repository.version.FileUpdateView', {
    extend: 'Ext.panel.Panel',

    xtype: 'updatefileview',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.File',
        'Ext.form.field.Radio',
        'Ext.form.field.Text',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill'
    ],


    layout: 'fit',

    items: [{
        xtype: 'form',
        padding: 10,
        layout: 'anchor',
        reference: 'fileForm',
        defaults: {
            anchor: '100%',
            hideEmptyLabel: false,
            xtype: 'radio'
        },
        items: [
            {
                xtype: 'filefield',
                name: 'filedata',
                reference: 'fileField',
                fieldLabel: i18n.updateFileVersion,
                emptyText: i18n.pleaseChooseFile,
                bind: {
                    value: '{filefieldValue}'
                }
            }, {
                checked: true,
                fieldLabel: i18n.updateFileVersionLabel,
                name: 'versionType',
                inputValue: 'Minor',
                reference: 'minorRadio',
                bind: {
                    boxLabel: '{minorRadioBoxLabel}'
                }
            }, {
                name: 'versionType',
                inputValue: 'Major',
                reference: 'majorRadio',
                bind: {
                    boxLabel: '{majorRadioBoxLabel}'
                }
            }]
    }],

    bbar: ['->', {
        text: i18n.buttonClose,
        iconCls: 'x-fa fa-times',
        cls: 'finaSecondaryBtn',
        handler: 'onCancelClick'
    }, {
        text: i18n.submit,
        iconCls: 'x-fa fa-save',
        cls: 'finaPrimaryBtn',
        handler: 'onFilesSubmit',
        disabled: true,
        bind: {
            disabled: '{!filefieldValue}'
        }
    }]

});