import { Text, View, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import React, { Component } from 'react'
import { Colors } from '../../Styles'
import { apple_white, fb_white, logo_white, mail_white } from '../../Assets'
import { Button, Modal, TextInput, CodeVerificationInput } from '../../Components'
import { connect } from 'react-redux'
import AuthAction from '../../Store/Actions/AuthAction'
import LoadingAction from '../../Store/Actions/LoadingAction'
import AppMiddleware from '../../Store/Middleware/AppMiddleware'
import messaging from '@react-native-firebase/messaging';
import CustomAlert from '../../Components/CustomAlert'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Settings } from 'react-native-fbsdk-next';

Settings.setAppID('1693689294173183');

class Login extends Component {
    state = {
        forgotPassModal: false,
        codeVerificationModal: false,
        chanePassModal: false,
        email: '',
        password: '',
        forgotEmail: '',
        pin: '',
        newPassword: '',
        confirmPassword: '',
        alert: {
            type: '',
            message: '',
            isVisible: false
        }
    }
    componentDidMount() {
        GoogleSignin.configure({
            webClientId: '',
        });
    }
    onPressLogin = async () => {
        let token = await messaging().getToken();
        const { email, password } = this.state;
        if (email && password) {
            this.props.login({ token, email, password })
        } else {
            this.setState({ alert: { type: 'Error', message: 'All fields are required', isVisible: true, } })
        }

    }
    sendForgotEmail = () => {
        if (this.state.forgotEmail) {
            this.props.SendForgotEmail({
                email: this.state.forgotEmail
            }).then(data => {
                this.setState({ forgotPassModal: false, codeVerificationModal: true })
            }).catch();
        } else {
            this.setState({ alert: { type: 'Error', message: 'Email field is required', isVisible: true, } })
        }
    }
    VerifyPin = () => {
        if (this.state.pin) {
            this.props.VerifyPin({
                email: this.state.forgotEmail,
                pin: this.state.pin
            }).then(data => {
                this.setState({ codeVerificationModal: false, chanePassModal: true })
            }).catch();
        } else {
            this.setState({ alert: { type: 'Error', message: 'Email field is required', isVisible: true, } })
        }
    }
    resetPassword = () => {
        const { newPassword, confirmPassword, forgotEmail } = this.state
        if (!newPassword && !confirmPassword) {
            this.setState({ alert: { type: 'Error', message: 'Password fields is required', isVisible: true, } })
            return;
        }
        if (newPassword === confirmPassword) {
            this.props.resetPassword({
                email: forgotEmail,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            }).then(data => {
                this.setState({ chanePassModal: false }),
                    this.setState({ alert: { type: 'Success', message: 'Password Successfully Changed.', isVisible: true, } })
            }).catch();
        } else {
            this.setState({ alert: { type: 'Error', message: 'Password and confirm password should be match', isVisible: true, } })
            return;
        }

    }
    renderForgotModal = () => {
        return (
            <Modal visible={this.state.forgotPassModal}
                onPressCloseIcon={() => this.setState({ forgotPassModal: false })}

            >
                <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22, color: Colors.BLACK, textAlign: 'center' }}>Forgot Password?</Text>
                    <Text style={{ color: Colors.GRAY_LIGHT, textAlign: 'center' }}>Enter Registered Email Address to Reset Password</Text>
                    <TextInput label={'Email'} value={'david.james@gmail.com'} onChangeText={value => this.setState({ forgotEmail: value })} />
                    <Button btnText={'Reset Password'} theme={'cyan'} style={{ marginVertical: 20 }}
                        onPress={() => this.sendForgotEmail()}
                    />
                </View>
            </Modal>
        )
    }
    renderChangePasswordModal = () => {
        return (
            <Modal visible={this.state.chanePassModal}
                onPressCloseIcon={() => this.setState({ chanePassModal: false })}

                style={{ height: 350 }}
            >
                <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22, color: Colors.BLACK, textAlign: 'center' }}>Change Password</Text>
                    {/* <TextInput label={'Current Password'} value={'**********'} /> */}
                    <TextInput label={'New Password'} value={'**********'} secureTextEntry={true} onChangeText={value => this.setState({ newPassword: value })} />
                    <TextInput label={'Re-type new Password'} value={'**********'} secureTextEntry={true} onChangeText={value => this.setState({ confirmPassword: value })} />
                    <Button btnText={'Change Password'} theme={'cyan'} style={{ marginVertical: 20 }}
                        onPress={() => this.resetPassword()}
                    />
                </View>
            </Modal>
        )
    }
    renderCodeVerificationModal = () => {
        return (
            <Modal visible={this.state.codeVerificationModal}
                onPressCloseIcon={() => this.setState({ codeVerificationModal: false })}

            >
                <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22, color: Colors.BLACK, textAlign: 'center' }}>Verification Code</Text>
                    <Text style={{ color: Colors.GRAY_LIGHT, textAlign: 'center' }}>Please enter verification code sent on your registered email address.</Text>
                    <CodeVerificationInput
                        value={this.state.pin}
                        onChangeText={(pin) => {
                            this.setState({ pin })
                        }}
                    />
                    <Button btnText={'Verify'} theme={'cyan'} style={{ marginVertical: 20 }}
                        onPress={() => this.VerifyPin()}
                    />
                </View>
            </Modal>
        )
    }
    googleSignin = async () => {
        const googleRes = await GoogleSignin.signIn();
        let token = await messaging().getToken();
        this.props.socialLogin({ token, email: googleRes?.user?.email, username: googleRes?.user?.name })
    }
    facebooklogin = async () => {
        let token = await messaging().getToken();
        this.props
            .facebookLogin({})
            .then(data => {
                this.props.socialLogin({ token, email: data?.email, username: data?.name })
            })
            .catch()
    }

    render() {
        const { alert } = this.state
        return (
            <View style={styles.container}>
                <Image source={logo_white} style={styles.logo} resizeMode={'contain'} />
                <View style={styles.bodyContainer}>
                    <Text style={styles.welcomText}>Welcome Back !</Text>
                    <Text style={styles.lightGrayText}>Login to continue</Text>
                    <View style={styles.socialContainer}>
                        <TouchableOpacity onPress={this.facebooklogin} style={[styles.socialIconContainer, { backgroundColor: Colors.FB_BLUE }]}>
                            <Image source={fb_white} style={styles.socialIcon} resizeMode={'contain'} />
                        </TouchableOpacity>
                        {Platform.OS == 'ios' ?
                            <TouchableOpacity style={[styles.socialIconContainer, { backgroundColor: Colors.BLACK }]}>
                                <Image source={apple_white} style={styles.socialIcon} resizeMode={'contain'} />
                            </TouchableOpacity>
                            : null}
                        <TouchableOpacity onPress={() => this.googleSignin()} style={[styles.socialIconContainer, { backgroundColor: Colors.WHITE, borderWidth: 3, borderColor: Colors.WHITE_1 }]}>
                            <EvilIcons name='sc-google-plus' size={40} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.msg1}>Or connect with your email</Text>
                    <TextInput label={'Email'} value={'david.james@gmail.com'} onChangeText={value => this.setState({ email: value })} />
                    <TextInput label={'Password'} value={'**********'} onChangeText={value => this.setState({ password: value })} secureTextEntry={true} />
                    <Text style={styles.forgotPassText} onPress={() => this.setState({ forgotPassModal: true })}>Forget Password?</Text>
                    <Button btnText={'Sign in'} theme={'cyan'} onPress={this.onPressLogin} />
                    <Text style={styles.msg2} onPress={() => this.props.navigation.navigate('SignUp')}>Create an account</Text>
                </View>
                {this.renderForgotModal()}
                {this.renderCodeVerificationModal()}
                {this.renderChangePasswordModal()}
                <CustomAlert
                    visible={alert.isVisible}
                    onPress={() => { this.setState({ alert: { isVisible: false } }), alert.type == 'Success' ? null : null }}
                    type={alert.type}
                    Message={alert.message} />
            </View>
        )
    }
}

const mapDisPatchToProps = (dispatch) => {
    return {
        login: (payload) => dispatch(AppMiddleware.Login(payload)),
        SendForgotEmail: (payload) => dispatch(AppMiddleware.forgotPasswordEmail(payload)),
        VerifyPin: (payload) => dispatch(AppMiddleware.verifyPin(payload)),
        resetPassword: (payload) => dispatch(AppMiddleware.resetPassword(payload)),
        socialLogin: (payload) => dispatch(AppMiddleware.socialLogin(payload)),
        facebookLogin: (payload) => dispatch(AppMiddleware.facebookLogin(payload))

    }
}
const mapStateToProps = (state) => {
    return {
    }
}
export default connect(mapStateToProps, mapDisPatchToProps)(Login)
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: Colors.BLUE
    },
    bodyContainer: {
        flex: 1, backgroundColor: Colors.WHITE, borderTopRightRadius: 45, borderTopLeftRadius: 45, paddingHorizontal: 40, paddingTop: 20
    },
    welcomText: {
        fontWeight: 'bold', fontSize: 22, color: Colors.BLACK
    },
    lightGrayText: {
        color: Colors.GRAY_LIGHT
    },
    socialContainer: {
        flexDirection: 'row', marginVertical: 10, justifyContent: 'space-evenly'
    },
    socialIconContainer: {
        width: 90, height: 70, justifyContent: 'center', alignItems: 'center', borderRadius: 20
    },
    msg1: {
        color: Colors.GRAY_LIGHT, alignSelf: 'center'
    },
    forgotPassText: { color: Colors.GRAY_LIGHT, alignSelf: 'flex-end', marginVertical: 10 },
    msg2: { color: Colors.GRAY_LIGHT, alignSelf: 'center', marginVertical: 25 },
    socialIcon: { height: 25, width: 25 },
    logo: { width: '50%', alignSelf: 'center' }

})