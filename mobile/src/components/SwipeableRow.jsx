import React, { useRef } from "react";
import { Animated, PanResponder, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SwipeableRow({ children, onDelete, colors }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const isSwipeLocked = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only set responder for horizontal swipes to the left (dx < 0)
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 8;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Limit swipe range. Swipe left to reveal action (max -80px)
        let newX = gestureState.dx;
        if (isSwipeLocked.current) {
          newX = -80 + gestureState.dx;
        }
        if (newX > 0) newX = 0; // Prevent swiping right
        if (newX < -120) newX = -120; // Clamp max swipe distance
        pan.setValue({ x: newX, y: 0 });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const threshold = isSwipeLocked.current ? -40 : -60;
        if (gestureState.dx < threshold) {
          // Snap open
          Animated.spring(pan, {
            toValue: { x: -80, y: 0 },
            useNativeDriver: false,
            tension: 40,
            friction: 7,
          }).start();
          isSwipeLocked.current = true;
        } else {
          // Snap closed
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            tension: 40,
            friction: 7,
          }).start();
          isSwipeLocked.current = false;
        }
      },
    })
  ).current;

  const reset = () => {
    isSwipeLocked.current = false;
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      tension: 40,
      friction: 7,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Background Delete Action Button */}
      <View style={[styles.background, { backgroundColor: colors.expense }]}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            reset();
            onDelete();
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Swipeable Foreground Container */}
      <Animated.View
        style={[
          styles.foreground,
          {
            transform: [{ translateX: pan.x }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 20,
    marginBottom: 12,
  },
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 20,
  },
  deleteButton: {
    width: 80,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  foreground: {
    backgroundColor: "transparent",
  },
});
