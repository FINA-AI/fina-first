/**
 * Created by oto on 24.04.20.
 */
Ext.define('first.view.repository.share.ShareLinkWindow', {
    extend: 'Ext.window.Window',

    xtype: 'sharelink',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.Date',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'first.view.repository.share.ShareLinkViewController',
        'first.view.repository.share.ToggleFieldComponent'
    ],

    modal: true,

    bind: {
        title: '{selectedDocument.name}'
    },

    viewModel: {
        formulas: {
            isFileShared: {
                get: function (get) {
                    let doc = get('selectedDocument');
                    if (doc && doc.data && doc.data.properties) {
                        return !!doc.data.properties['qshare:sharedId'];
                    }
                    return false;
                }
            }
        }
    },

    width: 400,
    scrollable: true,
    constrain: true,
    closable: true,

    controller: 'sharelinkview',

    layout: 'fit',

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
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'togglefieldcomponent',
                            fieldLabel: i18n.expiresOn,
                            name: 'name',
                            msgTarget: 'under',
                            padding: 10,
                            checked: false,
                            flex: 1,
                            bind: {
                                value: '{expireDate!==null}'
                            },
                            listeners: {
                                change: 'onChangeExpiresOnToggle'
                            }
                        }, {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            minValue: new Date(),
                            name: 'description',
                            padding: 10,
                            flex: 1,
                            disabled: true,
                            bind: {
                                value: '{expireDate}',
                                disabled: '{!enabledExpiresOn}'
                            },
                            anchor: '100%'

                        }
                    ]
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
                text: i18n.share,
                iconCls: 'x-fa fa-save',
                cls: 'finaPrimaryBtn',
                handler: 'onShare',
                formBind: true
            }]
        }
    ]
})
;