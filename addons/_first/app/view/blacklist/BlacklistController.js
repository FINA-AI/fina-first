Ext.define('first.view.blacklist.BlacklistController', {
    extend: 'first.view.attestation.AttestationController',

    alias: 'controller.blacklist',

    init: function () {
        this.initGrid();
        let permissions = first.config.Config.conf['permissions'],
            hasAmendPermission = (permissions && Ext.Array.contains(permissions, 'net.fina.first.blacklist.amend')),
            hasDeletePermission = (permissions && Ext.Array.contains(permissions, 'net.fina.first.blacklist.delete'));
        this.getViewModel().set('hasBlacklistAmendPermission', hasAmendPermission);
        this.getViewModel().set('hasBlacklistDeletePermission', hasDeletePermission);
    },

    initGrid: function () {
        let me = this,
            view = me.getView();

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + "ecm/node/-root-?relativePath=fina2first/BlackList",
            success: function (res) {
                let node = JSON.parse(res.responseText);
                if (node) {
                    let childType = node.properties['fina:folderConfigChildType'],
                        prefix = childType.split(":")[0];
                    me.getViewModel().set('childType', childType);
                    me.getViewModel().set('childType', childType.replace(':', '_'));

                    Ext.Ajax.request({
                        url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + childType.replace(':', '_') + '/properties',
                        method: 'GET',
                        callback: function (options, success, response) {
                            let metaDada = JSON.parse(response.responseText),
                                hiddenProperties = first.view.registration.MetadataUtil.getMetaDataConstraintFields(childType, metaDada, 'HiddenFieldNames'),
                                gridProperties = first.view.registration.MetadataUtil.getMetaDataConstraintFields(childType, metaDada, 'Sequence');

                            me.getViewModel().set('metaDada', metaDada);
                            me.getViewModel().set('hiddenProperties', hiddenProperties);
                            me.getViewModel().set('gridProperties', gridProperties);

                            view.setColumns(me.generateColumns(gridProperties, hiddenProperties));

                        }
                    });
                }
            }
        });
    },

    generateColumns: function (gridProperties, hiddenProperties) {
        let me = this,
            columns = [{
                flex: 0,
                xtype: 'rownumberer'
            }, {
                menuDisabled: true,
                sortable: false,
                hideable: false,
                xtype: 'actioncolumn',
                resizable: false,
                align: 'center',
                items: [{
                    iconCls: 'x-fa fa-edit',
                    handler: 'onEditClick',
                    isDisabled: 'isEditActionDisabled'
                }, ' ', {
                    iconCls: 'x-fa fa-trash',
                    handler: 'onDeleteClick',
                    isDisabled: 'isDeleteActionDisabled'
                }]
            }];

        Ext.each(gridProperties, function (item) {
            if (hiddenProperties.indexOf(item.name) < 0) {
                let col = {
                    dataIndex: item.name.replace(":", "_"),
                    text: item.title,
                    tooltip: item.title,
                    filter: {
                        type: 'string',
                        dataIndex: item.name,
                        serializer: function (filter) {
                            filter['type'] = 'STRING';
                        }
                    }
                };

                if (item.dataType === 'd:date') {
                    col.xtype = 'datecolumn';
                    col.format = first.config.Config.dateFormat;
                    col.exportRenderer = Ext.util.Format.dateRenderer(first.config.Config.dateFormat);
                    col.filter = {
                        type: 'date',
                        dataIndex: item.name,
                        dateFormat: first.config.Config.dateFormat,
                        serializer: function (filter) {
                            filter['type'] = 'DATE';
                        }
                    };

                    col.renderer = function (value, cell, record) {
                        if (item.name.split(':')[1] === 'blackLstPenaltyExpDate'
                            && new Date(record.get(item.name)).getTime() <= new Date().getTime()) {
                                cell.style = 'color: green; font-weight: 600'
                        }

                        return Ext.util.Format.date(value, first.config.Config.dateFormat)
                    }


                } else if (item.dataType === 'd:boolean') {
                    col.renderer = function (value) {
                        return value != null ? (value ? i18n.yes : i18n.no) : value;
                    };
                    col.filter = {
                        type: 'boolean',
                        dataIndex: item.name,
                        serializer: function (filter) {
                            filter['type'] = 'BOOLEAN';
                        }
                    };
                } else if ((item.constraints && me.containsConstraint(item.constraints, "LIST"))) {

                    if (item.name.split(':')[1] === 'blackListStatus') {
                        me.getView().getStore().group(item.name.replace(":", "_"));
                        col.editor = {
                            xtype: 'combo',
                            allowBlank: false,
                            displayField: 'description',
                            valueField: me.getEditorConfig(item).bindName,
                            forceSelection: true,
                            store: me.getEditorConfig(item).store,
                            listeners: {
                                focus: function (cmp) {
                                    cmp.expand();
                                }
                            }
                        }
                    }

                    col.renderer = function (val, cell) {
                        let value = i18n[val];
                        if (item.name.split(':')[1] === 'blackListStatus') {
                            switch (val) {
                                case "sanction_active":
                                    cell.style = 'color: red; font-weight: 600';
                                    break;
                                case "sanction_removed":
                                    cell.style = 'color: green; font-weight: 600';
                                    break;
                            }
                            cell.tdCls = 'first-editor-trigger-show';
                        }
                        return value ? value : val;
                    };

                    col.filter = {
                        type: 'list',
                        labelField: 'name',
                        options: first.view.registration.MetadataUtil.getAllowedValuesWithTranslations(item.constraints),
                        dataIndex: item.name,
                        serializer: function (filter) {
                            filter['type'] = 'LIST';
                        }
                    };
                }

                columns.push(col);
            }
        });

        columns.push({
            xtype: 'datecolumn',
            width: '20%',
            format: first.config.Config.dateFormat,
            dataIndex: 'createdAt',
            text: i18n.createdAt,
            filter: {
                type: 'date',
                dataIndex: 'createdAt',
                dateFormat: first.config.Config.dateFormat,
                serializer: function (filter) {
                    filter['type'] = 'DATE';
                }
            }
        });

        return columns;
    },


    isDeleteActionDisabled: function () {
        return !this.getViewModel().get('hasBlacklistDeletePermission');
    },

    isEditActionDisabled: function () {
        return !this.getViewModel().get('hasBlacklistAmendPermission');
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().getStore().reload();
    },

    onAddClick: function (comp, e, eOpts) {
        let me = this,
            childType = me.getViewModel().get('childType'),
            viewModel = new first.view.blacklist.BlacklistEditModel({
                data: {
                    isEdit: false,
                    record: Ext.create('Ext.data.Model'),
                    properties: me.getViewModel().get('gridProperties'),
                    hiddenProperties: me.getViewModel().get('hiddenProperties'),
                    type: childType.replace(':', '_'),
                    store: me.getView().getStore()
                }
            });

        this.showEditWindow(i18n.blacklistItemAdd, viewModel);
    },

    onEditClick: function (grid, r, c, btn, event, record) {
        let metaDada = this.getViewModel().get('metaDada'),
            data = {};
        Ext.Object.each(record.data, function (key, val) {
            let meta = metaDada.find(i => i.name === key);

            if (meta && meta.dataType === 'd:date') {
                val = new Date(val);
            }

            data[key] = val;
        });


        let me = this,
            childType = me.getViewModel().get('childType'),
            viewModel = new first.view.blacklist.BlacklistEditModel({
                data: {
                    isEdit: true,
                    record: record,
                    model: data,
                    properties: me.getViewModel().get('gridProperties'),
                    hiddenProperties: me.getViewModel().get('hiddenProperties'),
                    type: childType.replace(':', '_'),
                    store: me.getView().getStore()
                }
            });

        this.showEditWindow(i18n.blacklistItemAdd, viewModel);
    },

    onDeleteClick: function (grid, r, c, btn, event, record) {
        let me = this;

        Ext.Msg.confirm(i18n.delete, i18n.blacklistItemDeleteWarning, function (button) {
            if (button === 'yes') {
                let store = me.getView().getStore();
                store.remove(record);
                store.sync({
                    failure: function (batch) {
                        first.util.ErrorHandlerUtil.showErrorWindow(response);
                        store.rejectChanges();
                    }
                });
            }
        });
    },

    showEditWindow: function (title, viewModel) {
        let window = Ext.create('first.view.blacklist.BlacklistEditView', {
            title: title,
            viewModel: viewModel
        });
        window.show();
    },

    onSelectBlacklistItem: function (component, record) {
        this.fireEvent('reloadBlacklistItemDocuments', record.id);
    },

    afterRender: function () {
        let me = this;
        this.getView().getStore().load(function (records) {
            if (records && records.length > 0) {
                me.getView().getSelectionModel().select(0);
            }
        });
    },

    onSearch: function (textfield) {
        let store = this.getView().getStore();
        store.getProxy().setExtraParams({'query': textfield.value});
        store.getProxy().setHeaders({'Accept-Language': '*'});
        store.load({page: 1});
    },

    onEdit: function () {
        let store = this.getView().getStore();
        store.sync({
            callback: function () {
                store.load()
            }
        });
    },

    onBlacklistExportAfterRender: function (btn) {
        const vm = this.getViewModel();
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + "ecm/fi/report/templates?tags=BlackListExportReport",
            success: function (response) {
                let data = JSON.parse(response.responseText);
                if (data && data.length > 0) {
                    vm.set('exportTemplate', data[0]);
                    btn.enable();
                } else {
                    first.util.ErrorHandlerUtil.showReportError('Blacklist');
                }
            }
        });
    },

    onBlackListExport: function (component, e) {
        const template = this.getViewModel().get('exportTemplate'),
            store = this.getView().getStore(),
            query = store.getProxy().getExtraParams()['query'];

        let filter = [];
        for (let i of store.filters.items) {
            filter.push(i.serialize());
        }

        let url = first.config.Config.remoteRestUrl + 'ecm/fi/export/' + first.config.Config.getLanguageCode()
            + '?templateId=' + template.id + '&fileName=' + encodeURIComponent(template.name)
            + (query ? "&reportQuery=" + encodeURIComponent(query) : "")
            + (filter && filter.length > 0 ? "&reportFilter=" + encodeURIComponent(JSON.stringify(filter)) : "");

        window.open(url, '_blank');
    }
});