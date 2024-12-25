import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import * as Camera from "expo-camera";

const Drawer = createDrawerNavigator();

type Post = {
  id: string;
  text: string;
  image: string | null;
};

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <TextInput placeholder="Name" style={styles.input} />
        <TextInput placeholder="Email" style={styles.input} />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => alert("Profile updated!")}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeScreen() {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const confirmPost = () => {
    if (!text.trim()) {
      alert("Please enter some text to post.");
      return;
    }

    Alert.alert("Confirm Post", "Are you sure you want to post this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Post",
        onPress: () => {
          setPosts((prevPosts) => [
            { id: Date.now().toString(), text, image },
            ...prevPosts,
          ]);
          setText("");
          setImage(null);
        },
      },
    ]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <View>
            <View style={styles.card}>
              <TextInput
                style={styles.textInput}
                placeholder="What's on your mind?"
                value={text}
                onChangeText={setText}
              />
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={pickImage}>
                  <FontAwesome name="image" size={24} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto}>
                  <FontAwesome name="camera" size={24} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmPost}>
                  <FontAwesome name="send" size={24} color="blue" />
                </TouchableOpacity>
              </View>
              {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            </View>
            {/* Spacer under the post form */}
            <View style={{ height: 20 }} />
          </View>
        }
      />
    </View>
  );
}

export default function App() {
  return (
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  flatList: {
    flex: 1,
    // No margin or padding to keep the scrollbar at the screen's edge
  },
  flatListContent: {
    paddingTop: 20, // Top margin for content
    paddingBottom: 20, // Bottom margin for content
    paddingHorizontal: 15, // Left and right margins for content
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  post: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },

  
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
