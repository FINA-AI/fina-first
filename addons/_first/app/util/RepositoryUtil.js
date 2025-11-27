Ext.define('first.util.RepositoryUtil', {

    statics: {

        getNodeIcon: function (record, fontSize) {
            if (record.get('file') || record.get('content')) {
                if (!record.get('content')) {
                    return '<i class="fa fa-file ' + fontSize + '"></i>';
                }

                let mimeType = record.get('content').mimeType ? record.get('content').mimeType.toLowerCase() : null;

                switch (mimeType) {
                    case 'application/pdf':
                        return '<i class="fa fa-file-pdf ' + fontSize + '" style="color: red"></i>';
                    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    case 'application/vnd.oasis.opendocument.spreadsheet':
                    case 'application/vnd.ms-excel.sheet.macroenabled.12':
                    case 'application/vnd.ms-excel':
                        return '<i class="fa fa-file-excel ' + fontSize + '" style="color: green"></i>';
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        return '<i class="fa fa-file-word ' + fontSize + '" style="color: blue"></i>';
                    case 'image/png':
                    case 'image/jpeg':
                    case 'image/jpg':
                    case 'image/gif':
                    case 'image/bmp':
                    case 'image/svg+xml':
                    case 'image/tiff':
                        return '<i class="fa fa-file-image ' + fontSize + '" style="color: red"></i>';
                    case 'text/html':
                        return '<i class="fa fa-html5 ' + fontSize + '" style="color: red"></i>';
                    case 'application/vnd.ms-powerpoint':
                        return '<i class="fa fa-file-powerpoint ' + fontSize + '" style="color: #ff5d10"></i>';
                    case 'application/vnd.ms-project':
                        return '<i class="fa fa-html5 ' + fontSize + '" style="color: red"></i>';
                    case 'application/x-msaccess':
                        return '<i class="fa fa-database ' + fontSize + '" style="color: black"></i>';
                    case 'application/zip':
                        return '<i class="fa fa-file-archive ' + fontSize + '" style="color: black"></i>';
                    case 'text/plain':
                    case 'text/richtext':
                        return '<i class="fa fa-file-text ' + fontSize + '" style="color: black"></i>';
                    default :
                        return '<i class="fa fa-file ' + fontSize + '" style="color: black"></i>';
                }
            } else {
                return '<i class="fa fa-folder-open ' + fontSize + '" style="color: #F2CF0B;"></i>'
            }
        }
    }


});