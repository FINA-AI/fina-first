Ext.define('first.view.registration.history.change.BranchChangeGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'branchChangeGridView',

    requires: [
        'first.view.registration.history.change.BranchChangeGridViewController'
    ],

    controller: 'branchChangeGridViewController',

    layout: {
        type: 'fit'
    },

    columnLines: true,

    store: {
        type: 'branchesGeneralChanges'
    },

    columns: [{
        flex: 0,
        xtype: 'rownumberer'
    }, {
        text: i18n.status,
        flex: 1,
        dataIndex: 'fina_fiBranchesChangeStatus',
        editable: false,
        renderer: function (content, cell, record) {
            return i18n[content];
        }
    }, {
        xtype: 'gridcolumn',
        text: i18n.finalStatus,
        flex: 1,
        dataIndex: 'fina_fiBranchesChangeFinalStatus',
        allowBlank: false,
        editable: false,
        renderer: function (content) {
            return content ? i18n[content] : '';
        }
    }, {
        text: i18n.comment,
        flex: 1,
        dataIndex: 'fina_fiBranchesChangeFinalStatusNote'
    }, {
        text: i18n.SUBDIVISION,
        flex: 1,
        dataIndex: 'fina_branch',
        renderer: 'branchNameRenderer'
    }, {
        xtype: 'actioncolumn',
        text: i18n.reportCardGapletter,
        flex: 1,
        menuDisabled: true,
        sortable: false,
        hideable: false,
        align: 'center',
        items: [{
            iconCls: 'x-fa fa-cloud-download-alt',
            tooltip: i18n.download,
            handler: 'onDownloadDocumentClick',
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                let properties = record.get('properties');
                return !(properties && properties['fina:fiDocument'] && properties['fina:fiDocument'].id);
            }
        }]
    }, {
        text: i18n.generateStatus,
        flex: 1,
        dataIndex: 'fina_branchDocumentGenerateStatus',
        renderer: function (content, cell, record) {
            let document = record.get('properties')['fina:fiDocument'];
            return !document ? '' : i18n['GENERATED'];
        }
    }, {
        text: i18n.generateTime,
        flex: 1,
        dataIndex: 'fina_branchDocumentGenerateDate',
        renderer: function (content, cell, record) {
            let document = record.get('properties')['fina:fiDocument'];
            return !document ? '' : Ext.Date.format(new Date(Number(document['modifiedAt'])), first.config.Config.timeFormat);
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