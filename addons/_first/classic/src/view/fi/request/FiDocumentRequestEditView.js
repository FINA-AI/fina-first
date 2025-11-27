Ext.define('first.view.fi.request.FiDocumentRequestEditView', {
    extend: 'Ext.window.Window',

    xtype: 'fiDocumentRequestEdit',

    requires: [
        'Ext.button.Button',
        'Ext.data.proxy.Memory',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Grouping',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.util.Format',
        'WindowUtil',
        'first.model.fi.FirstFiModel',
        'first.store.registration.FiRegistry',
        'first.view.fi.request.FiDocumentRequestEditController',
        'first.view.fi.request.FiDocumentRequestEditModel',
        'first.view.fi.request.FiTreePicker',
        'first.view.repository.fileUpload.FileUploadView'
    ],

    resizable: true,

    controller: 'fiDocumentRequestEdit',

    height: WindowUtil.height,

    width: WindowUtil.width,

    modal: true,

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'form',

        scrollable: true,

        items: [{

            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults: {
                xtype: 'textfield',
                allowBlank: false,
                labelWidth: WindowUtil.labelWidth,
                margin: WindowUtil.itemMargin
            },

            items: [{
                fieldLabel: i18n.fiDocumentRequestEditName + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{fiDocumentRequest.name}'
                }
            }, {
                fieldLabel: i18n.fiDocumentRequestEditDescription + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{fiDocumentRequest.description}'
                }
            }, {
                hidden: true,
                disabled: true,
                fieldLabel: i18n.fiDocumentRequestEditAssigneeFiCode + ' <b style="color: red;">*</b>',
                emptyText: i18n.fiDocumentRequestEditAssigneeFiCodeEmpty + ' ...',
                xtype: 'combobox',
                store: {
                    type: 'fiRegistryEcm',
                    pageSize: Math.pow(2, 31) - 1,
                    autoLoad: true
                },
                valueField: 'code',
                displayField: 'code',
                queryMode: 'local',
                forceSelection: true,
                listConfig: {
                    itemTpl: [
                        '<div data-qtip="{code}: {name}">{code} - {name}</div>'
                    ]
                },
                bind: {
                    value: '{fiDocumentRequest.assigneeFiCode}',
                    hidden: '{!isEdit}',
                    disabled: '{!isEdit}'
                }
            }, {
                hidden: true,
                disabled: true,
                xtype: 'combo',
                fieldLabel: i18n.fiDocumentRequestEditAssigneeFiCodes + ' <b style="color: red;">*</b>',
                emptyText: i18n.basicFilterFiEmpty,
                reference: 'fiPickerTagField',
                enableKeyEvents: true,
                displayField: 'name',
                valueField: 'code',
                grow: true,
                scrollable: true,
                multiSelect: true,
                editable: false,
                forceSelection: true,
                triggerAction: 'all',
                tip: i18n.profileFilterTooltipInspectionDocNumber,


                listeners: {
                    afterrender: 'afterFiComboRender'
                },
                store: {
                    model: 'first.model.fi.FirstFiModel',
                    proxy: {type: "memory"}
                },

                bind: {
                    value: '{filter.inspection.fiId}',
                    hidden: '{isEdit}',
                    disabled: '{isEdit}'
                },

                createPicker: function () {
                    return Ext.create({
                        'xtype': 'fiTreePicker',
                        maxHeight: 300,
                        reference: 'fiTreePicker'
                    });
                }
            }, {
                xtype: 'tagfield',
                fieldLabel: i18n.fiDocumentRequestFiObject,
                displayField: 'displayValue',
                valueField: 'objectType',
                hidden: true,
                allowBlank: true,
                store: {
                    data: [
                        {displayValue: i18n.branch, objectType: 'BRANCH'},
                        {displayValue: i18n.fiComplexStructure, objectType: 'COMPLEX_STRUCTURE'},
                        {displayValue: i18n.administrator, objectType: 'BENEFICIARY'}
                    ]
                },
                bind: {
                    value: '{fiDocumentRequest.fiObjectTypes}',
                    hidden: '{isEdit}',
                }
            }, {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                fieldLabel: i18n.fiDocumentRequestEditDueDate + ' <b style="color: red;">*</b>',
                bind: {
                    value: '{fiDocumentRequest.dueDate}'
                }
            }, {
                xtype: 'combo',
                fieldLabel: i18n.fiDocumentRequestEditSubmitted + ' <b style="color: red;">*</b>',
                displayField: 'displayValue',
                valueField: 'isSubmittedValue',
                store: {
                    data: [
                        {displayValue: i18n.yes, isSubmittedValue: true},
                        {displayValue: i18n.no, isSubmittedValue: false}
                    ]
                },
                bind: {
                    value: '{fiDocumentRequest.submitted}'
                }
            }, {
                xtype: 'datefield',
                format: first.config.Config.dateFormat,
                fieldLabel: i18n.fiDocumentRequestEditSubmissionDate,
                disabled: true,
                bind: {
                    value: '{fiDocumentRequest.submissionDate}',
                    disabled: '{!fiDocumentRequest.submitted}'
                }
            }, {
                fieldLabel: i18n.comment,
                disabled: true,
                allowBlank: true,
                bind: {
                    value: '{fiDocumentRequest.comment}',
                    disabled: '{!fiDocumentRequest.submitted}'
                }
            }],

        }, {
            hidden: true,
            xtype: 'fileupload',
            buttons: null,
            height: 200,
            listeners: {
                afterrender: 'onTemplatesViewRender'
            },
            bind: {
                hidden: '{isEdit}'
            },
        }, {
            hidden: true,
            bind: {
                hidden: '{isFiObjectGridHidden}'
            },

            margin: '10 0 0 0',

            items: [{
                xtype: 'gridpanel',
                reference: 'fiDocumentRequestObjects',

                listeners: {
                    edit: 'onFiObjectsEdit',
                },

                features: [{
                    ftype: 'grouping',
                    groupHeaderTpl: [
                        '{[this.formatName(values)]}', {
                            formatName: function (values) {
                                let childrenCount = values.children.length;

                                switch (values.name) {
                                    case 'BENEFICIARY':
                                        return i18n['Authorized Persons'] + ' (' + childrenCount + ')';
                                    case 'BRANCH':
                                        return i18n['Branches'] + ' (' + childrenCount + ')';
                                    case 'COMPLEX_STRUCTURE':
                                        return i18n['Complex Structures'] + ' (' + childrenCount + ')';
                                }

                            }
                        }]
                }],
                store: {
                    groupField: 'fina_fiDocumentRequestFiObjectType',
                    proxy: {
                        url: '',
                        type: 'rest',
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
                                                    let data = {};

                                                    data.id = record.id;
                                                    data["fina_fiDocumentRequestFiObjectName"] = props["fina:fiDocumentRequestFiObjectName"];
                                                    data["fina_fiDocumentRequestFiObjectIsPresented"] = props["fina:fiDocumentRequestFiObjectIsPresented"];
                                                    data["fina_fiDocumentRequestFiObjectComment"] = props["fina:fiDocumentRequestFiObjectComment"];
                                                    data["fina_fiDocumentRequestFiObjectType"] = props["fina:fiDocumentRequestFiObjectType"];
                                                    result.push(data);
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
                },

                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 1
                },

                columns: [{
                    flex: 0,
                    width: 35,
                    xtype: 'rownumberer',
                    renderer: 'rowNumberRenderer'
                }, {
                    header: i18n.taskItemGridName,
                    dataIndex: 'fina_fiDocumentRequestFiObjectName',
                    renderer: function (value, cell, record) {
                        let encodedValue = Ext.util.Format.htmlEncode(value);

                        if (record.get("fina_fiDocumentRequestFiObjectIsPresented")) {
                            return "<span style='color:#73b51e' data-qtip='" + encodedValue + "'>" + encodedValue + "</span>";
                        }

                        return "<span data-qtip='" + encodedValue + "'>" + encodedValue + "</span>";
                    },
                    flex: 1.5,
                }, {
                    xtype: 'actioncolumn',
                    width: 60,
                    menuDisabled: true,
                    sortable: false,
                    resizable: false,
                    items: [{
                        iconCls: 'x-fa fa-check green icon-margin',
                        handler: 'onFiObjectApprove',
                    }, {
                        iconCls: 'x-fa fa-eraser',
                        handler: 'onFiObjectErase',
                    }]
                }, {
                    header: i18n.fiActionQuestionnaireNote,
                    dataIndex: 'fina_fiDocumentRequestFiObjectComment',
                    flex: 2,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: true
                    }
                }],

                loadMask: true,
                columnLines: true,
            }],
            listeners: {
                afterrender: "afterFiObjectsRender"
            }
        }],

        bbar: {
            items: ['->', {
                text: i18n.cancel,
                iconCls: 'x-fa fa-times',
                handler: 'onCancelBtnClick',
                cls: 'finaSecondaryBtn'
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-save',
                text: i18n.save,
                handler: 'onSaveBtnClick',
                cls: 'finaPrimaryBtn',
                formBind: true
            }]
        }
    }],

    listeners: {
        beforeClose: 'beforeClose'
    }
});
