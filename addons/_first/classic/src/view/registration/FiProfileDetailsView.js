Ext.define('first.view.registration.FiProfileDetailsView', {
    extend: 'Ext.panel.Panel',

    xtype: 'fiProfileDetailsEcm',

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
        'Ext.data.TreeStore',
        'Ext.tree.Panel'
    ],

    controller: 'fiProfileDetailsEcm',

    defaults: {
        controller: 'fiProfileDetailsEcm'
    },

    items: []

});