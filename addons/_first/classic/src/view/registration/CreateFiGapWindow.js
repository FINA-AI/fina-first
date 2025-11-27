Ext.define('first.view.registration.CreateFiGapWindow', {
    extend: 'Ext.window.Window',

    xtype: 'createGapWindow',

    controller: 'createGapController',

    maximizable: false,
    resizable: false,

    minWidth: 550,
    modal: true,

    flex: 1,

    layout: 'fit',

    title: i18n.createGapWindowTitle,

    items: [{
        xtype: 'form',
        scrollable: true,
        defaults: {
            labelWidth: 200,
            xtype: 'textfield',
            anchor: '100%',
            margin: 5
        },
        reference: 'formItems',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        flex: 1,
        items: []
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
        handler: 'onSaveClick'
    }]


});
