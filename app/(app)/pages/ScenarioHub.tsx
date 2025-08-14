import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScenarioList } from "../../../components/ScenarioList";
import { ScenarioSimulator } from "../../../components/ScenarioSimulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../../api/api"; // Adjust the import path as necessary
import axios from "axios";
import Loader from "../../../components/Loader";

const COMPLETED_SCENARIOS_KEY = "completed_scenarios";

export default function ScenarioHub() {
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(
    null
  );
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletedScenarios();
  }, []);

  const loadCompletedScenarios = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/progress?type=scenario`);
      const data = response.data;

      if (data.progress) {
        const completed = data.progress.map((item) => item.scenarioId);
        console.log("Completed scenarios:", completed);

        setCompletedScenarios(completed);

        // Save to AsyncStorage
        await AsyncStorage.setItem(
          COMPLETED_SCENARIOS_KEY,
          JSON.stringify(completed)
        );
      }
      setLoading(false);

      // If you want to fallback to local storage if no progress is returned
      // else {
      //   const stored = await AsyncStorage.getItem(COMPLETED_SCENARIOS_KEY);
      //   if (stored) {
      //     setCompletedScenarios(JSON.parse(stored));
      //   }
      // }
    } catch (error) {
      console.error("Failed to load completed scenarios:", error);
    }
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setCurrentScenarioId(scenarioId);
  };

  const handleScenarioComplete = async (result) => {
    console.log("Scenario complete result:", result);
    const response = await API.post(`/scenarios/${result.scenarioId}/submit`, {
      choiceId: result.choiceId,
      timeSpent: result.timeSpent,
    });
    // console.log("Scenario", response.data.choice);
    return [response.data.choice, response.data.points]; // Assuming the API returns the updated scenario data

    // console.log("Scenario completion response:", response.data);
    // if (result.scenarioId) {
    //   saveCompletedScenario(result.scenarioId);
    // }
    // setCurrentScenarioId(null);
  };

  const handleExit = () => {
    setCurrentScenarioId(null);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <Loader />
      </SafeAreaView>
    );
  }

  if (currentScenarioId) {
    return (
      <ScenarioSimulator
        scenarioId={currentScenarioId}
        onComplete={handleScenarioComplete}
        onExit={handleExit}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScenarioList
        onScenarioSelect={handleScenarioSelect}
        completedScenarios={completedScenarios}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
  },
});
