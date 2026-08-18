import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // Google Translation API Function
  const translateAndSpeak = async (text, sourceLang, targetLang) => {
    setLoading(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      const translatedText = data[0][0][0];

      setMessages(prev => [...prev, { id: Date.now(), original: text, translated: translatedText }]);

      Speech.speak(translatedText, { language: targetLang });
    } catch (error) {
      console.error("Translation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechSimulation = () => {
    if (isListening) {
      setIsListening(false);
      translateAndSpeak("നമസ്കാരം, സുഖമാണോ?", "ml", "en");
    } else {
      setIsListening(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>വോയിസ് ട്രാൻസിലേറ്റർ</Text>
      
      <ScrollView style={styles.chatBox}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.msgBubble}>
            <Text style={styles.text}>{msg.original}</Text>
            <Text style={styles.translated}>{msg.translated}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.masterButton, isListening ? styles.active : styles.inactive]} 
        onPress={handleSpeechSimulation}
      >
        <Text style={styles.btnText}>
          {isListening ? "സംസാരിച്ചു കഴിഞ്ഞാൽ ഇവിടെ അമർത്തുക" : "സംസാരിക്കാൻ അമർത്തുക"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  chatBox: { flex: 1 },
  msgBubble: { padding: 15, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  text: { fontSize: 16 },
  translated: { color: 'blue', marginTop: 5, fontStyle: 'italic', fontWeight: '500' },
  masterButton: { padding: 20, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  active: { backgroundColor: '#ff4444' },
  inactive: { backgroundColor: '#4CAF50' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
    
