Ext.define('first.view.registration.FiProfileHistoriesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiProfileHistoriesEcm',

    requires: [
        'Ext.data.Model',
        'Ext.data.Store',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'first.config.Config',
        'first.view.registration.MetadataUtil'
    ],

    required: [],

    init: function () {

        let me = this,
            vm = me.getViewModel(),
            recordId = vm.get('recordId'),
            recordType = vm.get('recordType'),
            isComplexStructureItem = vm.get('isComplexStructureItem'),
            columns = [];

        let view = me.createGrid(me, recordId);
        me.getView().add(view);

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + recordType.replace(':', '_') + '/properties',
            method: 'GET',
            callback: function (options, success, response) {
                let metaDada = JSON.parse(response.responseText),
                    hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(recordType, metaDada),
                    questions = me.getItemQuestions(recordType, metaDada, isComplexStructureItem);

                vm.set('metaDada', metaDada);
                vm.set('hiddenProperties', hiddenProperties);

                columns.push({
                    width: 200,
                    dataIndex: 'cm:versionLabel',
                    text: i18n.version
                });

                columns.push({
                    width: 200,
                    dataIndex: 'modifiedAt',
                    text: i18n.taskItemGridModifiedAt,
                    xtype: 'datecolumn',
                    format: first.config.Config.timeFormatCustom,
                });

                columns.push({
                    width: 200,
                    dataIndex: 'modifiedBy',
                    text: i18n.taskItemGridModifiedBy,
                });

                columns.push({
                    width: 200,
                    dataIndex: 'lastEditorFullName',
                    text: i18n.editor
                });

                let questionNotes = [];
                Ext.each(questions, function (question) {
                    questionNotes.push(question + 'Note');
                });

                Ext.each(metaDada, function (item) {
                    if (hiddenProperties.indexOf(item.name) < 0) {
                        let col = {
                            width: 200,
                            dataIndex: item.name,
                            text: item.title,
                            tooltip: item.title
                        };

                        if (Ext.Array.contains(questions, item.name) || Ext.Array.contains(questionNotes, item.name)) {
                            col.hidden = true;
                        }

                        if (item.dataType === 'd:date') {
                            col.xtype = 'datecolumn';
                            col.format = first.config.Config.dateFormat;
                        }

                        if (item.dataType === 'd:boolean') {
                            col.renderer = function (value) {
                                return value != null ? (value ? i18n.yes : i18n.no) : value;
                            }
                        } else if ((item.constraints && me.containsConstraint(item.constraints, "LIST"))) {
                            col.renderer = function (value) {
                                if (Array.isArray(value)) {
                                    return value.map(d => (i18n[d] ? i18n[d] : d));
                                }
                                return i18n[value] ? i18n[value] : value;
                            };
                        }
                        columns.push(col);
                    }
                });

                view.setColumns(columns);
            }
        });
    },

    getItemQuestions: function (recordType, metaData, isComplexStructure) {
        if (!isComplexStructure) {
            return first.view.registration.MetadataUtil.getQuestions(recordType, metaData);
        }

        const allQuestions = [];

        const physicalQuestions = first.view.registration.MetadataUtil.getQuestions(recordType + 'PHYSICAL', metaData),
            legalQuestions = first.view.registration.MetadataUtil.getQuestions(recordType + 'LEGAL', metaData);

        if (physicalQuestions) {
            Array.prototype.push.apply(allQuestions, physicalQuestions);
        }

        if (legalQuestions) {
            Array.prototype.push.apply(allQuestions, legalQuestions);
        }

        return allQuestions;
    },

    containsConstraint: function (constraints, type) {
        let res = false;
        Ext.each(constraints, function (constraint) {
            if (constraint.type === type) {
                res = true;
            }
        });
        return res;
    },

    createGrid: function (me, recordId) {
        return Ext.create({
            xtype: 'grid',
            viewModel: me.getView().getViewModel(),
            store: me.createStore(recordId),

            scrollable: true,
            columnLines: true,

            bind: {
                selection: '{selectedNode}'
            },

            columns: [],

            bbar: {
                xtype: 'pagingtoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                }
            }
        });
    },

    createStore: function (recordId) {
        return Ext.create('Ext.data.Store', {
            model: 'Ext.data.Model',

            fields: [],

            nodeParam: 'parentId',

            proxy: {
                type: 'rest',
                enablePaging: true,
                url: first.config.Config.remoteRestUrl + 'ecm/node/version/' + recordId,
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
                                            props.modifiedAt = new Date(record.modifiedAt - 100);
                                            props.modifiedBy = record.modifiedByUser.displayName
                                                ? record.modifiedByUser.displayName.split(' ').map(d => d === 'NONAME' ? '' : d).join(' ')
                                                : record.modifiedByUser.createdBy.id;
                                            props.lastEditorFullName = record.properties['fina:fiRegistryLastEditorFullName'];
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
        });
    }
});
