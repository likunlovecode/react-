
class CordovaPlugin {
    static camera(fn) {
        navigator.camera.getPicture((imageData) => {
            const base64 = "data:image/jpeg;base64," + imageData;
            fn && fn(base64);
        }, (error) => {
            // alert(error);
        }, {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.PNG,
            allowEdit: true,
            targetWidth: 100, targetHeight: 100
        });
    }

    static album(fn) {
        navigator.camera.getPicture((imageData) => {
            const base64 = "data:image/jpeg;base64," + imageData;
            fn && fn(base64);
        }, (error) => {
            // alert(error);
        }, {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.PNG,
            allowEdit: true,
            targetWidth: 100, targetHeight: 100
        });
    }
}
export default CordovaPlugin;
