Ext.define('first.view.registration.complexStructure.ComplexStructureView', {
    extend: 'Ext.panel.Panel',

    xtype: 'complexStructureView',

    controller: 'complexStructure',

   /* layout: {
        type: 'fit',
    },*/

    items: [
        {
            xtype: 'panel',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'complexStructureTreeView',
                    reference: 'complexStructureTreeView',
                    scrollable: true,
                    flex: 1

                }, {
                    xtype: 'panel',
                    layout: {
                        type: 'fit'
                    },
                    reference: 'beneficiariesGridView',
                    items: [],
                    flex: 1
                }
            ]
        }

    ]
});
