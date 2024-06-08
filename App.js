import React, { useRef, useState } from "react";
import { Modal, ScrollView, Text, View, StyleSheet, PanResponder, Animated, Dimensions } from "react-native";
import ModalHeader from "./components/ModalHeader";
import PickupMap from "./components/PickupMap";
import PickupDetails from "./components/PickupDetails";


const { height: screenHeight } = Dimensions.get('window');
const SNAP_TOP = 50;
const SNAP_BOTTOM = screenHeight - 560;



export default function PickupConfirmation({ isVisible, onClose }) {
  const [modalVisible, setModalVisible] = useState(true);

  const handleClose = () => {
    setModalVisible(false);
  };

  const translateY = useRef(new Animated.Value(SNAP_BOTTOM)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newY = Math.min(Math.max(SNAP_TOP, translateY._value + gestureState.dy), SNAP_BOTTOM);
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          Animated.timing(translateY, {
            toValue: SNAP_BOTTOM,
            duration: 300,
            useNativeDriver: true,
          }).start(onClose);
        } else if (gestureState.dy < -50) {
          Animated.timing(translateY, {
            toValue: SNAP_TOP,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          transform: [{ translateY }],
        }}
        {...panResponder.panHandlers}
      >
        <ScrollView
         showsVerticalScrollIndicator={true}
          style={{
            backgroundColor: "white",
          }}
        >
          <ModalHeader onClose={handleClose} />
          <View style={modalStyles.innerContainer}>
            <PickupMap />
            <PickupDetails
              onReject={handleClose}
              onPickup={() => {} /* I assume you have your own handler for this */ }
            />
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  innerContainer: {
    // paddingHorizontal: 20,
    flex:1
  },


});

