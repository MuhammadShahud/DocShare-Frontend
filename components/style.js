import { Dimensions, StyleSheet } from 'react-native';

const dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

export default StyleSheet.create({
    max: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    maxbody: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    buttonHolder: {
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
        bottom: 0,
        position: 'absolute',
        backgroundColor: 'white',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        // backgroundColor: '#0093E9',
        borderRadius: 25,
        alignSelf: "center",
        marginHorizontal: 20,
    },
    buttonCamera: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        // backgroundColor: '#0093E9',
        borderRadius: 25,
        alignSelf: "center",
        marginLeft: 20,
        marginRight: 10,
    },
    buttonAudio: {
        //paddingHorizontal: 20,
        paddingVertical: 10,
        // backgroundColor: '#0093E9',
        borderRadius: 25,
        //alignSelf: "center",
        marginRight: 20,
    },
    buttonText: {
        color: '#fff',
    },
    fullView: {
        width: dimensions.width,
        height: dimensions.height - 100,
    },
    remoteContainer: {
        width: '100%',
        height: 350,
        position: 'absolute',
        top: 5,
    },
    remote: {
        width: 150,
        height: 150,
        marginHorizontal: 2.5,
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
    padding: {
        paddingHorizontal: 2.5,
    },
});