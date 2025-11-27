Ext.define('first.view.attestation.AttestationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.attestation',

    init: function () {
        this.initGrid();
    },

    initGrid: function () {
        let me = this,
            view = me.getView();

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + "ecm/node/-root-?relativePath=fina2first/Attestations",
            success: function (res) {
                let node = JSON.parse(res.responseText);
                if (node) {
                    let childType = node.properties['fina:folderConfigChildType'],
                        prefix = childType.split(":")[0];
                    me.getViewModel().set('prefix', prefix);

                    Ext.Ajax.request({
                        url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + childType.replace(':', '_') + '/properties',
                        method: 'GET',
                        callback: function (options, success, response) {
                            let metaDada = JSON.parse(response.responseText),
                                hiddenProperties = first.view.registration.MetadataUtil.getMetaDataConstraintFields(childType, metaDada, 'HiddenFieldNames'),
                                gridProperties = first.view.registration.MetadataUtil.getMetaDataConstraintFields(childType, metaDada, 'Sequence'),
                                detailProperties = first.view.registration.MetadataUtil.getMetaDataConstraintFields(childType, metaDada, 'DetailsSequence');

                            me.getViewModel().set('metaDada', metaDada);
                            me.getViewModel().set('hiddenProperties', hiddenProperties);
                            me.getViewModel().set('gridProperties', gridProperties);
                            me.getViewModel().set('detailProperties', detailProperties);

                            view.setColumns(me.generateColumns(gridProperties, hiddenProperties));

                            const rowExpander = view.findPlugin('rowexpander');
                            if (rowExpander) {
                                me.setupRowExpander(rowExpander, detailProperties);
                            }
                        }
                    });
                }
            }
        });
    },

    setupRowExpander: function (rowExpander, detailProperties) {
        const me = this,
            documents = ['ATTESTATION_SHEET', 'ATTESTATION_REJECTION_LETTER', 'ATTESTATION_REJECTION_INTERVIEW_LETTER',
                'ATTESTATION_CONFIRMATION_LETTER', 'ATTESTATION_INVITATION_LETTER', 'ATTESTATION_BOARD_DECISION_DRAFT'],
            longAttestationDocs = ['ATTESTATION_REJECTION_LETTER', 'ATTESTATION_REJECTION_INTERVIEW_LETTER',
                'ATTESTATION_INVITATION_LETTER', 'ATTESTATION_BOARD_DECISION_DRAFT'],
            shortAttestationDocs = ['ATTESTATION_REJECTION_LETTER', 'ATTESTATION_CONFIRMATION_LETTER'];

        let html = '<tpl><div style="display: flex;"><div style="flex: 0 0 50%">';
        for (let i = 0; i < detailProperties.length; i++) {
            let detail = detailProperties[i];
            let detailName = detail.name.replace(":", "_"),
                hasConstraints = detail.constraints && me.containsConstraint(detail.constraints, "LIST");

            html += "<b>" + detail.title + ':</b> {[this.customRenderer(values.' + detailName + ", \"" + detail.dataType + '\", ' + hasConstraints + ')]}' + '<br>';

            if (i === detailProperties.length / 2 - 1) {
                html += '</div><div style="flex: 1;">'
            }
        }
        html += '</div></div><hr>';

        html += "<b>" + i18n.documents + ":</b> ";
        for (let doc of documents) {
            html += '<span>{[this.drawDocument(values, \"' + doc + '\")]}</span>';
        }

        html += '</tpl>';

        rowExpander.rowBodyTpl.html = html;
        rowExpander.rowBodyTpl.customRenderer = function (value, type, hasConstraints) {
            if (![null, undefined].includes(value)) {
                switch (type) {
                    case "d:date": {
                        return Ext.Date.format(new Date(value), 'Y-m-d');
                    }
                    case "d.boolean": {
                        return value ? i18n.yes : i18n.no;
                    }
                }

                if (hasConstraints && i18n[value]) {
                    return i18n[value];
                }
            }

            return value || "";
        };

        rowExpander.rowBodyTpl.drawDocument = function (values, docType) {
            let attestationType;
            for (let i in values) {
                if (i.endsWith("fiAttestationType")) {
                    attestationType = values[i];
                    break;
                }
            }
            if ((attestationType === 'LONG' && longAttestationDocs.includes(docType))
                || (attestationType === 'SHORT' && shortAttestationDocs.includes(docType))) {

                let buttonStyle = 'cursor:pointer;color:grey; padding: 3px';

                return " <span class='finaSecondaryBtn' style='" + buttonStyle + "' id='generate_" + docType + "-" + values.id +
                    "'><i class=\"fas fa-cog\"></i>" + i18n[docType] +  "</span> "
                    + (['ATTESTATION_CONFIRMATION_LETTER', 'ATTESTATION_BOARD_DECISION_DRAFT'].includes(docType) ? "" : " | ");
            }
        }
    },

    generateColumns: function (gridProperties, hiddenProperties) {
        let me = this,
            columns = [{
                xtype: 'actioncolumn',
                width: 60,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                items: [{
                    iconCls: 'x-fa fa-edit icon-margin',
                    tooltip: i18n.edit,
                    handler: 'onEditClick',
                }, {
                    iconCls: 'x-fa fa-print',
                    tooltip: i18n.ATTESTATION_SHEET,
                    handler: 'onAttestationSheetClick',
                }]
            }];

        Ext.each(gridProperties, function (item) {
            if (hiddenProperties.indexOf(item.name) < 0) {
                let col = {
                    width: '20%',
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
                    col.filter = {
                        type: 'date',
                        dataIndex: item.name,
                        dateFormat: first.config.Config.dateFormat,
                        serializer: function (filter) {
                            filter['type'] = 'DATE';
                        }
                    };
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
                    let colName = item.name.split(':')[1];

                    if (colName ===  'fiAttestationStatus' || colName === 'fiAttestationInterviewStatus') {

                        if (colName ===  'fiAttestationStatus') {
                            me.getView().getStore().group(me.getEditorConfig(item).bindName);
                        }

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

                        if (colName ===  'fiAttestationStatus') {
                            switch (val) {
                                case "underReview":
                                case "inQueue":
                                case "inAttestationList":
                                    cell.style = 'color: #c6a700; font-weight: 600';
                                    break;
                                case "declined":
                                case "candidateDisapproved":
                                    cell.style = 'color: red; font-weight: 600';
                                    break;
                                case "recognized":
                                case "candidateApproved":
                                    cell.style = 'color: green; font-weight: 600';
                                    break;
                            }

                            cell.tdCls =  'first-editor-trigger-show';

                        } else if (item.name.split(':')[1] === 'fiAttestationInterviewStatus') {
                            switch (val) {
                                case "PENDING":
                                    cell.style = 'color: #c6a700; font-weight: 600';
                                    break;
                                case "DECLINED":
                                    cell.style = 'color: red; font-weight: 600';
                                    break;
                                case "ACCEPTED":
                                    cell.style = 'color: green; font-weight: 600';
                                    break;
                            }

                            cell.tdCls =  'first-editor-trigger-show';

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
            hidden: true,
            filter: {
                type: 'date',
                dataIndex: 'createdAt',
                dateFormat: first.config.Config.dateFormat,
                serializer: function (filter) {
                    filter['type'] = 'DATE';
                }
            }
        });

        columns.push({
            width: '20%',
            dataIndex: 'createdAt',
            text: i18n.daysFromAttestation,
            tooltip: i18n.daysFromAttestation,
            renderer: function (value, cell, record) {
                let daysFromRegistration = Math.floor((new Date() - record.get('createdAt')) / (24 * 60 * 60 * 1000));

                if (daysFromRegistration >= 0 && daysFromRegistration < 30) {
                    cell.style = 'color: green; font-weight: 600';
                } else if (daysFromRegistration > 30 && daysFromRegistration < 60) {
                    cell.style = 'color: #c6a700; font-weight: 600';
                } else {
                    cell.style = 'color: red; font-weight: 600';
                }

                return daysFromRegistration
            }
        });

        return columns;
    },

    getPropertyNameBySuffix: function (suffix) {
        let metaDada = this.getViewModel().get('metaDada');
        for (let item of metaDada) {
            if (item.name.endsWith(suffix)) {
                return item.name;
            }
        }
        return null;
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

    onEditClick: function (view, recIndex, cellIndex, item, e, record) {
        let data = {};
        let title = record.get(this.getPropertyNameBySuffix('fiPersonFirstName').replace(":", "_")) + " " +
            record.get(this.getPropertyNameBySuffix('fiPersonLastName').replace(":", "_")) + " " +
            record.get(this.getPropertyNameBySuffix('fiPersonPersonalNumber').replace(":", "_"));

        let window = Ext.create({
            xtype: 'attestationWindow',
        });

        Ext.Object.each(record.data, function (key, val) {
            key = key.substring(key.indexOf("_") + 1);
            data[key] = val;
        });

        window.getViewModel().set('prefix', this.getViewModel().get('prefix'));
        window.getViewModel().set('record', data);
        window.getViewModel().set('title', title);
        window.getViewModel().set('store', this.getView().getStore());

        window.show();
    },

    onAttestationSheetClick: function (view, recIndex, cellIndex, item, e, record) {
        this.generateDocument(record.id, "ATTESTATION_SHEET");
    },

    translateRenderer: function (val) {
        let value = i18n[val];
        return value ? value : val;
    },

    onItemClick: function (component, record, cell, roIndex, e) {
        let me = this,
            elementTarget = e.getTarget('span');

        this.fireEvent('reloadAttestationDocuments', record.id);

        if (elementTarget) {
            let name = elementTarget.id,
                nodeId = record.id;
            if (name.startsWith("generate_")) {
                let docType = name.replace("generate_", "").split("-")[0];
                me.generateDocument(nodeId, docType, record);
            } else if (name.startsWith("download_")) {
                let docType = name.replace("download_", "").split("-")[0];
                if (record.get(docType)) {
                    this.downloadDocument(record.get(docType).id);
                }
            }
        }
    },

    generateDocument: function (nodeId, docType, record) {
        let me = this;
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/attestation/document/generate/' + nodeId + "/" + docType,
            method: 'POST',
            success: function (response) {
                let file = JSON.parse(response.responseText);
                me.downloadDocument(file.id);
                if (record) {
                    record.set(docType, file);
                    this.fireEvent('refreshAttestationDocuments');
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        })
    },

    downloadDocument: function (id) {
        window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + id + '/content?attachment=true');
    },

    onGenerateCandidatesListLong: function() {
        let filter = {};
        filter[this.getViewModel().get('prefix') + ":fiAttestationStatus"] = "inQueue";
        filter[this.getViewModel().get('prefix') + ":fiAttestationType"] = "LONG";
        this.onGenerateCandidatesList('ATTESTATION_IN_QUEUE_CANDIDATES_LONG', filter);
    },

    onGenerateCandidatesListShort: function() {
        let filter = {};
        filter[this.getViewModel().get('prefix') + ":fiAttestationStatus"] = "inQueue";
        filter[this.getViewModel().get('prefix') + ":fiAttestationType"] = "SHORT";
        this.onGenerateCandidatesList('ATTESTATION_IN_QUEUE_CANDIDATES_SHORT', filter);
    },

    onGenerateCandidatesList: function (docType, filter) {
        let me = this;
        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/attestation/document/generate/' + docType
                + (filter ? "?filter=" + encodeURIComponent(JSON.stringify(filter)) : ""),
            method: 'POST',
            success: function (response) {
                let file = JSON.parse(response.responseText);
                me.downloadDocument(file.id);
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        })
    },

    onSearch: function (textfield) {
        let store = this.getView().getStore();
        store.getProxy().setExtraParams({'query': textfield.value});
        store.getProxy().setHeaders({'Accept-Language': '*'});
        store.load({page: 1});
    },

    onAttestationExportAfterRender: function (btn) {
        const vm = this.getViewModel();
        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + "ecm/fi/report/templates?tags=AttestationExportReport",
            success: function (response) {
                let data = JSON.parse(response.responseText);
                if (data && data.length > 0) {
                    vm.set('exportTemplate', data[0]);
                    btn.enable();
                } else {
                    first.util.ErrorHandlerUtil.showReportError('Attestations');
                }
            }
        });
    },

    onAttestationExport: function () {
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
    },

    getEditorConfig: function (item) {
        let bindName = item.name.replace(':', '_'),
            data = [];

        item.constraints[0].parameters[0].allowedValues.forEach((value) => data.push({description: i18n[value], [bindName]: value}));

        const store = Ext.create('Ext.data.Store', {
            fields: [item.name.replace(':', '_'), 'description'],
            data: data
        });

        return {store: store, bindName: bindName}
    },

    onEdit: function (editor, context) {
        let view = this.getView(),
            record = context.record.getData(),
            store = context.record.store,
            prefix = context.column.dataIndex.split('_')[0],
            properties = {},
            propNames = ['fiAttestationStatus', 'fiAttestationInterviewStatus'];

        if (context.originalValue !== context.value) {

            view.mask(i18n.pleaseWait);

            for (let i of propNames) {
                properties[prefix + ":" + i] = record[prefix + '_' + i];
            }
            Ext.Ajax.request({
                method: 'PUT',
                url: first.config.Config.remoteRestUrl + "ecm/node/" + record.id,
                jsonData: {
                    properties: properties
                },
                success: function (response) {
                    store.load();
                    view.unmask();
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                    view.unmask();
                }
            });
        }
    }
});
