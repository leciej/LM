import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
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
const BAR_WIDTH = 16;

/* =========================
   COMPONENT
   ========================= */

export function BarChart({
  seriesA,
  seriesB,
  labelA = 'Zamówienia',
  labelB = 'Przychód',
}: BarChartProps) {
  const maxValue = Math.max(...seriesA, ...seriesB, 1);

  const anim = useRef(
    DAYS.map(() => new Animated.Value(0))
  ).current;

  const [active, setActive] = useState<{
    value: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    Animated.stagger(
      80,
      anim.map(a =>
        Animated.spring(a, {
          toValue: 1,
          useNativeDriver: false,
        })
      )
    ).start();
  }, [anim]);

  return (
    <View>
      {}
      <View style={styles.grid}>
        {Array.from({ length: GRID_LINES + 1 }).map(
          (_, i) => (
            <View
              key={i}
              style={[
                styles.gridLine,
                {
                  bottom:
                    (i / GRID_LINES) *
                    CHART_HEIGHT,
                },
              ]}
            >
              <Text style={styles.gridLabel}>
                {Math.round(
                  (maxValue / GRID_LINES) * i
                )}
              </Text>
            </View>
          )
        )}
      </View>

      {}
      <View style={styles.chart}>
        {DAYS.map((day, i) => {
          const hA =
            (seriesA[i] / maxValue) *
            CHART_HEIGHT;
          const hB =
            (seriesB[i] / maxValue) *
            CHART_HEIGHT;

          return (
            <View key={day} style={styles.column}>
              <View style={styles.bars}>
                <Pressable
                  onPress={() =>
                    setActive({
                      value: seriesA[i],
                      label: labelA,
                    })
                  }
                >
                  <Animated.View
                    style={[
                      styles.bar,
                      styles.barA,
                      {
                        height: anim[i].interpolate(
                          {
                            inputRange: [0, 1],
                            outputRange: [0, hA],
                          }
                        ),
                      },
                    ]}
                  />
                </Pressable>

                <Pressable
                  onPress={() =>
                    setActive({
                      value: seriesB[i],
                      label: labelB,
                    })
                  }
                >
                  <Animated.View
                    style={[
                      styles.bar,
                      styles.barB,
                      {
                        height: anim[i].interpolate(
                          {
                            inputRange: [0, 1],
                            outputRange: [0, hB],
                          }
                        ),
                      },
                    ]}
                  />
                </Pressable>
              </View>

              <Text style={styles.dayLabel}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      {}
      {active && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            {active.label}:{' '}
            <Text style={styles.tooltipValue}>
              {active.value}
            </Text>
          </Text>
        </View>
      )}

      {}
      <View style={styles.legend}>
        <LegendItem
          color="#93C5FD"
          label={labelA}
        />
        <LegendItem
          color="#86EFAC"
          label={labelB}
        />
      </View>
    </View>
  );
}

/* =========================
   HELPERS
   ========================= */

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
      <Text style={styles.legendText}>
        {label}
      </Text>
    </View>
  );
}

/* =========================
   STYLES
   ========================= */

const styles = StyleSheet.create({
  chart: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 6,
  },
  barA: {
    backgroundColor: '#93C5FD',
  },
  barB: {
    backgroundColor: '#86EFAC',
  },
  dayLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
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
  gridLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
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
    fontWeight: '700',
    color: '#111827',
  },
  tooltip: {
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
  tooltipValue: {
    fontWeight: '800',
  },
});
