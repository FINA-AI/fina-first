/**
 * Created by nikoloz on 3/26/20.
 */
Ext.define('first.view.common.ExportToButton', {
    extend: 'Ext.Button',

    xtype: 'export-to-button',

    ui: 'default-toolbar',

    cls: 'dock-tab-btn',

    text: i18n.exportTo,

    menu: {
        defaults: {
            handler: 'exportTo',
            width: 124
        },
        items: [{
            text: 'Excel xlsx',
            cfg: {
                type: 'excel07',
                ext: 'xlsx'
            }
        }, {
            text: 'Excel xml',
            cfg: {
                type: 'excel03',
                ext: 'xml'
            }
        }, {
            text: 'CSV',
            cfg: {
                type: 'csv'
            }
        }, {
            text: 'TSV',
            cfg: {
                type: 'tsv',
                ext: 'csv'
            }
        }, {
            text: 'HTML',
            cfg: {
                type: 'html'
            }
        }]

    }
});