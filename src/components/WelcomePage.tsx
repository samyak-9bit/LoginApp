import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

function WelcomePage({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {
    return (
        <View style={styles.container}>
            <View style={styles.firstBlock}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/solution.png')} style={styles.logo} />
            </View>
            <Text style={styles.title}>Welcome to Ninebit</Text>
            <Text style={styles.subtitle}>Unleash the Power of Innovation!</Text> 
            </View>
            <View style={styles.curveContainer}>
                <View style={styles.curve1}></View>
                <View style={styles.curve2}></View>
            </View>
            <View style={styles.secondBlock}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Demo')}>
                <Text style={styles.buttonText}>🚀 Dive into the Demo! 🎩</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(255,255,255)',
    },
    firstBlock:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        height:'50%'
    },
    curveContainer:{
        height:'10%',
        flexDirection:'row',
    },
    curve1:{
        backgroundColor: 'rgb(255,255,255)',
    },
    curve2:{
        backgroundColor: '#007bff',
    },
    secondBlock: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007bff',
        height: '40%',
        width: '100%',
        overflow: 'hidden', // Ensure the contents of the block stay within the curved boundary
    },
    logoContainer: {
        width: 150,
        height: 150,
        borderRadius: 75, // Half of the width and height to make it circular
        overflow: 'hidden', // Ensure image stays within the circular boundary
        marginBottom: 20,
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ensure the entire image is covered within the circular boundary
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333333', // Choose your title color
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: 'center',
        color: '#666666', // Choose your subtitle color
    },
    button: {
        backgroundColor: '#007bff', // Choose your button color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff', // Choose your button text color
        fontFamily: 'Comic Sans MS', // Choose a playful font
    },
});

export default WelcomePage;
