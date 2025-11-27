Ext.define('first.view.task.WorkflowDetailsView', {
    extend: 'Ext.panel.Panel',

    xtype: 'workflowDetails',

    requires: [
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.view.task.WorkflowDetailsViewModel',
        'first.view.task.WorkflowDetailsViewController'
    ],

    controller: 'workflowDetailsViewController',

    bind: {
        title: i18n.details + ': {workflowDetails.name}'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    defaults: {
        margin: 2
    },

    tbar: {
        cls:'firstFiRegistryTbar',
        items: [{
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
            text: i18n.workflowDetailsViewProcessDiagram,
            iconCls: 'x-fa fa-file-image',
            handler: 'onViewProcessDiagramClick'
        }, {
            iconCls: 'x-fa fa-building',
            hidden: true,
            text: i18n.fiRegistry,
            bind: {
                hidden: '{!isFiRegistryAvailable}'
            },
            handler: 'onViewFiRegistryClick'
        }]
    },

    items: [{
        flex: 2,
        reference: 'workflowDetailsGeneralInfoPanel',
        title: i18n.workflowDetailsGeneralInfo,
        collapsible: true,
        scrollable: true,
        xtype: 'panel',
        layout: 'column',
        defaults: {
            columnWidth: 0.5,
            bodyPadding: 15,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelAlign: 'left',
                labelWidth: first.util.WorkflowHelper.getLabelWidth(),
                readOnly: true,
                xtype: 'textfield'
            }
        },
        items: []
    }, {
        xtype: 'splitter',
        collapseTarget: 'prev'
    }, {
        flex: 1.5,
        layout: 'fit',
        reference: 'workflowDetailsTabBarPanel'
    }]

});
