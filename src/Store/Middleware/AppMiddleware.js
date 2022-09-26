import Axios from 'axios';
import AuthAction from '../Actions/AuthAction';
import LoadingAction from '../Actions/LoadingAction'
import Apis from '../Apis';
import Storage from '../../Utils/AsyncStorage'
import { getHeaders } from '../../Utils'
import {
  LoginManager,
  Profile,
  GraphRequest,
  AccessToken,
  GraphRequestManager,
} from 'react-native-fbsdk-next';


class AppMiddleware {

  static Login = ({ token, email, password }) => {
    return dispatch => {
      dispatch(LoadingAction.ShowLoading())
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('device_id', token);
          formdata.append('email', email);
          formdata.append('password', password);
          const { data } = await Axios.post(
            Apis.login,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(LoadingAction.HideLoading())
            await Storage.setToken(data.data.token);
            await Storage.set('@user', JSON.stringify(data.data.user));
            dispatch(AuthAction.getUserData(data.data.user))
            dispatch(AuthAction.isLogin(true))
          } else {
            dispatch(LoadingAction.HideLoading())
            alert(data.message)
          }
        } catch (error) {
          dispatch(LoadingAction.HideLoading())
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static Register = ({ token, name, email, password }) => {
    return dispatch => {
      dispatch(LoadingAction.ShowLoading())
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('device_id', token)
          formdata.append('username', name);
          formdata.append('email', email);
          formdata.append('password', password);
          const { data } = await Axios.post(
            Apis.register,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(LoadingAction.HideLoading())
            resolve(data);
          } else {
            dispatch(LoadingAction.HideLoading())
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          dispatch(LoadingAction.HideLoading())
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static forgotPasswordEmail = ({ email }) => {
    return dispatch => {
      dispatch(LoadingAction.ShowLoading())
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('email', email);
          const { data } = await Axios.post(
            Apis.sendForgotEmail,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(LoadingAction.HideLoading())
            resolve(data)
          } else {
            dispatch(LoadingAction.HideLoading())
            alert(data?.message)
          }
        } catch (error) {
          dispatch(LoadingAction.HideLoading())
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static verifyPin = ({ email, pin }) => {
    return dispatch => {
      dispatch(LoadingAction.ShowLoading())
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('email', email);
          formdata.append('code', pin);
          const { data } = await Axios.post(
            Apis.verifyPin,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(LoadingAction.HideLoading())
            resolve(data)
          } else {
            dispatch(LoadingAction.HideLoading())
            alert(data?.message)
          }
        } catch (error) {
          dispatch(LoadingAction.HideLoading())
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static resetPassword = ({ email, newPassword, confirmPassword }) => {
    return dispatch => {
      dispatch(LoadingAction.ShowLoading())
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('email', email);
          formdata.append('password', newPassword);
          formdata.append('password_confirm', confirmPassword);

          const { data } = await Axios.post(
            Apis.resetPassword,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(LoadingAction.HideLoading())
            resolve(data)
          } else {
            dispatch(LoadingAction.HideLoading())
            alert(data.message)
          }
        } catch (error) {
          dispatch(LoadingAction.HideLoading())
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static changePassword = ({ id, oldPassword, newPassword, confirmPassword }) => {
    return dispatch => {
      dispatch(LoadingAction.ShowLoading())
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('id', id);
          formdata.append('old_password', oldPassword);
          formdata.append('new_password', newPassword);
          formdata.append('confirm_password', confirmPassword);

          const { data } = await Axios.post(
            Apis.changePassword,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(LoadingAction.HideLoading())
            resolve(data)
          } else {
            dispatch(LoadingAction.HideLoading())
            alert(data.message)
          }
        } catch (error) {
          dispatch(LoadingAction.HideLoading())
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static updateProfile = ({ name, email, image  , address}) => {
    return dispatch => {
      dispatch(LoadingAction.ShowLoading())
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('username', name);
          formdata.append('email', email);
          formdata.append('address', address);

          if (image)
            formdata.append('profile_pic', image);
          const { data } = await Axios.post(
            Apis.updateProfile,
            formdata,
            await getHeaders(),
          );

          if (data?.success) {
            await Storage.set('@user', JSON.stringify(data.data));
            dispatch(AuthAction.getUserData(data.data))
            dispatch(LoadingAction.HideLoading())
            resolve(data);
          } else {
            dispatch(LoadingAction.HideLoading())
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          dispatch(LoadingAction.HideLoading())
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static socialLogin = ({ token, email, username }) => {
    return dispatch => {
      dispatch(LoadingAction.ShowLoading())
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('device_id', token);
          formdata.append('email', email);
          formdata.append('username', username);
          const { data } = await Axios.post(
            Apis.socialLogin,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(LoadingAction.HideLoading())
            await Storage.setToken(data.data.token);
            await Storage.set('@user', JSON.stringify(data.data.user));
            dispatch(AuthAction.getUserData(data.data.user))
            dispatch(AuthAction.isLogin(true))
          } else {
            dispatch(LoadingAction.HideLoading())
            alert(data.message)
          }
        } catch (error) {
          dispatch(LoadingAction.HideLoading())
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static facebookLogin = ({payload}) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            result => {
              if (result.isCancelled) {
                console.log('Login cancelled');
              } else {
                Profile.getCurrentProfile().then(currentProfile => {
                  AccessToken.getCurrentAccessToken().then(token => {
                    new GraphRequestManager()
                      .addRequest(
                        new GraphRequest(
                          '/me',
                          {
                            accessToken: token?.accessToken,
                            parameters: {
                              fields: {
                                string: 'email',
                              },
                            },
                          },
                          (err, res) => {
                            resolve(res);
                            if (err) {
                              alert('Something went wrong');
                              reject(null);
                            } else {
                            }
                          },
                        ),
                      )
                      .start();
                  });
                });
              }
            },
            function (error) {
              reject(null);
              console.log('Login fail with error: ' + error);
            },
          );

        
        } catch (error) {
          alert('Network Error');
          reject(error);

          console.log('error', error);
        }
      });
    };
  };

}

export default AppMiddleware;