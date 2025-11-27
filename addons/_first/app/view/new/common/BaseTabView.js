/**
 * Created by nikoloz on 2019-06-13.
 */
Ext.define('first.view.new.common.BaseTabView', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.util.History'
    ],

    tbar: [{
        handler: function () {
            Ext.History.back();
        },
        iconCls: 'x-fa fa-arrow-left',
        cls:'firstSystemButtons'
    }, {
        handler: function () {
            Ext.History.forward();
        },
        iconCls: 'x-fa fa-arrow-right',
        cls:'firstSystemButtons'
    }, '-', {
        iconCls: 'x-fa fa-pencil',
        text: 'Edit',
        handler: 'onEditClick'
    }, {
        iconCls: 'x-fa fa-save',
        text: 'Save',
        handler: 'onSaveClick'
    }, '-', {
        iconCls: 'x-fa fa-sync',
        handler: 'onRefreshClick'
    },]

});
