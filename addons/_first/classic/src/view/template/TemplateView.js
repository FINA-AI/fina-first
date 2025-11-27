Ext.define('first.view.template.TemplateView', {
    extend: 'Ext.panel.Panel',

    xtype: 'template',

    requires: [
        'Ext.form.field.ComboBox',
        'Ext.form.field.HtmlEditor',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.resizer.Splitter',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.view.template.TemplateController'
    ],

    layout: 'fit',

    controller: 'templateController',

    items: [{
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            collapsible: false,
            height: 300,
            flex: 1
        },
        items: [{
            xtype: 'gridpanel',
            columnLines: true,

            bind: {
                selection: '{selectedTemplate}'
            },

            store: {
                fields: ['title', 'author', 'status'],
                data: [{
                    'title': 'Report card',
                    'author': 'George Washington',
                    'status': 'ACTIVE',
                    'template': '<h1 style="color: #5c6bc0">This is report card content</h1>'
                }, {
                    'title': 'Report card 2',
                    'author': 'Benjamin Franklin',
                    'status': 'ACTIVE',
                    'template': '<h1 style="color: #d32f2f">This is report card 1 content</h1>'
                }, {
                    'title': 'Report card 3',
                    'author': 'James Madison',
                    'status': 'PASSIVE',
                    'template': '<h1 style="color: #1de9b6">This is report card 2 content</h1>'
                }]
            },

            tbar: {
                items: [{
                    flex: 1,
                    xtype: 'textfield',
                    emptyText: 'Title ...'
                }, {
                    flex: 1,
                    xtype: 'textfield',
                    emptyText: 'Author ...'
                }, {
                    flex: 1,
                    xtype: 'combo',
                    emptyText: 'Status ...',
                    displayField: 'status',
                    valueField: 'status',
                    store: {
                        fields: ['status'],
                        data: [
                            {'status': 'ACTIVE'},
                            {'status': 'PASSIVE'}
                        ]
                    }
                }, {
                    iconCls: 'x-fa fa-filter'
                }, '|', {
                    iconCls: 'x-fa fa-plus-circle'
                }, '|', {
                    iconCls: 'x-fa fa-minus-circle',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedTemplate}'
                    }
                }]
            },

            columns: {
                defaults: {
                    align: 'left',
                    flex: 0
                },
                items: [{
                    text: '#',
                    xtype: 'rownumberer'
                }, {
                    text: 'Title',
                    dataIndex: 'title',
                    flex: 1
                }, {
                    text: 'Author',
                    dataIndex: 'author',
                    flex: 1
                }, {
                    text: 'Status',
                    dataIndex: 'status',
                    renderer: function (value) {
                        switch (value) {
                            case 'ACTIVE':
                                return '<div class="x-action-col-icon x-item-disabled x-fa fa-check"></div>';
                            default:
                                return '<div class="x-action-col-icon x-item-disabled x-fa fa-times"></div>';
                        }
                    }
                }]
            },

            bbar: {
                xtype: 'pagingtoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                }
            }
        }, {
            xtype: 'splitter',
            width: '1px',
            border: '3',
            flex: 0,
            collapsible: false,
            style: {
                color: 'rgb(236, 236, 236)',
                borderStyle: 'solid'
            }
        }, {
            layout: 'fit',
            items: [{
                xtype: 'htmleditor',
                disabled: true,
                bind: {
                    disabled: '{!selectedTemplate}',
                    value: '{selectedTemplate.template}'
                }
            }],
            bbar: ['->', {
                text: 'Save',
                disabled: true,
                bind: {
                    disabled: '{!selectedTemplate}'
                }
            }]
        }]
    }]

});