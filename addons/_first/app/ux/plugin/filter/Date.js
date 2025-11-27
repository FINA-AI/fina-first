Ext.define('first.ux.plugin.filter.Date', {
    override: 'Ext.grid.filters.filter.Date',

    getSerializer : function () {
        return this.serializer.bind(this);
    },

    serializer : function (filter) {
        let value = filter.value;
        if (value) {
            filter.value = Ext.Date.format(value, this.getDateFormat());
        }
    }
});