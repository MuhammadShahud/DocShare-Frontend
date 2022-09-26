import { Text, View, StyleSheet, Image, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Header, SearchBar, TextInput } from '../../Components';
import {
  back_arrow,
  document_blue_icon,
  group_blue_icon,
  Logo,
  notification_white,
  passcode_blue_icon,
  photo_blue_icon,
  search,
  video_blue_icon,
} from '../../Assets';
import { Colors } from '../../Styles';
import { useSelector, useDispatch } from 'react-redux'
import PaymentMiddleware from '../../Store/Middleware/PaymentMiddleware'

export default function SubScriptionPlan({ navigation }) {
  const dispatch = useDispatch();
  const getplans = useSelector((state) => state.PaymentReducer.getPlans)

  const [loader, setloader] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const fetchPlans = () => {
    setloader(true)
    dispatch(PaymentMiddleware.getPlanList())
      .then(() => setloader(false))
      .catch(() => setloader(false))
  }

  const refreshList = () => {
    setRefresh(true)
    dispatch(PaymentMiddleware.getPlanList())
      .then(() => setRefresh(false))
      .catch(() => setRefresh(false))
  }


  useEffect(() => {
    fetchPlans()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Header
        leftIcon={back_arrow}
        rightIcon={notification_white}
        onPressRightIcon={() => this.props.navigation.navigate('Notification')}
        onPressLeftIcon={() => navigation.navigate('Setting')}
        headerText={'SUBSCRIPTION PLAN'}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: Colors.WHITE_1,
          paddingBottom: 10
        }}>
        {!loader ?
          <FlatList
            data={getplans}
            key={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={refreshList}
              />
            }
            renderItem={({ item }) => {
              return (
                <SubscriptionCardCmp
                  key={item.id}
                  planName={item.package_name}
                  price={item.price}
                  features={item?.features}
                  onPress={() => navigation.navigate('TopTab', { screen: 'Payment Method', params: { item } })}
                />
              )
            }}
            ListEmptyComponent={
              <View style={{ marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
                <Text style={{ textAlign: 'center', color: Colors.BLACK }}>Plans not found</Text>
              </View>
            }
          />
          : <ActivityIndicator size={'large'} color={Colors.CYAN} />}

        {/* <SubscriptionCardCmp
          planName="Premium Plan"
          price="150"
          features={[
            { title: 'Photos', icon: photo_blue_icon },
            { title: 'Documents', icon: document_blue_icon },
            { title: 'Video Call', icon: video_blue_icon },
            { title: 'Set Passcode', icon: passcode_blue_icon },
            { title: '3+ Group Members', icon: group_blue_icon },
          ]}
        /> */}
      </View>
    </View>
  );
}

const FeatureItem = ({ title, icon, key }) => {
  return (
    <View
      key={key}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 10,
            height: 5,
            backgroundColor: Colors.GRAY_2,
          }}></View>
        <View
          style={{
            backgroundColor: Colors.WHITE,
            borderRadius: 50,
            width: 25,
            height: 25,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: Colors.GRAY_2,
          }}>
          <Image
            source={icon}
            style={{
              width: 15,
              height: 15,
            }}
            resizeMode="contain"
          />
        </View>
      </View>
      <Text style={{ marginLeft: 5, color: Colors.GRAY_3 }}>{title}</Text>
    </View>
  );
};

const SubscriptionCardCmp = ({ planName, price, features, onPress, key }) => {

  return (
    <View
      key={key}
      style={{
        backgroundColor: Colors.GRAY_2,
        borderRadius: 5,
        flex: 1,
        marginTop: 20,
      }}>
      <View
        style={{
          backgroundColor: Colors.GRAY_BG,
          flex: 1,
          marginRight: 15,
          marginBottom: 5,
          marginLeft: 2,
          borderRadius: 5,
          paddingBottom: 10
        }}>
        <View
          style={{
            width: '60%',
            backgroundColor: Colors.BLUE,
            paddingVertical: 25,
            alignItems: 'center',
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
            borderBottomLeftRadius: 24,
          }}>
          <Text style={{ color: Colors.WHITE, fontSize: 20, fontWeight: 'bold' }}>
            {planName}
          </Text>
        </View>

        <View
          style={{
            // backgroundColor: 'green',
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <View style={{ flex: 1 }}>
            {features?.map((val, ind) => {
              return <FeatureItem title={val} key={ind}
                icon={val.includes('Photos') ?
                  photo_blue_icon :
                  val.includes('Documents') ?
                    document_blue_icon
                    : val.includes('Video') ?
                      video_blue_icon :
                      val.includes('Passcode') ?
                        passcode_blue_icon :
                        val.includes('Group') ?
                          group_blue_icon : null
                }
              />;
            })}
          </View>
          <View
            style={{
              flex: 0.8,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 40,
              }}>
              ${price}
            </Text>
            <Text style={{ color: Colors.TEXT_GRAY }}>per month</Text>
            <Button
              btnText="Subscribe"
              theme="cyan"
              onPress={onPress}
              style={{
                width: '75%',
                borderRadius: 5,
                height: 40,
                marginTop: 10
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
