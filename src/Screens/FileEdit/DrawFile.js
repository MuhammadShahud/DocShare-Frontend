import { Text, View, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { draw_file, draw_header, file_edit, back_arrow, doucment_icon } from '../../Assets'
import { DocumentView, RNPdftron, Config } from "@pdftron/react-native-pdf";
import Pusher from 'pusher-js/react-native';
import { Header } from '../../Components'
import CustomAlert from '../../Components/CustomAlert'


import { connect } from 'react-redux';
import FilesMiddleware from '../../Store/Middleware/FilesMiddleware'
import RNFetchBlob from 'rn-fetch-blob';
export class DrawFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            type: '',
            message: ''
        }
        RNPdftron.initialize("");
        RNPdftron.enableJavaScript(true);
    }

    componentDidMount() {
        this.initiatePusher()
    }

    initiatePusher = () => {
        const file_id = this.props.route?.params?.item?.id;
        this.pusher = new Pusher('2a8aef090fd9e011396f', { cluster: 'ap2' });
        this.chatChannel = this.pusher.subscribe(file_id.toString());
        this.chatChannel.bind('App\\Events\\Message', data => {
            if (file_id == data.data.id) {
                if (data.data.tag == 'delete') {
                    this.deletAnnotation(data.data.annotation)
                } else {
                    this.onDocumentLoaded(data.data.string)
                }

            }
        });
    }

    onAnnotationChanged = ({ action, annotations }) => {
        const file_id = this.props.route?.params?.item?.id;
        if (this._viewer) {
            this._viewer.exportAnnotations({ annotList: annotations }).then((xfdf) => {
                this.props.sendAnnotation({ id: file_id, string: xfdf.toString(), annotation: annotations, tag: action })
            });
        }
    }

    onZoomChanged = ({ zoom }) => {
        // console.log('zoom', zoom);
    }

    onExportAnnotationCommand = ({ action, xfdfCommand }) => {
        const file_id = this.props.route?.params?.item?.id;

        if (this._viewer) {
            // console.log('xfdfCommandss', xfdfCommand);

        }
    }

    deletAnnotation = (annotations) => {
        let annotation = [{
            id: annotations.id,
            pageNumber: parseInt(annotations.pageNumber),
            type: annotations.type
        }]
        if (this._viewer) {
            this._viewer.deleteAnnotations(annotation)
        }

    }

    onDocumentLoaded = (string) => {
        if (this._viewer) {
            this._viewer.importAnnotations(string.toString());
        }
    }

    onLeadingNavButtonPressed = () => {

        if (Platform.OS === "ios") {
            Alert.alert(
                "App",
                "onLeadingNavButtonPressed",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: true }
            );
        } else {
            this.props.navigation.navigate('FileEdit', { item: this.props.route?.params?.item });
        }
    };

    saveFile = () => {
        let document = this.props.route?.params?.item
        if (this._viewer) {
            this._viewer.saveDocument().then((data) => {
                const fileUrl = "file://" + data
                let filename = data.split('/')
                let extension = document.name.includes('.doc')
                let file = {
                    name: extension ? document.name : filename[filename.length - 1],
                    uri: fileUrl,
                    type: 'application/pdf'
                }
                console.log(file)
                this.props.updateDocument({ document_id: document.id, document: file })
                    .then(() => this.setState({ type: 'Success', message: 'File saved Successfully.', isVisible: true }))
                    .catch()
            });
        }
    }
    render() {
        const file = this.props.route?.params?.item;
        const path = file.url;

        const myToolbar = {
            [Config.CustomToolbarKey.Id]: 'myToolbar',
            [Config.CustomToolbarKey.Name]: 'myToolbar',
            [Config.CustomToolbarKey.Icon]: Config.ToolbarIcons.FillAndSign,
            [Config.CustomToolbarKey.Items]: [Config.Tools.annotationCreateArrow, Config.Tools.annotationCreateCallout, Config.Buttons.undo]
        };
        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftIcon={back_arrow}
                    onPressLeftIcon={() =>
                        this.props.navigation.goBack()
                    }
                    rightIcon={doucment_icon}
                    onPressRightIcon={this.saveFile}
                    headerText={file.name}
                />
                <DocumentView
                    ref={(c) => this._viewer = c}
                    document={path}
                    showLeadingNavButton={false}
                    leadingNavButtonIcon={
                        Platform.OS === "ios"
                            ? "ic_close_black_24px.png"
                            : "ic_arrow_back_white_24dp"
                    }
                    onLeadingNavButtonPressed={this.onLeadingNavButtonPressed}
                    onAnnotationChanged={this.onAnnotationChanged}
                    onExportAnnotationCommand={this.onExportAnnotationCommand}
                    onDocumentLoaded={this.onDocumentLoaded}
                />
                <CustomAlert
                    visible={this.state.isVisible}
                    type={this.state.type}
                    Message={this.state.message}
                    onPress={() => { this.setState({ isVisible: false }), this.state.type == 'Success' ? this.props.navigation.goBack() : null }}
                />
            </View>
        )
    }
}

const mapDisPatchToProps = (dispatch) => {
    return {
        sendAnnotation: payload => dispatch(FilesMiddleware.exportAnnotations(payload)),
        updateDocument: payload => dispatch(FilesMiddleware.updateDocument(payload))
    }
}
const mapStateToProps = (state) => {
    return {


    }
}

export default connect(mapStateToProps, mapDisPatchToProps)(DrawFile)