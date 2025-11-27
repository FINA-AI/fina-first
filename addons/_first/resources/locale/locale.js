function loadTranslations(lang) {
    var langCode = ["en_US", "ka_GE", "ru_RU"].indexOf(lang) >= 0 ? lang : "en_US";

    var file = 'resources/locale/' + langCode + '.js';
    document.write('<script type="text/javascript" src="' + file + '"></script>');
}