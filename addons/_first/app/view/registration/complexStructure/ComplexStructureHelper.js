Ext.define('first.view.registration.complexStructure.ComplexStructureHelper', {

    requires: [
        'Ext.data.Model',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'first.config.Config',
        'first.util.GridActionColumnUtil',
        'first.view.registration.MetadataUtil'
    ],

    statics: {

        getTreeColumns: function (metaData, childType, fiName) {
            let me = this;

            let columnNames = me.getDefinedTreeColumnNames(metaData, childType);

            let columns = [{
                xtype: 'treecolumn',
                dataIndex: 'fina_fiComplexStructureLegalName',
                flex: 1,
                exportRenderer: function (value, row, record) {
                    let type = record.get('fina_fiComplexStructureType');

                    switch (type) {
                        case 'LEGAL':
                            let legalFormType = record.get('fina_fiComplexStructureLegalType');
                            if (legalFormType && i18n[legalFormType]) {
                                let name = value;
                                value = i18n[legalFormType] + ' ' + name;
                            }
                            break;
                        case 'PHYSICAL':
                            value = record.get('nameField');
                            break;
                    }

                    return value;
                },
                renderer: function (content, cell, record, col, row, store, tree) {
                    let tooltip = i18n[record.get('fina_finalStatus')];
                    cell.tdAttr = 'data-qtip="' + (tooltip ? tooltip : '') + '"';

                    cell.glyph = 'H@Pictos';

                    let type = record.get('fina_fiComplexStructureType');

                    if (record.id === 'root') {
                        record.data.fina_fiComplexStructureLegalName = fiName;
                    }

                    switch (type) {
                        case 'LEGAL':
                            cell.glyph = 'l@Pictos';
                            let legalFormType = record.get('fina_fiComplexStructureLegalType');
                            if (legalFormType && i18n[legalFormType]) {
                                let name = content;
                                content = i18n[legalFormType] + ' ' + name;
                            }
                            break;
                        case 'PHYSICAL':
                            cell.glyph = 'U@Pictos';
                            record.data.leaf = true;
                            content = record.get('nameField');
                            break;
                    }

                    return content;
                }
            }, {
                xtype: 'actioncolumn',
                width: 90,
                sortable: false,
                menuDisabled: true,
                resizable: false,
                hideable: false,
                align: 'center',
                items: [{
                    tooltip: i18n.edit,
                    iconCls: 'x-fa fa-edit icon-margin',
                    isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.id === 'root';
                    },
                    handler: 'onEditClick',
                }, {
                    iconCls: 'x-fa fa-history icon-margin',
                    tooltip: i18n.changeHistory,
                    text: i18n.changeHistory,
                    cls: 'firstSystemButtons',
                    handler: 'onHistoryClick'
                }, {
                    iconCls: 'x-fa fa-minus-circle redColor icon-margin',
                    tooltip: i18n.delete,
                    handler: 'onRemoveClick',
                    isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.id === 'root' || !first.util.GridActionColumnUtil.getDeleteButtonEnabled(view.grid.getViewModel(), record);
                    },
                    getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                        return first.util.GridActionColumnUtil.getDeleteButtonClassName(view.grid.getViewModel(), record);
                    }
                }, {
                    iconCls: 'x-fa fa-ban redColor',
                    tooltip: i18n.changesDisable,
                    handler: 'onDisableClick',
                    isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                        return !first.util.GridActionColumnUtil.getDisableButtonEnabled(view.grid.getViewModel(), record);
                    },
                    getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                        return first.util.GridActionColumnUtil.getDisableClassName(view.grid.getViewModel(), record);
                    }
                }],
            }];

            if (columnNames && columnNames.length > 0) {
                Ext.each(columnNames, function (c) {
                    let item = me.getItem(c, metaData);
                    if (item) {
                        columns.push({
                            // width: 200,
                            flex: 1,
                            dataIndex: item.name.replace(':', '_'),
                            text: item.title,
                            tooltip: item.title
                        });
                    }
                });

            } else {

                let defaultColumns = [{
                    text: i18n.identificationNumber,
                    dataIndex: 'idNumber',
                    flex: 1
                }, {
                    text: i18n.registrationCountry,
                    dataIndex: 'fina_fiComplexStructureRegistrationCountry',
                    flex: 1
                }, {
                    text: i18n.capitalPercentage,
                    dataIndex: 'percentage',
                    flex: 1
                }, {
                    text: i18n.status,
                    dataIndex: 'fina_finalStatus',
                    exportRenderer: function (value, row, record) {
                        let content=record.get('fina_finalStatus');
                        return i18n[content] ? i18n[content] : content;
                    },
                    renderer: function (content, cell, record) {
                        if (content === 'CANCELED') {
                            cell.style = 'color:red;';
                        }
                        return i18n[content] ? i18n[content] : content;
                    },
                    flex: 1
                }];

                columns = columns.concat(defaultColumns);
            }

            return columns;

        },

        getItem: function (columnName, metaData) {
            for (let i in metaData) {
                if (metaData[i].name === columnName) {
                    return metaData[i];
                }
            }
        },

        getDefinedTreeColumnNames: function (metaDada, childType) {
            for (let i in metaDada) {
                if (metaDada[i].name === (childType + 'TreeColumns')) {
                    let constraints = first.view.registration.MetadataUtil.getAllowedValues(metaDada[i].constraints);
                    if (constraints && constraints.length === 1 && constraints[0].trim() === '') {
                        return [];
                    }
                    return constraints;
                }
            }

        },

        getComplexStructureField: function (metaData, name) {
            let filtered = metaData.filter(ob => {
                return ob.name === name;
            });
            if (filtered.length > 0) {
                return filtered[0].constraints[0].parameters[0]['allowedValues'];
            }

            return [];
        },

        getBeneficiaryGrid: function (metaData, hiddenProperties, childType, type, fiRegistryId) {
            let formFieldsArray = first.view.registration.complexStructure.ComplexStructureHelper.getComplexStructureField(metaData, (childType + type + 'FormFields'));
            let columns = [];
            columns.push({
                xtype: 'rownumberer'
            });

            columns.push({
                xtype: 'actioncolumn',
                width: 30,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                items: [{
                    iconCls: 'x-fa fa-history',
                    tooltip: i18n.changeHistory,
                    cls: 'firstSystemButtons',
                    text: i18n.changeHistory,
                    handler: 'onHistoryClick'
                }],
            });

            Ext.each(metaData, function (item) {
                if (hiddenProperties.indexOf(item.name) < 0 && formFieldsArray.indexOf(item.name) >= 0) {
                    let col = {
                        width: 200,
                        dataIndex: item.name,
                        text: item.title,
                        tooltip: item.title
                    };

                    if (item.dataType === 'd:date') {
                        col.xtype = 'datecolumn';
                        col.format = first.config.Config.dateFormat;
                    }

                    if (item.dataType === 'd:boolean') {
                        col.renderer = function (value) {
                            return value != null ? (value ? i18n.yes : i18n.no) : value;
                        }
                    }

                    if (item["constraints"].length > 0 && first.view.registration.MetadataUtil.getAllowedValues(item["constraints"]).length > 0) {
                        col.renderer = function (value) {
                            return value != null ? i18n[value] : null;
                        }
                    }

                    columns.push(col);
                }
            });

            return Ext.create({
                xtype: 'grid',
                columns: columns,
                store: {
                    model: 'Ext.data.Model',
                    fields: [],
                    proxy: {
                        type: 'rest',
                        enablePaging: true,
                        url: first.config.Config.remoteRestUrl + 'ecm/fi/complexStructure/beneficiaries/' + fiRegistryId,
                        reader: {
                            type: 'json',
                            rootProperty: 'list',
                            totalProperty: 'totalResults',
                            transform: {
                                fn: function (data) {
                                    let result = [];
                                    if (data && data.list) {
                                        Ext.each(data.list, function (record) {
                                            if (record) {
                                                let props = record.properties;
                                                if (props) {
                                                    props.id = record.id;
                                                    result.push(props);
                                                }
                                            }
                                        }, this);
                                    }

                                    return result;
                                },
                                scope: this
                            }
                        },
                        writer: {
                            type: 'json',
                            writeAllFields: true
                        }
                    },

                    autoLoad: true
                },

                rootVisible: true,
                scrollable: true,
                columnLines: true,

                bbar: {
                    xtype: 'pagingtoolbar',
                    layout: {
                        type: 'hbox',
                        pack: 'center'
                    }
                }
            });

        }

    }
});
