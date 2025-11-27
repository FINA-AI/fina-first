Ext.define('first.view.questionnaire.QuestionnaireView', {
    extend: 'Ext.grid.Panel',

    xtype: 'questionnaireView',

    requires: [
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Grouping',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'first.store.questionnaire.QuestionnaireStore',
        'first.view.questionnaire.QuestionnaireController'
    ],

    controller: 'questionnaireController',

    layout: 'fit',

    loadMask: true,

    columnLines: true,

    store: {
        type: 'questionnaireStore',
        storeId: 'questionnaireStore'
    },

    bind: {
        selection: '{selectedQuestionnaire}'
    },

    features: [{
        ftype: 'grouping',
        enableGroupingMenu: false,
        enableNoGroups: false
    }],

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            text: i18n.add,
            cls: 'finaPrimaryBtn',
            iconCls: 'x-fa fa-plus-circle',
            handler: 'onAddQuestionnaireClick'
        }, {
            text: i18n.edit,
            cls: 'finaSecondaryBtn',
            iconCls: 'x-fa fa-edit',
            disabled: true,
            bind: {
                disabled: '{!selectedQuestionnaire}'
            },
            handler: 'onEditQuestionnaireClick'
        }, {
            text: i18n.delete,
            cls: 'finaSecondaryBtn',
            iconCls: 'x-fa fa-minus-circle',
            disabled: true,
            bind: {
                disabled: '{!selectedQuestionnaire}'
            },
            handler: 'onDeleteQuestionnaireClick'
        }, '|', {
            iconCls: 'x-fa fa-arrow-up',
            tooltip: i18n.moveUp,
            handler: 'onMoveUpRecord',
            disabled: true,
            bind: {
                disabled: '{!selectedQuestionnaire}'
            }
        }, {
            iconCls: 'x-fa fa-arrow-down',
            tooltip: i18n.moveDown,
            handler: 'onMoveDownRecord',
            disabled: true,
            bind: {
                disabled: '{!selectedQuestionnaire}'
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
            xtype: 'rownumberer',
            enableGroupContext: true
        }, {
            text: i18n.questionnaireGroupColumn,
            dataIndex: 'group',
            renderer: 'renderGroupColumn'
        }, {
            text: i18n.questionnaireCode,
            dataIndex: 'code'
        }, {
            text: i18n.questionnaireDefaultValue,
            dataIndex: 'defaultValue',
            renderer: 'renderDefaultValueColumn'
        }, {
            text: i18n.questionnaireFiType,
            dataIndex: 'fiType',
            renderer: 'renderFiTypeColumn'
        }, {
            flex: 3,
            text: i18n.questionnaireQuestion,
            dataIndex: 'question'
        }, {
            flex: 1,
            xtype: 'actioncolumn',
            text: i18n.questionnaireObligatory,
            dataIndex: 'obligatory',
            disabled: true,
            style: {
                cursor: 'context-menu'
            },
            items: [{
                iconCls: 'x-fa fa-check'
            }],
            renderer: function (val) {
                if (!val) {
                    this.items[0].iconCls = '';
                } else {
                    this.items[0].iconCls = 'x-fa fa-check'
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
});
