import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { audioOption, documentOption, imageOption, questionAnswerOption, selectionHeading, videoOption } from './constants';

function SelectionPage({ navigation }: { navigation: NavigationProp<any> }) {
    return (
        <View style={styles.container}>
          <Text style={styles.heading}>{selectionHeading}</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate('PdfForm')}
            >
              <Text style={styles.optionText}>{documentOption}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate('VideoForm')}
            >
              <Text style={styles.optionText}>{videoOption}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate('ImageForm')}
            >
              <Text style={styles.optionText}>{imageOption}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate('AudioForm')}
            >
              <Text style={styles.optionText}>{audioOption}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate('QuestionAnswer')}
            >
              <Text style={styles.optionText}>{questionAnswerOption}</Text>
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
        backgroundColor: '#fff',
      },
      heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
      },
      optionsContainer: {
        alignItems: 'center',
      },
      option: {
        width:270,
        backgroundColor: '#f0f0f0',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 15,
        borderRadius: 10,
    
      },
      optionText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Arial', // Change to any fancy font you prefer
        color: '#333',
        textAlign:'center'
      },
    });
    

export default SelectionPage;
