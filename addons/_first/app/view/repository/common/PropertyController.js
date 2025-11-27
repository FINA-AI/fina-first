/**
 * Created by oto on 6/6/19.
 */
Ext.define('first.view.repository.common.PropertyController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.propertyController',

    requires: [
        'Ext.util.Format',
        'first.config.Config'
    ],


    /**
     * Called when the view is created
     */
    init: function () {

    },

    loadNodeProperties: function (record) {
        let me = this;
        if (!record) {
            return;
        }
        me.getViewModel().set('record', record);

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + "ecm/node/" + record.get('id') + '/full',
            callback: function (o, success, response) {
                if (success) {
                    let result = JSON.parse(response.responseText);
                    record.set('classProperties', result.classProperties);
                    record.set('properties', result.properties);
                    me.drawProperties(record);
                }
                me.getView().unmask();
            }
        })
    },


    drawProperties: function (record) {
        let me = this;
        me.getViewModel().set('isPropertyEditMode', false);

        if (!this.getView()) {
            return;
        }
        let propertyContainerPanel = Ext.create({
            xtype: 'form',
            scrollable: true,
            margin: 5,
            flex: 1,
            items: []
        });

        propertyContainerPanel.add(me.createField(i18n.taskItemGridName, record.get('name')));
        propertyContainerPanel.add(me.createField(i18n.taskItemGridCreatedBy, record.get('createdBy') ? record.get('createdBy')['displayName'] : ''));
        propertyContainerPanel.add(me.createField(i18n.taskItemGridCreatedAt, Ext.Date.format(record.get('createdAt'), first.config.Config.dateFormat)));
        propertyContainerPanel.add(me.createField(i18n.taskItemGridModifiedBy, record.get('modifiedBy') ? record.get('modifiedBy')['displayName'] : ''));
        propertyContainerPanel.add(me.createField(i18n.taskItemGridModifiedAt, Ext.Date.format(record.get('modifiedAt'), first.config.Config.dateFormat)));

        if (record.get('file') && record.get('content')) {
            propertyContainerPanel.add(me.createField(i18n.mimeType, record.get('content')['mimeTypeName']));
            propertyContainerPanel.add(me.createField(i18n.size, Ext.util.Format.fileSize(record.get('content')['sizeInBytes'])))
        }

        let hiddenProperties = [];
        
        //if super admin show hidden properties also
        if (!first.config.Config.conf.properties.currentUser.superAdmin) {
            hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(record.get('nodeType'), record.get('classProperties'));
        }

        if (record.get('classProperties') && record.get('properties')) {
            Ext.each(record.get('classProperties'), function (prop) {
                if (hiddenProperties.indexOf(prop.name) < 0 && prop['title'] && prop['description'] !== 'Content' && prop['description'] !== 'Name' && prop.name !== 'cm:content' && prop.name !== 'cm:name') {
                    me.getViewModel().set('theFi', record.data);
                    me.getViewModel().set('model', record.data);
                    let value = record.get('properties')[prop['name']];
                    let name = prop.name.replace(':', '_');
                    let generatedFormItem = first.view.registration.MetadataUtil.getFormItemXType(prop, name, me.getViewModel(), 'model', []);
                    generatedFormItem.readOnly = true;
                    generatedFormItem.disabled = false;
                    generatedFormItem.name = name;
                    generatedFormItem.width = '100%';

                    if (prop.dataType === 'd:date' && value) {
                        value = new Date(value);
                    }

                    generatedFormItem.value = value;
                    propertyContainerPanel.add(generatedFormItem);
                }
            });
        }

        // check uuid existence
        if (record && record.get('properties') && record.get('properties')['fina:uuidCode']) {
            propertyContainerPanel.add(me.createField('UUID', record.get('properties')['fina:uuidCode']));
        }

        //check report template aspects
        if (record && record.get('properties')) {
            let recordProperties = record.get('properties');
            if (recordProperties.hasOwnProperty('fina:reportName')) {
                let field = me.createField(i18n['reportName'], recordProperties['fina:reportName']);
                field.name = 'fina_reportName';
                propertyContainerPanel.add(field);
            }

            if (recordProperties.hasOwnProperty('fina:startRow')) {
                let field = me.createField(i18n['startRow'], recordProperties['fina:startRow'], 'numberfield');
                field.name = 'fina_startRow';
                propertyContainerPanel.add(field);
            }
            if (recordProperties.hasOwnProperty('fina:startColumn')) {
                let field = me.createField(i18n['startColumn'], recordProperties['fina:startColumn'], 'numberfield');
                field.name = 'fina_startColumn';
                propertyContainerPanel.add(field);
            }
            if (recordProperties.hasOwnProperty('fina:enableRowNumbering')) {
                let prop = {
                    constraints: [],
                    dataType: 'd:boolean',
                    name: 'fina_enableRowNumbering',
                    title: i18n['enableRowNumbering']
                };
                let generatedFormItem = first.view.registration.MetadataUtil.getFormItemXType(prop, 'fina_enableRowNumbering', me.getViewModel(), 'model', []);
                generatedFormItem.readOnly = true;
                generatedFormItem.disabled = false;
                generatedFormItem.name = 'fina_enableRowNumbering';
                generatedFormItem.value = record.get('properties')['fina:enableRowNumbering'];
                generatedFormItem.width = '100%';
                propertyContainerPanel.add(generatedFormItem);
            }
            if (recordProperties.hasOwnProperty('fina:showDateCellAddress')) {
                let field = me.createField(i18n['dateCellAddress'], recordProperties['fina:dateCellAddress']);
                field.name = 'fina_dateCellAddress';
                propertyContainerPanel.add(field);
            }
        }

        this.getView().removeAll(true);
        this.getView().add(propertyContainerPanel);
        this.initTags(propertyContainerPanel, record.get('id'));
    },


    createField: function (name, value, fieldType) {
        return Ext.create({
            xtype: fieldType ? fieldType : 'textfield',
            readOnly: true,
            fieldLabel: name,
            value: value,
            width: '100%'
        })
    },

    onEditPropertiesClick: function () {
        let me = this,
            editMode = !me.getViewModel().get('isPropertyEditMode');
        me.bindFields(editMode);
    },

    bindFields: function (editMode) {
        let form = this.getView().down('form'),
            tagField = this.lookupReference('nodeTagField');

        this.getViewModel().set('isPropertyEditMode', editMode);
        if (editMode) {
            form.items.each(function (item) {
                item.setReadOnly(false);
                item.setDisabled(item.name.indexOf('_') < 0);
            });
        } else {
            form.items.each(function (item) {
                item.setReadOnly(true);
                item.setDisabled(false);
            });
        }

        tagField.setReadOnly(!editMode);
        tagField.setDisabled(!editMode);
    },

    onSavePropertiesClick: function () {
        let me = this,
            record = me.getViewModel().get('record'),
            form = me.getView().down('form');
        if (form.isDirty()) {
            me.updateNodeProperties(record, form);
        } else {
            me.bindFields(false);
        }

        this.updateNodeTags(record.get('id'));
    },

    updateNodeProperties: function (record, form) {
        let me = this,
            data = form.getForm().getFieldValues(true),
            properties = {};

        if (data) {
            me.getView().mask(i18n.pleaseWait);

            Ext.Object.each(data, function (key, val) {
                properties[key.replace('_', ':')] = val;
            });

            Ext.Ajax.request({
                method: 'PUT',
                jsonData: {'properties': properties},
                url: first.config.Config.remoteRestUrl + "ecm/node/" + record.get('id'),
                callback: function (o, success, response) {
                    me.bindFields(false);
                    me.getView().unmask();
                }
            })

        }
    },

    initTags: function (propertyContainerPanel, nodeId) {

        this.getViewModel().set('node.tags.added', []);
        this.getViewModel().set('node.tags.removed', []);

        let tagField = Ext.create('Ext.form.field.Tag', {
            reference: 'nodeTagField',
            fieldLabel: i18n.tags,
            width: '100%',
            store: {
                type: 'tagStore'
            },
            displayField: 'tag',
            valueField: 'id',
            queryMode: 'local',
            filterPickList: true,
            readOnly: true,
            createNewOnEnter: true,
            createNewOnBlur: true,
            listeners: {
                beforeselect: 'beforeTagAdded',
                beforedeselect: 'beforeTagRemoved'
            }
        });
        propertyContainerPanel.add(tagField);

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/tag/node/' + nodeId,
            callback: function (o, success, response) {
                if (success) {
                    let result = JSON.parse(response.responseText),
                        tagValues = [];
                    if (result && result.list && result.list.length > 0) {
                        Ext.each(result.list, function (tag) {
                            tagValues.push(tag.id);
                        });
                        tagField.setValue(tagValues);
                    }
                }
            }
        });
    },

    beforeTagAdded: function (combo, record, index, eOpts) {
        let addedTags = this.getViewModel().get('node.tags.added'),
            removedTags = this.getViewModel().get('node.tags.removed');

        addedTags.push(record.data);
        Ext.Array.remove(removedTags, record.data);
    },

    beforeTagRemoved: function (combo, record, index, eOpts) {
        let removedTags = this.getViewModel().get('node.tags.removed'),
            addedTags = this.getViewModel().get('node.tags.added');

        removedTags.push(record.data);
        Ext.Array.remove(addedTags, record.data);
    },

    updateNodeTags: function (nodeId) {
        let me = this,
            jsonData = {
                addedTags: this.getViewModel().get('node.tags.added'),
                removedTags: this.getViewModel().get('node.tags.removed')
            };

        this.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/tag/node/update/multi/' + nodeId,
            jsonData: jsonData,
            callback: function (o, success, response) {
                me.getView().unmask();
                if (!success) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                } else {
                    me.getViewModel().set('node.tags.added', []);
                    me.getViewModel().set('node.tags.removed', []);
                }
            }
        });
    }

});
