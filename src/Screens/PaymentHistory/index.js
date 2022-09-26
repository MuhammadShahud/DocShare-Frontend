import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Header, SearchBar, TextInput } from '../../Components';
import { Colors } from '../../Styles';
import { useDispatch, useSelector } from 'react-redux'
import PaymentMiddleware from '../../Store/Middleware/PaymentMiddleware'
import { useNavigation } from '@react-navigation/native';



export default function PaymentHistory() {
  const dispatch = useDispatch();
  const UserPlans = useSelector((state) => state.PaymentReducer.userPlans)
  const navigation = useNavigation()

  const [loader, setLoader] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const fetchPlans = () => {
    setLoader(true)
    dispatch(PaymentMiddleware.getUserPlanList())
      .then(() => setLoader(false))
      .catch(() => setLoader(false))
  }

  const refreshList = () => {
    setRefresh(true)
    dispatch(PaymentMiddleware.getPlanList())
      .then(() => setRefresh(false))
      .catch(() => setRefresh(false))
  }

  const reschedule = (item) => {
    navigation.navigate('Payment Method', { item })
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE_1 }}>
      {!loader ?
        <FlatList
          style={{ marginTop: 10 }}
          data={UserPlans}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={refreshList}
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
                  <View
                    style={{
                      marginTop: 20,
                      marginBottom: 20,
                    }}>
                    <Text
                      style={{
                        color: '#3E6D9C',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {item?.subscription?.package_name}
                    </Text>
                    <Text
                      style={{
                        color: '#5D5D5D',
                        fontSize: 10,
                      }}>
                      {item?.subscription?.description}
                    </Text>
                    <Text
                      style={{
                        color: '#5D5D5D',
                        fontSize: 20,
                        fontWeight: 'bold',
                        paddingTop: 5,
                      }}>
                      {'$' + item?.subscription?.price + ' / month'}
                    </Text>
                  </View>
                  {item?.status == 0 ?
                    <View
                      style={{
                        marginTop: 20,
                        marginBottom: 20,
                        alignItems: 'flex-end',
                      }}>
                      <Text
                        style={{
                          color: '#707070',
                        }}>
                        Expired
                      </Text>
                      <TouchableOpacity
                        onPress={() => reschedule(item)}
                        style={{
                          backgroundColor: Colors.CYAN,
                          width: 100,
                          height: 35,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 5,
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            color: Colors.WHITE,
                            fontWeight: 'bold',
                          }}>
                          Resubscribe
                        </Text>
                      </TouchableOpacity>
                    </View> :
                    <View
                      style={{
                        marginTop: 20,
                        marginBottom: 20,
                        alignItems: 'flex-end',
                      }}>

                      <TouchableOpacity
                        disabled={true}
                        onPress={() => reschedule(item)}
                        style={{
                          backgroundColor: Colors.GREEN,
                          width: 100,
                          height: 35,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 5,
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            color: Colors.WHITE,
                            fontWeight: 'bold',
                          }}>
                          Active
                        </Text>
                      </TouchableOpacity>
                    </View>

                  }
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={{ width: '90%', alignSelf: 'center', marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
              <Text style={{ textAlign: 'center', color: Colors.BLACK }}>Plans not found</Text>
            </View>
          }
        />
        : <ActivityIndicator size={'large'} color={Colors.CYAN} />
      }
    </View>
  );

}

const styles = StyleSheet.create({});
