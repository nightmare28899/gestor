import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView } from "react-native";

const Loader = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(dots => (dots.length < 3 ? dots + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={[styles.text, { color: "#fff", fontSize: 24 }]}>Cargando{dots}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 9999,
  },
  content: {
    alignItems: "center",
    elevation: 1,
    zIndex: 9999,
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 24,
    marginTop: 10,
  },
});

export default Loader;
