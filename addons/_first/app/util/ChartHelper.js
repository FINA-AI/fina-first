Ext.define('first.util.ChartHelper', {
    statics: {
        calculateChartParams: function (data) {
            let max = 10,
                step = 10;

            if (data && data.length > 0) {
                max = Math.max.apply(Math, data.map(record => (record.get('value'))));
                step = -1;
                let segments = [1, 2, 5, 10];

                for (let i = 0, c = 1; i < segments.length, step < 0, c < 10000; i++, c *= 10) {
                    for (let segment of segments) {
                        segment *= c;

                        if (Math.ceil(max / segment) <= 10) {
                            step = Math.ceil(max / segment);
                            max = step * segment;
                            i = segments.length;
                            c = 10000;
                            break;
                        }
                    }
                }
            }

            return {
                max: max,
                step: step
            }
        }
    }
});