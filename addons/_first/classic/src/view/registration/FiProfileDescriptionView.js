Ext.define('first.view.registration.FiProfileDescriptionView', {
    extend: 'Ext.panel.Panel',

    xtype: 'fiProfileDescriptionEcm',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.form.FieldSet',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
    ],

    controller: 'fiProfileDescriptionEcm',

    autoScroll: true,

    collapsible: false,

    defaults: {
        flex: 1,
        labelWidth: 200,
        readOnly: true,
        xtype: 'textfield',
        editable: false,
        anchor: '100%',
        margin: 5
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            iconCls: 'x-fa fa-history',
            text: i18n.changeHistory,
            cls: 'firstSystemButtons',
            handler: 'onHistoryClick'
        }, {
            iconCls: 'x-fa fa-save',
            text: i18n.save,
            handler: 'onSaveClick',
            cls: 'finaPrimaryBtn',
            bind: {
                hidden: '{isCancellationMode || !editMode || isEditBranchMode || isChangeMode ||(isChangeBranchMode && detail.name!=="Branches")}'
            }
        }]
    },

    items: [{
        xtype: 'panel',
        layout: 'column',
        autoScroll: true,
        defaults: {
            margin: 5,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 200,
                margin:'8 5',
                xtype: 'textfield',
            }
        },
        items: [
            {
                columnWidth: 0.085,
            }, {
                reference: 'leftColumn',
                columnWidth: 0.35,
            }, {
                columnWidth: 0.13,
            }, {
                reference: 'rightColumn',
                columnWidth: 0.35,
            }, {
                columnWidth: 0.085,
            }
        ]
    }],

    listeners: {
        resize: 'onResize'
    }

});
