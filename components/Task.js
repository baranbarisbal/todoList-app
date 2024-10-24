import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import color from "../assets/color";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon2 from "react-native-vector-icons/AntDesign";
import { useState } from "react";

const Task = ({ item, taskItems, setTaskItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(item?.time || new Date());
  const [taskText, setTaskText] = useState(item?.task);
  const maxChars = 22;

  const completeTask = (id) => {
    const filteredTasks = taskItems?.filter((items) => items?.id !== id);
    setTaskItems(filteredTasks);
  };

  const editTask = () => {
    setIsEditing(!isEditing);
  };

  const saveTask = () => {
    if (!taskText.trim()) {
      alert("Task cannot be empty.");
      return;
    }

    const updatedTasks = taskItems.map((task) => {
      if (task.id === item.id) {
        return { ...task, task: taskText };
      }
      return task;
    });

    setTaskItems(updatedTasks);
    setIsEditing(false);
  };

  const openDatePicker = () => {
    setOpen(true);
  };

  const closeDatePicker = () => {
    setOpen(false);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setOpen(false);
      setDate(currentDate);

      const updatedTasks = taskItems.map((task) => {
        if (task.id === item.id) {
          return { ...task, time: currentDate };
        }
        return task;
      });
      setTaskItems(updatedTasks);
    } else {
      setOpen(false);
    }
  };
  console.log(item.time, "item");
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <TouchableOpacity
          onPress={() => completeTask(item?.id)}
          style={styles.square}
        />
        <TouchableOpacity style={styles.textDiv} onPress={editTask}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.itemText}
                value={taskText}
                onChangeText={setTaskText}
              />
              <Icon2
                name="check"
                size={20}
                color={color.square}
                onPress={saveTask}
              />
            </>
          ) : (
            <>
              <Text style={styles.editTask}>
                {taskText.length > maxChars
                  ? `${taskText.slice(0, maxChars)}...`
                  : taskText}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.timeDiv}
        onPressOut={closeDatePicker}
        onPress={openDatePicker}
      >
        {open ? (
          <>
            <DateTimePicker
              value={date}
              mode="time"
              display="clock"
              onChange={onChange}
              style={styles.timePicker}
            />
          </>
        ) : (
          <>
            <View>
              {item?.time ? (
                <>
                  <Text style={{ right: isEditing && 7 }}>
                    {new Date(item?.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </>
              ) : (
                <>
                  <Icon2 name="clockcircleo" size={18} color={color.square} />
                </>
              )}
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  item: {
    backgroundColor: color.secondary,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexGrow: 1,
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: color.square,
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
    marginTop: Platform.OS === "android" ? 4 : 0,
  },
  itemText: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    justifyContent: "center",
    maxWidth: "70%",
  },
  textDiv: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  editTask: {
    textAlignVertical: "center",
  },
  timePicker: {
    color: "#fff",
  },
});
