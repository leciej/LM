import React, { useMemo, useId } from 'react';
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
  const instanceId = useId();

  const { width: screenWidth } = Dimensions.get('window');
  const width = screenWidth - 64;
  const padding = 24;

  const safeData = useMemo(
    () => (data.length >= 2 ? data : [0, 0]),
    [data]
  );

  const min = 0;
  const max = Math.max(...safeData, 1);

  const points = useMemo(() => {
    return safeData
      .map((v, i) => {
        const x =
          padding +
          (i * (width - padding * 2)) /
            (safeData.length - 1);

        const y =
          height -
          padding -
          ((v - min) / (max - min)) *
            (height - padding * 2);

        return `${x},${y}`;
      })
      .join(' ');
  }, [safeData, height, width, padding, min, max]);

  return (
    <View style={styles.container} key={`chart-${instanceId}`}>
      <Svg
        key={`svg-${instanceId}`}
        width={width}
        height={height}
      >
        <Defs>
          <LinearGradient
            id={`grad-${instanceId}`}
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
          stroke={`url(#grad-${instanceId})`}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {safeData.map((v, i) => {
          const x =
            padding +
            (i * (width - padding * 2)) /
              (safeData.length - 1);

          const y =
            height -
            padding -
            (v / max) * (height - padding * 2);

          return (
            <Circle
              key={`pt-${instanceId}-${i}`}
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
        {safeData.map((v, i) => (
          <Text
            key={`lbl-${instanceId}-${i}`}
            style={styles.label}
          >
            {v}
          </Text>
        ))}
      </View>
    </View>
  );
}

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
});
