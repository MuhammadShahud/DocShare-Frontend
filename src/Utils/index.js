import {Platform} from 'react-native'
import Storage from '../Utils/AsyncStorage'

export const avatar = `https://www.w3schools.com/howto/img_avatar.png`
export const platform = Platform;

export async function getHeaders() {
    let token = await Storage.getToken();
    return {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
}