Ext.define('first.view.questionnaire.QuestionnaireGroupHeader', {
    extend: 'Ext.grid.feature.Grouping',
    alias: 'feature.checkboxGrouping',
    targetCls: 'group-checkbox',
    checkDataIndex: 'isChecked',

    constructor: function (config) {
        config.groupHeaderTpl = '<input type="checkbox" class="' + this.targetCls + '">' +  i18n.questionnaireGroupHeaderItems + ' ({rows.length})  <b>{[values.children[0].data["questionnaireParentId"]?[values.children[0].data["parentNode"].question]:""]}</b> - '+ i18n.questionnaireGroupHeaderMandatory +' ({[values.children[0].data["checkSize"]]})';
        this.callParent(arguments);
    },

    init: function (grid) {
        this.callParent(arguments);
    },


    onGroupClick: function (grid, node, group, event, eOpts) {
        if (event && grid) {
            var target = event.getTarget('.' + this.targetCls);
            var store = grid.getStore();
            var groupRecord = this.getRecordGroup(event.record);
            if (target && store && groupRecord) {
                var checked = target.checked;
                let recordArr = checked ? grid.getSelectionModel().getSelection() : [];
                groupRecord.each(function (rec, index) {
                    recordArr.push(rec);
                }, this);

                if (checked) {
                    grid.getSelectionModel().select(recordArr);
                } else {
                    grid.getSelectionModel().deselect(recordArr);
                }

            } else {
                this.callParent(arguments);
            }
        }
    }

});