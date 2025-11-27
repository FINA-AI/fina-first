Ext.define('first.ux.grid.column.RowNumberer', {
    override: 'Ext.grid.column.RowNumberer',

    enableGroupContext: false,

    defaultRenderer: function (value, metaData, record, rowIdx, colIdx, dataSource, view) {
        var me = this,
            rowspan = me.rowspan,
            page = dataSource.currentPage,
            result = record ? view.store.indexOf(record) : value - 1,
            groupingFeature = this.getView().findFeature('grouping'),
            groupData;

        if (me.enableGroupContext && groupingFeature && (groupData = groupingFeature.getRecordGroup(record))) {
            result = groupData.indexOf(record);
        } else {
            if (metaData && rowspan) {
                metaData.tdAttr = 'rowspan="' + rowspan + '"';
            }

            if (page > 1) {
                result += (page - 1) * dataSource.pageSize;
            }
        }
        return result + 1;
    },

    renumberRows: function () {
        if (this.destroying || this.destroyed) {
            return;
        }

        // eslint-disable-next-line vars-on-top
        var me = this,
            view = me.getView(),
            dataSource = view.dataSource,
            recCount = dataSource.getCount(),
            context = new Ext.grid.CellContext(view).setColumn(me),
            rows = me.getView().all,
            index = rows.startIndex,
            record;

        while (index <= rows.endIndex && index < recCount) {
            context.setRow(index);
            record = dataSource.getAt(index);
            me.updater(context.getCell(true), ++index, record, view, dataSource);
        }
    }
});
