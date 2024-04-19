import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { demoHeading, welcomeHeading, welcomeSubHeading } from './constants';

function WelcomePage({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.firstBlock}>
        <View style={styles.logoContainer}>
          <Image source={require('./assets/solution.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>{welcomeHeading}</Text>
        <Text style={styles.subtitle}>{welcomeSubHeading}</Text>
      </View>
      <Svg height="100%" width="100%" viewBox="0 0 1440 320">
        <Path
          fill="#007bff"
          fillOpacity="1"
          d="M0,288L48,245.3C96,203,192,117,288,96C384,75,480,117,576,149.3C672,181,768,203,864,213.3C960,224,1056,224,1152,192C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </Svg>
      <View style={styles.secondBlock}>
        {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Demo')}> */}
          <Text style={styles.buttonText}>{demoHeading}</Text>
        {/* </TouchableOpacity> */}
         <TouchableOpacity onPress={() => navigation.navigate('Select')} style={styles.navBtn}>
        <Icon
        source={'arrow-right-thick'}
        size={28}
        color='rgb(255,255,255)'
        /></TouchableOpacity> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(243, 245, 238)',
  },
  firstBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    height: '50%',
  },
  navBtn:{
position:'absolute',
bottom:15,
right:15
  },
  secondBlock: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    width: '100%',
    overflow: 'hidden', // Ensure the contents of the block stay within the curved boundary
    height:'45%'
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
    fontWeight:'500'
  },
  button: {
    backgroundColor: '#007bff', // Choose your button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff', // Choose your button text color
    fontFamily: 'Comic Sans MS', // Choose a playful font
  },
});

export default WelcomePage;
