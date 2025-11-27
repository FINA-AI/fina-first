/**
 * Created by oto on 6/6/19.
 */
Ext.define('first.view.repository.common.PropertyView', {
    extend: 'Ext.panel.Panel',

    xtype: 'property',

    requires: [
        'Ext.layout.container.VBox',
        'first.view.repository.common.PropertyController'
    ],

    border: true,

    controller: 'propertyController',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    tbar: [{
        text: i18n.save,
        disabled: true,
        iconCls: 'x-fa fa-save',
        handler: 'onSavePropertiesClick',
        cls: 'finaPrimaryBtn',
        bind: {
            disabled: '{!isPropertyEditMode}'
        }

    }, {
        text: i18n.edit,
        iconCls: 'x-fa fa-edit',
        handler: 'onEditPropertiesClick',
        cls: 'finaSecondaryBtn',
        bind: {
            text: '{isPropertyEditMode?"' + i18n.cancel + '":"' + i18n.edit + '"}',
            iconCls: '{!isPropertyEditMode?"x-fa fa-edit":"x-fa fa-times"}'
        }
    }],

    items: [{
        html: '<div style="vertical-align: center;text-align: center;align-content: center">Please Select record</div>'
    }]
})
;