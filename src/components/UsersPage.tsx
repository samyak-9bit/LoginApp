import React, { useEffect, useState } from 'react';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar, Icon } from 'react-native-paper';
import { deleteFailureMessage, deleteSuccessMessage, getDataError, usersPageTitle } from '../constants';
import { showToast } from './common Functions/ShowErrorToast';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  pin?: string;
  isSuperUser?: boolean;
}


function UsersPage({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try{
      const resp = await fetch("http://192.168.1.22:9001/askdb/entity/users");
      const data = await resp.json();
      setUsers(data);
    }
    catch(error){
      showToast(getDataError);
      console.error('Error during fetching:', error);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );
  const deleteUser = async(id:String)=>{
    try{
      const resp = await fetch('http://192.168.1.22:9001/askdb/entity/users/'+id , {
      method: 'DELETE',
      });
      if(resp.status===200){
        showToast(deleteSuccessMessage);
        fetchData();
      }else{
        showToast(deleteFailureMessage);
      }
    }catch(error){
      showToast('Error in deleting: '+error);
      console.error('Error during fetching:', error);
    }
  }


  // const users: User[] = [
  //   {
  //     "_id": "660659a01ca73aa14bac5c6a",
  //     "email": "james@ninebit.in",
  //     "name": "James",
  //     "password": "123",
  //     "pin": "452010"
  //   },
  //   {
  //     "_id": "66065c657b9e7ac0c3064a0e",
  //     "name": "john",
  //     "email": "john@gmail.com",
  //     "password": "John@12345",
  //     "isSuperUser": false
  //   },
  //   {
  //     "_id": "66066aa0f600d78f5fdd01b3",
  //     "name": "john",
  //     "email": "john1@gmail.com",
  //     "password": "John@12345",
  //     "isSuperUser": true
  //   },
  // ];

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.iconContainer}>
      <Avatar.Image size={45} source={require('../assets/man.png')} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.email}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => {navigation.navigate('UserUpsert',{ user:
                      { userId: item._id,
                        name: item.name,
                        email: item.email,
                        password: item.password,                     
                      } }
                      
                    )}}>
          <Icon
          size={25}
          source='pencil'
          />
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => {deleteUser(item._id)}}>
          <Icon
          size={24}
          source='delete'
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );


  return (
    <View>
      <Appbar.Header style={styles.topbar}>
        <Appbar.BackAction color='rgb(255,255,255)' onPress={() => {navigation.goBack()}} />
        <Appbar.Content title={usersPageTitle} titleStyle={styles.titleStyle} />
        <Appbar.Action icon="plus" color='rgb(255,255,255)' size={32} onPress={() => {navigation.navigate('UserUpsert',{ user:
                      { userId: '',
                        name: '',      
                        email: '',
                        password: '',                     
                      } } )}} />
      </Appbar.Header>
      {loading && <ActivityIndicator size="large" color='rgb(34,84,211)' style={{marginTop:15}}/>}
    <ScrollView>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item._id} 
        style={styles.container}
      />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: 'rgb(34,84,211)',
  },
  titleStyle: {
    color: 'rgb(255,255,255)',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconContainer: {
    paddingHorizontal: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
}); 

export default UsersPage;
