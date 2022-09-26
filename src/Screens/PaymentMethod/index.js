import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { face4, delete_gray } from '../../Assets'

import { Colors } from '../../Styles';
import { useSelector, useDispatch } from 'react-redux'
import PaymentMiddleware from '../../Store/Middleware/PaymentMiddleware'
import { IMG_URL } from '../../Store/Apis';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../Components/CustomAlert'


export default function PaymentMethod({ route }) {
  const dispatch = useDispatch()

  const navigation = useNavigation()
  const userCards = useSelector((state) => state.PaymentReducer.userCards)
  const user = useSelector((state) => state.AuthReducer.user)
  const PlansRecords = useSelector((state) => state.PaymentReducer.PlansRecords)

  const PlanData = route?.params?.item

  const [loader, setloader] = useState(false)
  const [refresh, setrefresh] = useState(false)

  const [alert, setAlert] = useState({
    type: '',
    message: '',
    isVisible: false,
  })

  const fetchcards = () => {
    setloader(true)
    dispatch(PaymentMiddleware.getUserCards())
      .then(() => setloader(false))
      .catch(() => setloader(false))
  }

  const Refreshlist = () => {
    setrefresh(true)
    dispatch(PaymentMiddleware.getUserCards())
      .then(() => setrefresh(false))
      .catch(() => setrefresh(false))
  }

  const PayNow = (item) => {
    dispatch(PaymentMiddleware.SubscribePlan({
      plan_id: PlanData?.plan_id,
      payment_id: item.id,
      price: PlanData.price
    }))
      .then((data) => {
        if (data.success) {
          setAlert({
            type: 'Success',
            message: 'Plan subscribed successfully',
            isVisible: true
          })
        } else {
          setAlert({
            type: 'Error',
            message: data.message,
            isVisible: true
          })
        }
      })
      .catch()
  }

  const deleteCard = (item) => {
    dispatch(PaymentMiddleware.deleteCard({ stripe_id: item?.stripe_source_id, id: item?.id }))
  }

  useEffect(() => {
    fetchcards()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE_1 }}>
      {!loader ?
        <FlatList
          style={{ marginTop: 10 }}
          data={userCards}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={Refreshlist}
            />
          }
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  backgroundColor: Colors.SETTING_BUTTON_BackGround,
                  elevation: 1,
                  width: '95%',
                  borderRadius: 10,
                  alignSelf: 'center',
                  marginTop: 5,
                  marginBottom: 5,
                }}>
                <View
                  style={{
                    backgroundColor: Colors.SETTING_BUTTON,
                    elevation: 2,
                    width: '95%',
                    flexDirection: 'row',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <Image
                    source={user.profile_pic ? { uri: IMG_URL + user.profile_pic } : face4}
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 30,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View>
                    <Text style={{ color: '#000' }}>
                      *********{item.card_end_number}
                    </Text>
                    <Text style={{ color: '#000' }}>Expire {item?.exp_date}</Text>
                  </View>
                  {PlanData ?
                    <TouchableOpacity
                      onPress={() => PayNow(item)}
                      style={{
                        backgroundColor: Colors.CYAN,
                        width: 70,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          color: Colors.WHITE,
                          fontWeight: 'bold',
                        }}>
                        Pay now
                      </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                      onPress={() => deleteCard(item)}
                      style={{
                        backgroundColor: Colors.CYAN,
                        width: 30,
                        marginLeft: 20,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      }}>
                      <Image source={delete_gray} resizeMode={'contain'} style={{ width: 20, height: 20, tintColor: Colors.WHITE }} />
                    </TouchableOpacity>
                  }
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={{ width: '90%', alignSelf: 'center', marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
              <Text style={{ textAlign: 'center', color: Colors.BLACK }}>Card not found</Text>
            </View>
          }
        />
        :
        <View style={{ flex: 1, backgroundColor: Colors.WHITE_1, marginTop: 10 }}>
          <ActivityIndicator size={'large'} color={Colors.CYAN} />
        </View>
      }

      <TouchableOpacity
        style={styles.addbtn}
        onPress={() => navigation.navigate('AddCard')}
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

      <CustomAlert
        visible={alert.isVisible}
        onPress={() => { setAlert({ isVisible: false }), alert.type == 'Success' ? navigation.goBack() : null }}
        type={alert.type}
        Message={alert.message} />

    </View>
  );

}

const styles = StyleSheet.create({
  addbtn: {
    backgroundColor: Colors.CYAN,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    width: '95%',
    alignSelf: 'center',
    bottom: 20,
  }

});
