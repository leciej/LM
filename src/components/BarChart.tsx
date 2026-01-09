import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

/* =========================
   TYPES
   ========================= */

type BarChartProps = {
  seriesA: number[];
  seriesB: number[];
  labelA?: string;
  labelB?: string;
};

/* =========================
   CONSTANTS
   ========================= */

const DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];
const CHART_HEIGHT = 160;
const GRID_LINES = 4;
const MIN_BAR_HEIGHT = 16;

/* =========================
   COMPONENT
   ========================= */

export function BarChart({
  seriesA,
  seriesB,
  labelA = 'Zakupy',
  labelB = 'Aktywności',
}: BarChartProps) {
  const safeA = DAYS.map((_, i) => seriesA[i] ?? 0);
  const safeB = DAYS.map((_, i) => seriesB[i] ?? 0);

  const maxValue = Math.max(
    ...safeA,
    ...safeB,
    1
  );

  const anim = useRef(
    DAYS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.stagger(
      80,
      anim.map(a =>
        Animated.spring(a, {
          toValue: 1,
          friction: 6,
          useNativeDriver: false,
        })
      )
    ).start();
  }, [anim]);

  return (
    <View>
      {/* GRID */}
      <View style={styles.grid}>
        {Array.from({ length: GRID_LINES }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.gridLine,
              {
                bottom:
                  (i / (GRID_LINES - 1)) *
                  CHART_HEIGHT,
              },
            ]}
          />
        ))}
      </View>

      {/* CHART */}
      <View style={styles.chart}>
        {DAYS.map((day, i) => {
          const valA = safeA[i];
          const valB = safeB[i];

          const hA = Math.max(
            (valA / maxValue) * CHART_HEIGHT,
            MIN_BAR_HEIGHT
          );
          const hB = Math.max(
            (valB / maxValue) * CHART_HEIGHT,
            MIN_BAR_HEIGHT
          );

          return (
            <View key={day} style={styles.column}>
              <View style={styles.bars}>
                {/* BAR A */}
                <Animated.View
                  style={[
                    styles.bar,
                    styles.barA,
                    {
                      height: anim[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, hA],
                      }),
                    },
                  ]}
                >
                  <VerticalNumber value={valA} />
                </Animated.View>

                {/* BAR B */}
                <Animated.View
                  style={[
                    styles.bar,
                    styles.barB,
                    {
                      height: anim[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, hB],
                      }),
                    },
                  ]}
                >
                  <VerticalNumber value={valB} />
                </Animated.View>
              </View>

              <Text style={styles.label}>{day}</Text>
            </View>
          );
        })}
      </View>

      {/* LEGEND */}
      <View style={styles.legend}>
        <LegendItem color="#93C5FD" label={labelA} />
        <LegendItem color="#86EFAC" label={labelB} />
      </View>
    </View>
  );
}

/* =========================
   HELPERS
   ========================= */

function VerticalNumber({ value }: { value: number }) {
  const digits = String(value).split('');

  return (
    <View style={styles.verticalNumber}>
      {digits.map((d, i) => (
        <Text key={i} style={styles.barValue}>
          {d}
        </Text>
      ))}
    </View>
  );
}

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          { backgroundColor: color },
        ]}
      />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

/* =========================
   STYLES
   ========================= */

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
    marginTop: 12,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 6,
    marginHorizontal: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  barA: {
    backgroundColor: '#93C5FD',
  },
  barB: {
    backgroundColor: '#86EFAC',
  },
  verticalNumber: {
    alignItems: 'center',
  },
  barValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
    lineHeight: 12,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
  },
  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: CHART_HEIGHT,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});
