Ext.define('first.view.registration.history.registration.GapGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'gapGridView',

    requires: [
        'first.view.registration.history.registration.GapGridViewController'
    ],

    controller: 'gapGridViewController',

    layout: {
        type: 'fit'
    },

    columnLines: true,

    store: {
        type: 'fiGapStore'
    },

    columns: [{
        flex: 0,
        xtype: 'rownumberer'
    }, {
        text: i18n.gapObjectColumnTitle,
        flex: 1,
        dataIndex: 'fina_fiGapObject',
        renderer: function (content, cell, record) {
            let value = record.get('properties')['fina:fiGapObject'];
            return i18n[value] ? i18n[value] : value;
        }
    }, {
        text: i18n.gapReasonColumnTitle,
        flex: 1,
        dataIndex: 'fina_fiGapReason',
        renderer: function (content, cell, record) {
            return record.get('properties')['fina:fiGapReason'];
        }
    }, {
        text: i18n.gapCorrectionCommentTitle,
        flex: 1,
        dataIndex: 'fina_fiGapCorrectionComment',
        bind: {
            hidden: '{displayCorrectionFields}'
        }
    }, {
        xtype: 'datecolumn',
        text: i18n.gapCorrectionDateColumnTitle,
        flex: 1,
        dataIndex: 'fina_fiGapCorrectionDate',
        format: first.config.Config.dateFormat,
        bind: {
            hidden: '{displayCorrectionFields}'
        }
    }, {
        text: i18n.gapCorrectionLetterNumberColumnTitle,
        flex: 1,
        dataIndex: 'fina_fiGapCorrectionLetterNumber',
        bind: {
            hidden: '{displayCorrectionFields}'
        }
    }],


    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        afterrender: 'afterRender'
    }

});