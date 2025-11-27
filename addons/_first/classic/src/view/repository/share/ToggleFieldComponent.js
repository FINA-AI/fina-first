/**
 * Created by oto on 24.04.20.
 */
Ext.define('first.view.repository.share.ToggleFieldComponent', {
    extend: 'Ext.form.field.Checkbox',
    alias: 'widget.togglebutton',

    xtype: 'togglefieldcomponent',

    initComponent: function () {
        this.callParent();
    },

    config: {
        defaultBindProperty: 'value'
    },


    animate: true,
    useTips: false,
    checkChangeEvents: [],

    changeEventName: 'change',
    initDefaultName: Ext.emptyFn,

    checked: false,

    fieldSubTpl: [
        '<div id="{cmpId}-innerWrapEl" data-ref="innerWrapEl" role="presentation"',
        ' class="{wrapInnerCls}">',
        '<span id="{cmpId}-displayEl" data-ref="displayEl" role="presentation" class="{fieldCls}">',
        '<label class="switch x-form-item-label-text">' +
        '  <input type="{inputType}" id="{id}" name="{inputName}" data-ref="inputEl" {inputAttrTpl}',
        '<tpl if="checked"> checked="checked"</tpl>',
        '>',
        '  <span class="slider round"></span>' +
        '</label>',
        '</span>',
        '</div>',
        {
            disableFormats: true,
            compiled: true
        }
    ]


});