Ext.define('first.util.Image', {
    statics: {
        defaultImage: 'resources/images/fi-profile/default-user.png',

        initImage: function (id, image) {
            let img = image && image !== "" ? image : this.defaultImage;
            let html = '<div class="first_img_container">' +
                '<span class="first_img_overlay" style="display:none">' +
                '<input type="file" class="first_img_input" accept="image/*">' +
                '<i class="fa fa-edit first_img_icon"></i>' +
                '</span>' +
                '<span class="first_img_object_wrap">' +
                '<img class="first_img_object" src="'+ img +'">' +
                '</span>' +
                '</div>';

            if (id){
                document.querySelector('#' + id).innerHTML = html;
            }else {
                return html;
            }
        },

        editImage: function (id) {
            let imgObject = document.querySelector('#' + id + ' .first_img_object');
            let overlay = document.querySelector('#' + id + ' .first_img_overlay');
            let mediaInput = document.querySelector('#' + id + ' .first_img_input');

            overlay.style.display = 'block';

            mediaInput.addEventListener('change', function (el) {

                let reader = new FileReader();
                reader.onload = function (e) {
                    imgObject.setAttribute('src', e.target.result);
                };

                reader.readAsDataURL(this.files[0]);
            });

        },

        saveImage: function (id, saveFunction) {
            let imgObject = document.querySelector('#' + id + ' .first_img_object');
            let src = imgObject.getAttribute('src');
            if (src === this.defaultImage) {
                src = null;
            }
            saveFunction.bind({image: src})();

            this.removeImageOverlay(id);
        },

        cancelImage: function (id, image) {
            document.querySelector('#' + id + ' .first_img_object').setAttribute('src', image?image:'resources/images/fi-profile/default-user.png');
            this.removeImageOverlay(id);
        },

        removeImageOverlay: function (id) {
            document.querySelector('#' + id + ' .first_img_overlay').style.display = 'none';
            document.querySelector('#' + id + ' .first_img_input').value = '';
        }

    }
});