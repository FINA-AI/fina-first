Ext.define('first.view.registration.complexStructure.ComplexStructureTreeView', {
    extend: 'Ext.tree.Panel',

    xtype: 'complexStructureTreeView',

    requires: [
        'Ext.grid.plugin.Exporter',
        'first.store.registration.ComplexStuctureStore',
        'first.ux.form.field.SearchField',
        'first.view.common.ExportToButton',
        'first.view.registration.ComplexStructureTreeController'
    ],

    rootVisible: true,

    controller: 'complexStructureTree',


    store: {type: 'complexStructureStore'},

    bind: {
        selection: '{selectedComplexStrucureNode}'
    },

    layout: 'fit',

    viewModel: {},

    plugins: 'gridexporter',

    columnLines: true,

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [
            {
                text: i18n.add,
                iconCls: 'x-fa fa-plus',
                cls: 'finaPrimaryBtn',
                disabled: true,
                bind: {
                    hidden: '{isCancellationMode || !editMode || isEditBranchMode || (isChangeMode && !isChangeTypeManagement) || (isChangeBranchMode && detail.name!=="Branches")}',
                    disabled: '{!selectedComplexStrucureNode}'
                },
                menu: {
                    items: [
                        {
                            text: i18n.legalPerson,
                            tooltip: i18n.legalPerson,
                            handler: 'onAddClick',
                            iconCls: 'x-fa fa-sitemap',
                            type: 'LEGAL',
                            disabled: true,
                            bind: {
                                disabled: '{selectedComplexStrucureNode && selectedComplexStrucureNode.fina_fiComplexStructureType ==="PHYSICAL"}'
                            }
                        }, {
                            text: i18n.physicalPerson,
                            tooltip: i18n.physicalPerson,
                            handler: 'onAddClick',
                            iconCls: 'x-fa fa-male',
                            type: 'PHYSICAL',
                            disabled: true,
                            bind: {
                                disabled: '{selectedComplexStrucureNode && selectedComplexStrucureNode.fina_fiComplexStructureType ==="PHYSICAL"}'
                            }
                        }
                    ]
                }
            },
            {
                iconCls: 'x-fa fa-eye',
                cls: 'firstSystemButtons',
                tooltip: i18n.showAll,
                text: i18n.showAll,
                handler: 'onShowAllPersonsClick',
                enableToggle: true,
                pressed: false,
                hidden: true,
                bind: {
                    hidden: '{theFi.fina_fiActionType === "REGISTRATION"}'
                }
            },
            {
                xtype: 'ux-searchField',
                reference: 'searchField',
                flex: 1,
                onSearch: 'onSearch'
            },
            {
                xtype: 'export-to-button'
            }
        ]
    },

    viewConfig: {
        getRowClass: function (record, index, rowParams) {
            let status = record.get('properties') ? record.get('properties')['fina:status'] : record.get('fina:status');
            if (status === 'CANCELED') {
                return 'grid-canceled-row';
            }
        }
    },

    columns: [],

    listeners: {
        afterrender: 'afterRender'
    }

});
