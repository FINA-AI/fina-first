Ext.define('first.config.Config', {

    singleton: true,

    constructor: function () {
        // ./resources/config/
        var obj = loadConfig();
        obj.getLanguageCode = function () {
            var langCode = Ext.util.Cookies.get("locale");
            langCode = langCode ? langCode : 'en_US';
            return langCode;
        };
        obj.historyTokenItemId = function () {
            return Ext.History.getToken().split('/')[1];
        };

        obj.supportedExtensions = {
            doc: 'ms-word',
            docx: 'ms-word',
            docm: 'ms-word',
            dot: 'ms-word',
            dotx: 'ms-word',
            dotm: 'ms-word',
            xls: 'ms-excel',
            xlsx: 'ms-excel',
            xlsb: 'ms-excel',
            xlsm: 'ms-excel',
            xlt: 'ms-excel',
            xltx: 'ms-excel',
            xltm: 'ms-excel',
            ppt: 'ms-powerpoint',
            pptx: 'ms-powerpoint',
            pot: 'ms-powerpoint',
            potx: 'ms-powerpoint',
            potm: 'ms-powerpoint',
            pptm: 'ms-powerpoint',
            pps: 'ms-powerpoint',
            ppsx: 'ms-powerpoint',
            ppam: 'ms-powerpoint',
            ppsm: 'ms-powerpoint',
            sldx: 'ms-powerpoint',
            sldm: 'ms-powerpoint'
        };

        obj.dateFormat = 'd/m/Y';
        obj.timeFormat = 'd/m/Y H:i:s';
        obj.timeFormatCustom = 'd/m/Y g:i A';

        return obj;
    }


});