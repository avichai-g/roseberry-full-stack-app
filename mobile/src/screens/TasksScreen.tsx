import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { tasksStyles } from './styles';
import { Task } from './types';

const API_URL = 'http://localhost:4000';

export default function TasksScreen() {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category] = useState('Personal');
  const [searchQuery, setSearchQuery] = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`, { headers });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addTask() {
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: title.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => [data, ...prev]);
        setTitle('');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function toggleTask(id: number, completed: boolean) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ completed: !completed }),
      });
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteTask(id: number) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Search logic
  const filteredTasks = useMemo(() => {
    if (searchQuery.trim()) {
      return tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return tasks;
  }, [tasks, searchQuery]);

  const completedTasks = filteredTasks.filter((t) => t.completed);
  const incompleteTasks = filteredTasks.filter((t) => !t.completed);
  const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  return (
    <View style={tasksStyles.container} testID="tasks-screen">
      {/* Header */}
      <View style={tasksStyles.header} testID="tasks-header">
        <View testID="greeting-container">
          <Text style={tasksStyles.greeting} testID="greeting-text">Hello 👋</Text>
          <Text style={tasksStyles.subtitle} testID="subtitle-text">Let's get things done</Text>
        </View>
        <TouchableOpacity style={tasksStyles.logoutButton} onPress={logout} testID="logout-button">
          <Text style={tasksStyles.logoutText} testID="logout-text">Log Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={tasksStyles.content} showsVerticalScrollIndicator={false} testID="tasks-scroll-view">
        {/* Stats Card */}
        <View style={tasksStyles.statsCard} testID="stats-card">
          <View style={tasksStyles.statsHeader} testID="stats-header">
            <Text style={tasksStyles.statsTitle} testID="stats-title">{category}</Text>
            <Text style={tasksStyles.statsCount} testID="stats-count">{incompleteTasks.length} tasks left</Text>
          </View>
          <View style={tasksStyles.progressContainer} testID="progress-container">
            <View style={tasksStyles.progressBar} testID="progress-bar">
              <View style={[tasksStyles.progressFill, { width: `${progress}%` }]} testID="progress-fill" />
            </View>
            <Text style={tasksStyles.progressText} testID="progress-text">{Math.round(progress)}%</Text>
          </View>
          <Text style={tasksStyles.statsSubtext} testID="stats-subtext">
            {completedTasks.length} of {tasks.length} completed
          </Text>
        </View>

        {/* Search */}
        <View style={tasksStyles.searchSortSection} testID="search-sort-section">
          {/* Search Bar */}
          <View style={tasksStyles.searchContainer} testID="search-container">
            <TextInput
              style={tasksStyles.searchInput}
              placeholder="Search tasks..."
              placeholderTextColor="#b0b0b0"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="search-input"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={tasksStyles.clearSearchButton}
                onPress={() => setSearchQuery('')}
                testID="clear-search-button"
              >
                <Text style={tasksStyles.clearSearchIcon}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Add Task */}
        <View style={tasksStyles.addTaskSection} testID="add-task-section">
          <Text style={tasksStyles.sectionTitle} testID="add-task-title">Add Task</Text>
          <View style={tasksStyles.addTaskCard} testID="add-task-card">
            <TextInput
              style={tasksStyles.addTaskInput}
              placeholder="What do you want to do?"
              placeholderTextColor="#b0b0b0"
              value={title}
              onChangeText={setTitle}
              onSubmitEditing={addTask}
              returnKeyType="done"
              testID="add-task-input"
            />
            <TouchableOpacity 
              style={tasksStyles.addButton} 
              onPress={addTask}
              disabled={!title.trim()}
              testID="add-task-button"
            >
              <Text style={tasksStyles.addButtonIcon} testID="add-task-icon">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tasks List */}
        <View style={tasksStyles.tasksSection} testID="tasks-section">
          <Text style={tasksStyles.sectionTitle} testID="tasks-title">Today's Tasks</Text>
          
          {loading ? (
            <View style={tasksStyles.emptyState} testID="loading-state">
              <Text style={tasksStyles.emptyText} testID="loading-text">Loading...</Text>
            </View>
          ) : tasks.length === 0 ? (
            <View style={tasksStyles.emptyState} testID="empty-state">
              <Text style={tasksStyles.emptyIcon} testID="empty-icon">📝</Text>
              <Text style={tasksStyles.emptyTitle} testID="empty-title">No tasks yet</Text>
              <Text style={tasksStyles.emptySubtitle} testID="empty-subtitle">Add your first task above to get started</Text>
            </View>
          ) : filteredTasks.length === 0 ? (
            <View style={tasksStyles.emptyState} testID="no-results-state">
              <Text style={tasksStyles.emptyIcon} testID="no-results-icon">🔍</Text>
              <Text style={tasksStyles.emptyTitle} testID="no-results-title">No tasks found</Text>
              <Text style={tasksStyles.emptySubtitle} testID="no-results-subtitle">
                {searchQuery ? `No tasks match "${searchQuery}"` : 'Try adjusting your search'}
              </Text>
            </View>
          ) : (
            <>
              {/* Incomplete Tasks */}
              {incompleteTasks.map((task) => (
                <View key={task.id} style={tasksStyles.taskCard} testID={`task-item-${task.id}`}>
                  <TouchableOpacity
                    style={tasksStyles.taskCheckbox}
                    onPress={() => toggleTask(task.id, task.completed)}
                    activeOpacity={0.7}
                    testID={`task-checkbox-${task.id}`}
                  >
                    <View style={tasksStyles.checkbox} testID={`checkbox-${task.id}`} />
                  </TouchableOpacity>
                  <Text style={tasksStyles.taskTitle} testID={`task-title-${task.id}`}>{task.title}</Text>
                  <TouchableOpacity
                    style={tasksStyles.deleteButton}
                    onPress={() => deleteTask(task.id)}
                    activeOpacity={0.7}
                    testID={`delete-button-${task.id}`}
                  >
                    <Text style={tasksStyles.deleteIcon} testID={`delete-icon-${task.id}`}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <>
                  <Text style={tasksStyles.completedHeader} testID="completed-header">
                    Completed ({completedTasks.length})
                  </Text>
                  {completedTasks.map((task) => (
                    <View key={task.id} style={[tasksStyles.taskCard, tasksStyles.taskCardCompleted]} testID={`completed-task-item-${task.id}`}>
                      <TouchableOpacity
                        style={tasksStyles.taskCheckbox}
                        onPress={() => toggleTask(task.id, task.completed)}
                        activeOpacity={0.7}
                        testID={`completed-task-checkbox-${task.id}`}
                      >
                        <View style={tasksStyles.checkboxChecked} testID={`checkbox-checked-${task.id}`}>
                          <Text style={tasksStyles.checkmark} testID={`checkmark-${task.id}`}>✓</Text>
                        </View>
                      </TouchableOpacity>
                      <Text style={tasksStyles.taskTitleCompleted} testID={`completed-task-title-${task.id}`}>{task.title}</Text>
                      <TouchableOpacity
                        style={tasksStyles.deleteButton}
                        onPress={() => deleteTask(task.id)}
                        activeOpacity={0.7}
                        testID={`completed-delete-button-${task.id}`}
                      >
                        <Text style={tasksStyles.deleteIcon} testID={`completed-delete-icon-${task.id}`}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}
            </>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
