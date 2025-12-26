import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, {
  Polyline,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

type Props = {
  data: number[];
  height?: number;
};

export function LineChart({ data, height = 160 }: Props) {
  const { width: screenWidth } = Dimensions.get('window');
  const width = screenWidth - 64;
  const padding = 24;

  const min = 0;
  const max = Math.max(...data, 1);

  const points = useMemo(() => {
    if (data.length < 2) {
      return '';
    }

    return data
      .map((v, i) => {
        const x =
          padding +
          (i * (width - padding * 2)) /
            (data.length - 1);

        const y =
          height -
          padding -
          ((v - min) / (max - min)) *
            (height - padding * 2);

        return `${x},${y}`;
      })
      .join(' ');
  }, [data, height, width, padding, min, max]);

  /* ===== RENDER ===== */

  if (data.length < 2) {
    return (
      <View style={styles.empty}>
        <Text>Brak danych do wykresu</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient
            id="lineGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <Stop offset="0%" stopColor="#2563EB" />
            <Stop offset="100%" stopColor="#60A5FA" />
          </LinearGradient>
        </Defs>

        <Polyline
          points={points}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((v, i) => {
          const x =
            padding +
            (i * (width - padding * 2)) /
              (data.length - 1);

          const y =
            height -
            padding -
            (v / max) * (height - padding * 2);

          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill="#2563EB"
            />
          );
        })}
      </Svg>

      <View
        style={[
          styles.labels,
          { width, paddingHorizontal: padding },
        ]}
      >
        {data.map((v, i) => (
          <Text key={i} style={styles.label}>
            {v}
          </Text>
        ))}
      </View>
    </View>
  );
}

/* =========================
   STYLES
   ========================= */

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
  },

  empty: {
    padding: 16,
    alignItems: 'center',
  },
});
