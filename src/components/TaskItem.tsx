import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import type { Task } from '../features/tasks/queries';

type Props = {
  task: Task;
  onPress: (id: string) => void;
};

export function TaskItem({ task, onPress }: Props) {
  return (
    <Pressable onPress={() => onPress(task.id)} style={styles.container}>
      <Text style={styles.checkbox}>{task.completed ? '✅' : '⬜'}</Text>

      <Text style={[styles.title, task.completed && styles.completed]}>
        {task.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    marginRight: 8,
    fontSize: 18,
  },
  title: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});
