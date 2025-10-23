import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { loginStyles } from './styles';

const API_URL = 'http://localhost:4000';

export default function LoginScreen() {
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  }

  function validatePassword(password: string): boolean {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  }

  async function handleSubmit() {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) return;

    const endpoint = isSignUp ? '/auth/register' : '/auth/login';
    const body = isSignUp ? { email, password, name: name || 'User' } : { email, password };

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (res.ok) {
        await login(data.token);
      } else {
        if (data.message?.includes('Email already in use')) {
          setEmailError('This email is already registered');
        } else if (data.message?.includes('Invalid credentials')) {
          setPasswordError('Invalid email or password');
        } else {
          setPasswordError(data.message || 'Something went wrong');
        }
      }
    } catch (error) {
      setPasswordError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsSignUp(!isSignUp);
    setEmailError('');
    setPasswordError('');
  }

  return (
    <KeyboardAvoidingView 
      style={loginStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="login-screen"
    >
      <ScrollView 
        contentContainerStyle={loginStyles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        testID="login-scroll-view"
      >
        {/* Header */}
        <View style={loginStyles.header} testID="login-header">
          <Text style={loginStyles.logo} testID="login-logo">✓</Text>
          <Text style={loginStyles.title} testID="login-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
          <Text style={loginStyles.subtitle} testID="login-subtitle">
            {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
          </Text>
        </View>

        {/* Form */}
        <View style={loginStyles.form} testID="login-form">
          {isSignUp && (
            <View style={loginStyles.inputContainer} testID="name-input-container">
              <Text style={loginStyles.label} testID="name-label">Name</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="Your name"
                placeholderTextColor="#b0b0b0"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                testID="name-input"
              />
            </View>
          )}

          <View style={loginStyles.inputContainer} testID="email-input-container">
            <Text style={loginStyles.label} testID="email-label">Email</Text>
            <TextInput
              style={[loginStyles.input, emailError ? loginStyles.inputError : null]}
              placeholder="your@email.com"
              placeholderTextColor="#b0b0b0"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              onBlur={() => email && validateEmail(email)}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="email-input"
            />
            {emailError ? <Text style={loginStyles.errorText} testID="email-error">{emailError}</Text> : null}
          </View>

          <View style={loginStyles.inputContainer} testID="password-input-container">
            <Text style={loginStyles.label} testID="password-label">Password</Text>
            <TextInput
              style={[loginStyles.input, passwordError ? loginStyles.inputError : null]}
              placeholder="Enter your password"
              placeholderTextColor="#b0b0b0"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              onBlur={() => password && validatePassword(password)}
              secureTextEntry
              testID="password-input"
            />
            {passwordError ? <Text style={loginStyles.errorText} testID="password-error">{passwordError}</Text> : null}
          </View>

          <TouchableOpacity 
            style={[loginStyles.submitButton, loading ? loginStyles.submitButtonDisabled : null]} 
            onPress={handleSubmit} 
            activeOpacity={0.8}
            disabled={loading}
            testID="submit-button"
          >
            <Text style={loginStyles.submitButtonText} testID="submit-button-text">
              {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Text>
          </TouchableOpacity>

          <View style={loginStyles.toggleContainer} testID="toggle-container">
            <Text style={loginStyles.toggleText} testID="toggle-text">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={toggleMode} activeOpacity={0.7} testID="toggle-button">
              <Text style={loginStyles.toggleLink} testID="toggle-link">{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
