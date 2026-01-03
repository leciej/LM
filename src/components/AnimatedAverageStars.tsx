import React, { useEffect, useMemo } from "react";
import { View, Animated, StyleSheet } from "react-native";

type Props = {
  value: number; // np. 4.5
  size?: number;
};

export function AnimatedAverageStars({
  value,
  size = 32,
}: Props) {
  const animations = useMemo(
    () =>
      Array.from({ length: 5 }, () => ({
        scale: new Animated.Value(0.8),
        fill: new Animated.Value(0),
      })),
    []
  );

  useEffect(() => {
    const fullStars = Math.floor(value);
    const hasHalf = value - fullStars >= 0.5;

    const anims: Animated.CompositeAnimation[] = [];

    animations.forEach((a, i) => {
      const targetFill =
        i < fullStars
          ? 1
          : i === fullStars && hasHalf
          ? 0.5
          : 0;

      anims.push(
        Animated.sequence([
          Animated.spring(a.scale, {
            toValue: 1.15,
            useNativeDriver: true,
          }),
          Animated.spring(a.scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(a.fill, {
            toValue: targetFill,
            duration: 250,
            useNativeDriver: false,
          }),
        ])
      );
    });

    Animated.stagger(80, anims).start();
  }, [value, animations]);

  return (
    <View style={styles.row}>
      {animations.map((a, i) => (
        <Animated.View
          key={i}
          style={{ transform: [{ scale: a.scale }] }}
        >
          <View
            style={[
              styles.starContainer,
              { width: size, height: size },
            ]}
          >
            {/* tło */}
            <Animated.Text
              style={[
                styles.star,
                { fontSize: size, color: "#ccc" },
              ]}
            >
              ★
            </Animated.Text>

            {/* wypełnienie */}
            <Animated.View
              style={[
                styles.fill,
                {
                  width: a.fill.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.star,
                  {
                    fontSize: size,
                    color: "#f5b301",
                  },
                ]}
              >
                ★
              </Animated.Text>
            </Animated.View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  starContainer: {
    position: "relative",
    overflow: "hidden",
    marginRight: 4,
  },
  star: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    overflow: "hidden",
  },
});
