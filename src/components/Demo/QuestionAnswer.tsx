//@ts-nocheck
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { questionHeading, questionPlaceholder, submit } from './constants';

const QuestionAnswer = () => {
  const navigation = useNavigation();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [animation] = useState(new Animated.Value(0));


  // Mock function to simulate fetching answer from API
async function fetchAnswerFromAPI(question) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const responses = {
    "What is the meaning of life?": "42",
    "How does gravity work?": "Gravity is a force that pulls objects with mass toward each other.",
  };
  return responses[question] || "Sorry, I don't have an answer for that.";
}


  const submitQuestion = async () => {
    // Assume you have a function to fetch the answer from an API
    setLoading(true);
    try {
      const response = await fetchAnswerFromAPI(question);
      setAnswer(response);
      // Slide animation
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error fetching answer:', error);
    } finally {
      setLoading(false);
    }
  };

  const slideIn = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backIconContainer} onPress={()=>{navigation.goBack()}}>
      <Icon
      source={'arrow-left-bold-circle'}
      size={35}
      color='rgb(120,120,120)'
      />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backIconContainer} onPress={() => navigation.goBack()}>
        <Icon name={'arrow-left-bold-circle'} size={35} color='rgb(120,120,120)' />
      </TouchableOpacity>
      <Text style={styles.title}>{questionHeading}</Text>
      <TextInput
        style={styles.input}
        placeholder={questionPlaceholder}
        multiline={true}
        onChangeText={text => setQuestion(text)}
        value={question}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submitQuestion}>
        <Text style={styles.submitButtonText}>{submit}</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator style={styles.spinner} size="large" color="rgb(120,120,120)" />
      ) : (
        <Animated.View style={[styles.answerContainer, { transform: [{ translateY: slideIn }] }]}>
          <Text style={styles.answerText}>{answer}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  backIconContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    textShadowColor: '#ccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 20,
  },
  submitButton: {
    backgroundColor: '#ff5e7d',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  spinner: {
    marginTop: 20,
  },
  answerContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffe6b3',
    borderRadius: 10,
    width: '100%',
  },
  answerText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
  },
});

export default QuestionAnswer;
