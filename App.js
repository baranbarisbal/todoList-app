import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications"; // Import Notifications
import color from "./assets/color";
import Task from "./components/Task";

export default function App() {
  const [task, setTask] = useState("");
  const [taskItems, setTaskItems] = useState([]);
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const handleAddTask = () => {
    if (!task.trim()) return;

    Keyboard.dismiss();
    const newTask = {
      id: Date.now(),
      task: task.trim(),
      time: null,
    };

    setTaskItems([...taskItems, newTask]);
    setTask("");
  };

  const scheduleNotification = async () => {
    // Request permissions directly from expo-notifications
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();

      if (newStatus !== "granted") {
        alert("Notification permission not granted!");
        return;
      }
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }
    // Schedule a notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't Forget What You Noted",
        body: "Main body content of the notification",
        data: { customData: "Some custom data" },
      },
      trigger: { seconds: 2 },
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <View style={styles.items}>
            {taskItems.map((item) => (
              <TouchableOpacity key={item?.id}>
                <Task
                  item={item}
                  taskItems={taskItems}
                  setTaskItems={setTaskItems}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder="Write a task"
            value={task}
            onChangeText={(text) => setTask(text)}
          />

          <TouchableOpacity onPress={handleAddTask}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: color.secondary,
    borderRadius: 60,
    borderColor: color.borderColor,
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: color.secondary,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.borderColor,
    borderWidth: 1,
  },
  addText: {
    fontSize: 24,
    color: "black",
  },
});
