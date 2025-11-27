/**
 * Created by oto on 6/3/19.
 */
Ext.define('first.view.repository.CreateFolderWindow', {
    extend: 'Ext.window.Window',

    xtype: 'createfolderwindow',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'first.view.repository.CreateFolderWindowController'
    ],

    modal: true,

    width: 400,
    title: i18n.createFolder,
    scrollable: true,
    constrain: true,
    closable: true,

    controller: 'createfolderwindow',

    items: [
        {
            xtype: 'form',
            defaultType: 'textfield',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    allowBlank: false,
                    fieldLabel: i18n.repositoryCreateFolderName,
                    name: 'name',
                    emptyText: i18n.repositoryCreateFolderEnterName,
                    msgTarget: 'under',
                    padding: 10,
                    bind: {
                        value: '{folderName}'
                    },
                    anchor: '100%'
                }, {
                    allowBlank: true,
                    fieldLabel: i18n.repositoryCreateFolderDescription,
                    name: 'description',
                    padding: 10,
                    emptyText: i18n.repositoryCreateFolderEnterDescription,
                    bind: {
                        value: '{folderDescription}'
                    },
                    anchor: '100%'

                }
            ],

            buttons: [{
                xtype: 'button',
                text: i18n.cancel,
                iconCls: 'x-fa fa-times',
                handler: 'onCancel',
                cls: 'finaSecondaryBtn'
            }, {
                xtype: 'button',
                text: i18n.save,
                iconCls: 'x-fa fa-save',
                cls: 'finaPrimaryBtn',
                handler: 'onSave',
                formBind: true
            }]
        }
    ]
});