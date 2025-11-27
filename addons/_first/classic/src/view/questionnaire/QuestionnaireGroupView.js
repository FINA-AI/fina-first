Ext.define('first.view.questionnaire.QuestionnaireGroupView', {
    extend: 'Ext.grid.Panel',

    xtype: 'questionnaireGroupView',

    requires: [
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.questionnaire.QuestionnaireGroupStore',
        'first.view.questionnaire.QuestionnaireGroupController'
    ],

    controller: 'questionnaireGroupController',

    loadMask: true,

    columnLines: true,

    store: {
        type: 'questionnaireGroupStore'
    },

    bind: {
        selection: '{selectedQuestionnaireGroup}'
    },

    tbar: {
        cls:'firstFiRegistryTbar',
        items: [{
            text: i18n.add,
            cls: 'finaPrimaryBtn',
            iconCls: 'x-fa fa-plus-circle',
            handler: 'onAddQuestionnaireGroupClick'
        }, {
            text: i18n.edit,
            cls: 'finaSecondaryBtn',
            iconCls: 'x-fa fa-edit',
            disabled: true,
            handler: 'onEditQuestionnaireGroupClick',
            bind: {
                disabled: '{!selectedQuestionnaireGroup}'
            }
        }, {
            text: i18n.delete,
            cls: 'finaSecondaryBtn',
            iconCls: 'x-fa fa-minus-circle',
            handler: 'onDeleteQuestionnaireGroupClick',
            disabled: true,
            bind: {
                disabled: '{!selectedQuestionnaireGroup}'
            }
        }],
        bind: {
            hidden: '{!hasConfigAmendPermission}'
        }
    },

    columns: {
        defaults: {
            align: 'left',
            flex: 1
        },
        items: [{
            flex: 0,
            xtype: 'rownumberer'
        }, {
            text: i18n.questionnaireGroupCode,
            dataIndex: 'code'
        }, {
            text: i18n.questionnaireGroupDescription,
            dataIndex: 'description'
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }
});
