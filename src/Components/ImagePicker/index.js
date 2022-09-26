import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const OpenImagePicker = (callback, multiple = false, title = '') => {
    // const options = {
    //   title: 'Select Avatar',
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images',
    //   },
    // };
    // try {
    //   ImagePicker.showImagePicker(options, response => {
    //     console.warn(response);
    //     if (response.didCancel) {
    //       //console.warn('User cancelled image picker');
    //     } else if (response.error) {
    //       // console.warn(response.error)
    //     } else if (response.customButton) {
    //       console.log('User tapped custom button: ', response.customButton);
    //     } else {
    //       console.warn(response);
    //     }
    //   });
    // } catch (error) {
    //   console.warn(error);
    //   // ShowSnack('Error while uploading image');
    // }
    Alert.alert(
        'Options',
        'Select one option to continue',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Camera',
                style: 'default',
                onPress: async () => {
                    try {
                        var image = await ImagePicker.openCamera({
                            multiple: false,
                            width: 200,
                            height: 200,
                        });

                        if (image || image.length > 0) {
                            callback(image);
                        }
                    } catch (error) {
                        console.warn(error);
                        // Alert.alert('Error while uploading image');
                    }
                },
            },
            {
                text: 'Library',
                style: 'default',
                onPress: async () => {
                    try {
                        var image = await ImagePicker.openPicker({
                            multiple: multiple,
                            width: 200,
                            height: 200,
                        });
                        if (image || image.length > 0) {
                            callback(image);
                        }
                        // else {
                        //   Alert.alert({
                        //     text: 'Image is not selected',
                        //   });
                        // }
                    } catch (error) {
                        console.warn('err ==', error);
                        // Alert.alert('Error while uploading image');
                    }
                },
            },
        ],
        { cancelable: true },
    );
};

export { OpenImagePicker };
