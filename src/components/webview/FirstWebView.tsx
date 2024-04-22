import React from 'react';
import {Text, View} from 'react-native';
import WebView from 'react-native-webview';

const FirstWebView = () => {
  return (
    <View style={{flex: 1}}>
      <WebView source={{uri: 'http://10.0.2.2:3000/file'}} />
    </View>
  );
};

export default FirstWebView;
