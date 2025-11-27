Ext.define('first.view.task.TaskGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'taskGrid',

    requires: [
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'Ext.grid.column.Action',
        'first.view.task.TaskGridViewModel',
        'first.view.task.TaskGridViewController'
    ],

    controller: 'taskGridViewController',

    loadMask: true,

    columnLines: true,

    border: false,

    bind: {
        selection: '{selectedGridRow}'
    },

    tbar: {
        hidden: true,
        items: [{
            text: i18n.add,
            iconCls: 'x-fa fa-plus-circle',
            tooltip: i18n.add,
            handler: 'onAddActiveTaskGridClick'
        }],
        bind: {
            hidden: '{!editable}'
        }
    }

});