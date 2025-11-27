Ext.define('first.view.registration.task.shared.EditorGapsGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'editorGapsGrid',

    requires: [
        'Ext.grid.column.Date',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Grouping',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'first.store.registration.FiGapStore',
        'first.view.registration.task.shared.EditorGapsGridController'
    ],
    controller: 'editorGapsGrid',
    flex: 1,
    columnLines: true,

    store: {
        type: 'fiGapStore'
    },

    features: [{
        ftype: 'grouping',
        enableGroupingMenu: false,
        enableNoGroups: false
    }],

    columns: [{
        flex: 0,
        xtype: 'rownumberer'
    }, {
        text: i18n.gapReasonColumnTitle,
        flex: 2,
        dataIndex: 'fina_fiGapReason',
        renderer: function (content, cell, record) {
            let value = record.get('properties')['fina:fiGapReason'],
                status = record.data.properties['fina:fiGapCorrectionStatus'];
            let translatedValue = i18n[value] ? i18n[value] : value;
            if (status === 'CORRECTED') {
                return '<div style="color: green">' + translatedValue + '</div>';
            }
            return '<div style="color: red">' + translatedValue + '</div>';
        }
    }, {
        text: i18n.gapCorrectionCommentTitle,
        flex: 1,
        dataIndex: 'fina_fiGapCorrectionComment'
    }, {
        xtype: 'datecolumn',
        text: i18n.gapCorrectionDateColumnTitle,
        flex: 1,
        dataIndex: 'fina_fiGapCorrectionDate',
        format: first.config.Config.dateFormat
    }, {
        text: i18n.gapCorrectionLetterNumberColumnTitle,
        flex: 1,
        dataIndex: 'fina_fiGapCorrectionLetterNumber'
    }],


    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },
});
