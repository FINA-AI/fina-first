Ext.define('first.view.questionnaire.QuestionnaireManagementView', {
    extend: 'Ext.grid.Panel',

    xtype: 'questionnaireManagemetView',

    requires: [
        'Ext.button.Segmented',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.config.Config',
        'first.model.questionnaire.QuestionnaireModel',
        'first.store.questionnaire.QuestionnaireGroupStore',
        'first.view.questionnaire.QuestionnaireGroupController',
        'first.view.questionnaire.QuestionnaireGroupHeader',
        'first.view.questionnaire.QuestionnaireManagementController'
    ],

    controller: 'questionnaireManagement',

    layout: 'fit',

    loadMask: true,

    columnLines: true,

    store: {
        model: 'first.model.questionnaire.QuestionnaireModel',

        autoLoad: true,

        pageSize: 20,

        groupField: 'questionnaireGroupName',

        sorters: [{
            property: 'sequence',
            direction: 'ASC'
        }],

        proxy: {
            type: 'rest',
            enablePaging: true,
            url: first.config.Config.remoteRestUrl + 'ecm/questionnaire/management/grouped',
            reader: {
                type: 'json',
                rootProperty: 'list',
                totalProperty: 'totalResults'
            },
            writer: {
                type: 'json',
                writeAllFields: true
            }
        }
    },

    bind: {
        selection: '{selectedQuestionnaire}'
    },

    features: [{
        ftype: 'checkboxGrouping',
        enableGroupingMenu: false,
        hideGroupHeader: false,
    }],

    tbar: {
        cls:'firstFiRegistryTbar',
        items: [{
            text: i18n.add,
            cls: 'finaPrimaryBtn',
            iconCls: 'x-fa fa-plus-circle',
            handler: 'onAddQuestionnaireClick'
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
            xtype: 'segmentedbutton',
            cls: 'finaSecondaryBtn',
            items: [{
                text: i18n.questionnaireManagementFilterButtonGroup,
                iconCls: 'x-fa fa-object-group',
                filter: "group",
                pressed: true,
                handler: 'onFilterButtonClick'
            }, {
                text: i18n.questionnaireManagementFilterButtonSubGroup,
                iconCls: 'x-fa fa-list',
                filter: "subGroup",
                handler: 'onFilterButtonClick'
            }]
        },],
        bind: {
            hidden: '{!hasConfigAmendPermission}'
        }
    },


    selModel: {
        type: 'checkboxmodel',
        checkOnly: true
    },
    columns: {
        defaults: {
            align: 'left'
        },
        items: [{
            text: i18n.questionnaireGroupColumn,
            dataIndex: 'group',
            renderer: 'renderGroupColumn',
            flex: 1
        }, {
            text: i18n.questionnaireFiType,
            dataIndex: 'fiType',
            renderer: 'renderFiTypeColumn',
            flex: 1
        }, {
            flex: 3,
            text: i18n.questionnaireQuestion,
            dataIndex: 'question',
        }]
    },

    listeners: {
        itemcontextmenu: 'onItemContextMenu'
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }
});
