/**
 * Created by oto on 6/7/19.
 */
Ext.define('first.view.repository.CreateLibraryWindow', {
    extend: 'Ext.window.Window',

    xtype: 'createlibrarywindow',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'first.view.repository.CreateLibraryController'
    ],


    controller: 'createlibrary',

    modal: true,

    width: 400,
    title: i18n.createLibrary,
    scrollable: true,
    constrain: true,
    closable: true,

    viewModel: {},

    items: [
        {
            xtype: 'form',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    allowBlank: false,
                    xtype: 'textfield',
                    fieldLabel: i18n.libraryUploadName,
                    name: 'title',
                    emptyText: i18n.libraryUploadNameEnter,
                    msgTarget: 'under',
                    padding: 10,
                    bind: {
                        value: '{name}'
                    },
                    anchor: '100%'
                }, {
                    allowBlank: false,
                    xtype: 'textfield',
                    fieldLabel: i18n.libraryUploadLibraryID,
                    name: 'libraryId',
                    emptyText: i18n.libraryUploadEnterLibraryId,
                    msgTarget: 'under',
                    padding: 10,
                    bind: {
                        value: '{libraryId}'
                    },
                    anchor: '100%'
                }, {
                    allowBlank: true,
                    xtype: 'textfield',
                    fieldLabel: i18n.libraryUploadDescription,
                    name: 'description',
                    padding: 10,
                    emptyText: i18n.libraryUploadEnterDescription,
                    bind: {
                        value: '{description}'
                    },
                    anchor: '100%'

                }, {
                    xtype: 'combobox',
                    allowBlank: true,
                    fieldLabel: i18n.libraryUploadVisibility,
                    name: 'visibility',
                    padding: 10,
                    forceSelection: true,
                    typeAhead: false,
                    editable: false,
                    triggerAction: 'all',
                    value: 'PUBLIC',
                    store: {
                        fields: [
                            {name: 'id'},
                            {name: 'description'}
                        ],
                        data: [
                            {id: 'PUBLIC', description: i18n.public},
                            {id: 'PRIVATE', description: i18n.private}
                        ]
                    },
                    displayField: 'description',
                    valueField: 'id',
                    bind: '{visibilityValue}',
                    anchor: '100%'

                }
            ],

            buttons: [
                {
                    xtype: 'button',
                    text: i18n.close,
                    iconCls: 'x-fa fa-times',
                    handler: 'onCancel',
                    cls: 'finaSecondaryBtn'
                },
                {
                    xtype: 'button',
                    text: i18n.save,
                    iconCls: 'x-fa fa-save',
                    cls: 'finaPrimaryBtn',
                    handler: 'onSave',
                    formBind: true
                }
            ]
        }
    ]
});