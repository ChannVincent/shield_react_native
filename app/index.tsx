import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

type Post = {
  id: string;
  text: string;
  image: string | null;
};

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

const Drawer = createDrawerNavigator<RootStackParamList>();

// Profile Screen
function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput placeholder="Name" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} />
      <Button title="Save Changes" onPress={() => alert("Profile updated!")} />
    </View>
  );
}

// Home Screen
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

  const addPost = () => {
    if (text || image) {
      setPosts((prevPosts) => [
        { id: Date.now().toString(), text, image },
        ...prevPosts,
      ]);
      setText("");
      setImage(null);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
      <Text>{item.text}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => alert("Liked!")}>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Shared!")}>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Added to group!")}>
          <Text style={styles.actionText}>Add to Group</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.postInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
        />
        <Button title="Pick Image" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        <Button title="Post" onPress={addPost} />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
      />
    </View>
  );
}

// Main Navigation
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
    padding: 20,
    backgroundColor: "#fff",
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
  postInputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  post: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionText: {
    color: "blue",
  },
});
