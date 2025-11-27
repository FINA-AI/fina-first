Ext.define('first.view.task.ProcessDefinitionDiagram', {
    extend: 'Ext.window.Window',

    xtype: 'processDefinitionDiagram',

    requires: [
        'first.view.task.ProcessDefinitionDiagramViewModel',
        'first.view.task.ProcessDefinitionDiagramViewController'
    ],

    bind: {
        title: '{title}'
    },

    controller: 'processDefinitionDiagramViewController',

    iconCls: 'x-fa fa-file-image',

    closable: true,

    width: 650,

    height: 450,

    scrollable: true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: []

});