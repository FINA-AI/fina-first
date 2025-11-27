Ext.define('first.view.registration.FiProfileDocumentationEditView', {
    extend: 'Ext.window.Window',
    xtype: 'fiProfileDocumentationEditEcm',

    requires: [
        'first.view.registration.FiProfileDocumentationEditController'
    ],

    controller: 'documentationEditControllerEcm',

    maximizable: true,
    resizable: true,
    modal: true,
    height: Ext.getBody().getViewSize().height - 120,
    width: Ext.getBody().getViewSize().width - 120,

    layout: 'fit',

    bind: {
        title: '{title}'
    },

    items: [{
        xtype: 'form',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        items: [{
            xtype: 'textarea',
            reference: 'htmleditor',
            flex: 1,
            padding: 0,
            margin: 0,
            editable: false,
            bind: {
                value: '{fileContent}',
                editable: '{!isReadonly}'
            },

            listeners: {
                afterrender: 'onEditorAfterRender'
            }
        }]
    }],

    buttons: [{
        text: i18n.cancel,
        iconCls: 'x-fa fa-times',
        cls: 'finaSecondaryBtn',
        handler: 'onCancelClick'
    }, {
        text: i18n.save,
        iconCls: 'x-fa fa-save',
        cls: 'finaPrimaryBtn',
        handler: 'onSaveFileContentClick',
        hidden: true,
        bind: {
            hidden: '{isReadonly}'
        }
    },]
});