import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
    static getToken = async () => {
        try {
            return await AsyncStorage.getItem('@token');
        } catch (e) {
            return null;
        }
    };
    static setToken = async token => {
        try {
            return await AsyncStorage.setItem('@token', token);
        } catch (e) {
            return null;
        }
    };
    static set = async (key, value) => {
        try {
            return await AsyncStorage.setItem(key, value);
        } catch (e) {
            return null;
        }
    };
    static get = async key => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (e) {
            return null;
        }
    };
    static clearStorage = async () => {
        try {
            return await AsyncStorage.clear();
        } catch (e) {
            return null;
        }
    };
}

export default Storage;
