Ext.define('first.view.registration.FiProfileQuestionnaireView', {
    extend: 'Ext.grid.Panel',

    xtype: 'fiProfileQuestionnaireEcm',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Grouping',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'first.store.registration.FiRegistrationActionQuestionnaireStore',
        'first.ux.form.field.SearchField',
        'first.view.registration.FiProfileQuestionnaireController'
    ],

    reference: 'questionnaireDataView',

    controller: 'actionQuestionnaireControllerEcm',

    store: {
        type: 'registrationActionQuestionnaireStatusStoreEcm'
    },

    loadMask: true,
    columnLines: true,

    emptyText: i18n.fiActionQuestionnaireEmpty,

    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },

    listeners: {
        beforeedit: 'onBeforeEdit',
        edit: 'onEdit',
        canceledit: 'onCancelEdit'
    },

    bind: {
        selection: '{selectedQuestionnaire}'
    },

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            iconCls: 'x-fa fa-trash-alt',
            cls: 'finaSecondaryBtn',
            text: i18n.delete,
            handler: 'onDeleteClick',
            disabled: true,
            bind: {
                disabled: '{selectedQuestionnaire.predefined || selectedQuestionnaire.subTypeQuestionnaire}',
                hidden: '{!editMode}'
            }
        }, {
            iconCls: 'x-fa fa-plus',
            text: i18n.add,
            handler: 'onAddClick',
            cls: 'finaPrimaryBtn',
            bind: {
                hidden: '{!editMode}'
            }
        }, {
            xtype: 'ux-searchField',
            hideLabel: true,
            flex: 1,
            emptyText: i18n.Search,
        }, {
            xtype: 'button',
            text: i18n.export,
            iconCls: 'x-fa fa-cloud-download-alt',
            cls: 'finaSecondaryBtn',
            handler: 'exportQuestionnaire',
        }]
    },

    features: [{
        ftype: 'grouping',
        groupHeaderTpl: [
            '{[this.formatName(values)]}', {
                formatName: function (values) {
                    let childrenCount = values.children.length;

                    if (i18n[values.name]) {
                        return i18n[values.name] + ' (' + childrenCount + ')';
                    }

                    let tmpValue = values.name.split(':');
                    if (Array.isArray(tmpValue) && i18n[tmpValue[0]]) {
                        return i18n[tmpValue[0]] + ": " + tmpValue[1] + ' (' + childrenCount + ')';
                    }

                    return values.name + ' (' + childrenCount + ')';
                }
            }
        ],
        enableGroupingMenu: false,
        startCollapsed: true
    }],

    columns: [{
        flex: 0,
        width: 35,
        xtype: 'rownumberer',
        enableGroupContext: true
    }, {
        header: i18n.fiActionQuestionnaireQuestion,
        dataIndex: 'question',
        flex: 1.5,
        renderer: 'renderQuestion',
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    }, {
        xtype: 'actioncolumn',
        width: 80,
        menuDisabled: true,
        sortable: false,
        resizable: false,
        items: [{
            iconCls: 'x-fa fa-check green icon-margin',
            handler: 'onApprove',
            isDisabled: 'actionColumnIsDisabled'
        }, {
            iconCls: 'x-fa fa-ban red icon-margin',
            handler: 'onDecline',
            isDisabled: 'actionColumnIsDisabled'
        }, {
            iconCls: 'x-fa fa-eraser',
            handler: 'onErase',
            isDisabled: 'actionColumnIsDisabled'
        }]
    }, {
        header: i18n.fiActionQuestionnaireNote,
        dataIndex: 'note',
        flex: 2,
        renderer: 'renderNote',
        editor: {
            xtype: 'textfield',
            allowBlank: true
        }
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }

});
