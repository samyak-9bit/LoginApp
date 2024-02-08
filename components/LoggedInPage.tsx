/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Icon } from 'react-native-paper';



function LoggedInPage(): React.JSX.Element {

return (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
        <Icon
    size={50}
    source="emoticon-excited"
    color="rgb(255,255,255)"
  /></View>
        <Text style={styles.mainText}>WelCome User</Text>
        <Text style={styles.subText}>You've logged in Successfully!</Text>
    </View>
);
}

const styles = StyleSheet.create({
    container:{
        height: '100%',
        backgroundColor: 'rgb(34,84,211)',
        justifyContent:'center',
    },
    mainText:{
        textAlign:'center',
        fontSize:24,
        color: 'rgb(255,255,255)',
        marginBottom:2,
    },
    subText:{
        textAlign:'center',
        fontSize:18,
        color: 'rgb(255,255,255)',
    },
    iconContainer:{
        justifyContent:'center',
        alignItems:'center',
    },
});

export default LoggedInPage;
