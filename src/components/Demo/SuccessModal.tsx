import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal, Icon } from 'react-native-paper';
import { success } from './constants';

interface ModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const CustomModal: React.FC<ModalProps> = ({ visible, onDismiss}) => {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <TouchableOpacity onPress={onDismiss}>
        <View style={styles.modalContent}>

          <Icon
            source="thumb-up"
            size={55}
            color='rgb(255,255,255)'
          />
          <Text style={styles.text}>{success}</Text>
        </View>
        </TouchableOpacity>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'green',
    borderRadius: 100, // Set a large enough value to make it circular
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Add elevation for shadow effect
  },
  text: {
    textAlign: 'center',
    fontSize: 23,
    padding:5,
    fontWeight:'bold',
    color:'rgb(255,255,255)',
  },
});
