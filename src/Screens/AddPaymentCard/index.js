import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Header, SearchBar, TextInput } from '../../Components';
import { Colors } from '../../Styles';
import { back_arror_white } from '../../Assets'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import PaymentMiddleware from '../../Store/Middleware/PaymentMiddleware'
import CustomAlert from '../../Components/CustomAlert'


export default function AddPaymentCard({ route }) {
    const navigation = useNavigation()
    const [name, setname] = useState(false)
    const [cardnumber, setcardnumber] = useState(false)
    const [expiry, setexpiry] = useState(false)
    const [Cvv, setCvv] = useState(false)
    const [alert, setAlert] = useState({
        type: '',
        message: '',
        isVisible: false,
    })

    const dispatch = useDispatch();

    const addCard = () => {
        let dateRegex = /^[0-9]{2}[\/][0-9]{4}$/g;

        let currentMonth = new Date().toISOString();
        let currentYear = new Date().getFullYear();
        let split_expiryDate = '';
        if (expiry) {
            split_expiryDate = expiry.split('/');
        }

        if (name.length <= 3) {
            setAlert({ type: 'Error', message: 'Card name must be atleast 4 characters!', isVisible: true })
            return;
        }
        if (cardnumber.length < 16) {
            setAlert({ type: 'Error', message: 'Card number must be atleast 16 number!', isVisible: true })
            return;
        }
        if (
            currentMonth.slice(5, 7) === split_expiryDate[0] &&
            currentYear === Number(split_expiryDate[1])
        ) {
            setAlert({ type: 'Error', message: 'Expiry date is invalidss', isVisible: true })
            return;
        }

        if (expiry && !dateRegex.test(expiry)) {
            setAlert({ type: 'Error', message: 'Expiry date is invalid', isVisible: true })
            return;
        }

        if (Cvv.length < 3) {
            setAlert({ type: 'Error', message: 'Enter a valid cvv', isVisible: true })
            return;
        }

        if (name && cardnumber && expiry && Cvv) {
            dispatch(PaymentMiddleware.addCard({
                name: name,
                cardnumber: cardnumber,
                exp_date: expiry,
                cvv: Cvv
            })).then((data) => {
                if (data.success) {
                    setAlert({ type: 'Success', message: 'Card added successfully', isVisible: true })
                } else {
                    setAlert({ type: 'Error', message: data.message, isVisible: true })
                }
            })
                .catch()
        } else {
            setAlert({ type: 'Error', message: 'All fields are required.', isVisible: true })
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: Colors.WHITE_1 }}>
            <Header
                leftIcon={back_arror_white}
                headerText={'Add Payment Card'}
                leftIconStyle={{ backgroundColor: Colors.CYAN }}
                onPressLeftIcon={() => navigation.goBack()}
            />

            <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                <TextInput label={'Card Holder Name'} value={'Card Holder Name'} onChangeText={text => setname(text)} />
                <TextInput label={'Card Number'} value={'Card Number'} onChangeText={text => setcardnumber(text)} maxlength={16} type={'numeric'} />
                <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between' }}>
                    <TextInput label={'Expiry Date'} value={'12/2022'} InputValue={expiry} onChangeText={text => setexpiry(text.length == 2 ? text + '/' : text)} type={'numeric'} maxlength={7} />
                    <TextInput label={'CVV'} value={'CVV'} onChangeText={text => setCvv(text)} type={'numeric'} maxlength={4} />
                </View>
                <TouchableOpacity
                    style={styles.addbtn}
                    onPress={addCard}
                >
                    <Text
                        style={{
                            color: Colors.WHITE,
                            fontWeight: 'bold',
                            fontSize: 16,
                        }}>
                        Add Card
                    </Text>
                </TouchableOpacity>
            </View>
            <CustomAlert
                visible={alert.isVisible}
                onPress={() => { setAlert({ isVisible: false }), alert.type == 'Success' ? navigation.goBack() : null }}
                type={alert.type}
                Message={alert.message} />

        </View>
    )
}

const styles = StyleSheet.create({

    addbtn: {
        backgroundColor: Colors.CYAN,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        width: '100%',
        alignSelf: 'center',
        marginTop: 20
    }

})