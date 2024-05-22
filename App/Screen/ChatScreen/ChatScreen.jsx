import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const chatHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://livechatv2.chat2desk.com/packs/ie-11-support.js"></script>
    <script>
      window.chat24_token = "1a86e9388186b64c3893837eb4516c95";
      window.chat24_url = "https://livechatv2.chat2desk.com";
      window.chat24_socket_url ="wss://livechatv2.chat2desk.com/widget_ws_new";
      window.chat24_show_new_wysiwyg = "true";
      window.chat24_static_files_domain = "https://storage.chat2desk.com/";
      window.lang = "ru";
      window.fetch("".concat(window.chat24_url, "/packs/manifest.json?nocache=").concat(new Date().getTime())).then(function (res) {
        return res.json();
      }).then(function (data) {
        var chat24 = document.createElement("script");
        chat24.type = "text/javascript";
        chat24.async = true;
        chat24.src = "".concat(window.chat24_url).concat(data["application.js"]);
        document.body.appendChild(chat24);
      });
    </script>
  </head>
  <body>
  </body>
  </html>
`;

const ChatScreen = () => {
    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html: chatHtml }}
                style={styles.webview}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});

export default ChatScreen;
