import React, { useState, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

// Colors & Icons
import colors from "../assets/colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

// Components
import Button from "../components/Button";
import Input from "../components/Input";
import BigInput from "../components/BigInput";
import Message from "../components/Message";
import Lottie from "../components/Lottie";

function ProfileScreen({ userToken, userId, setToken, setId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayMessage, setDisplayMessage] = useState(null);
  // data from api
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  // new data
  const [newEmail, setNewEmail] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newPicture, setNewPicture] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/user/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      setUserName(response.data.username);
      setEmail(response.data.email);
      setDescription(response.data.description);
      setNewUserName(response.data.username);
      setNewEmail(response.data.email);
      setNewDescription(response.data.description);
      if (response.data.photo) {
        setPicture(response.data.photo[0].url);
        setNewPicture(response.data.photo[0].url);
      }
      setIsLoading(false);
    } catch (error) {
      setDisplayMessage({
        message: "An error occurred...Shit happens...",
        color: "error",
      });
    }
  };

  // update Infos
  const editInfos = async () => {
    setIsLoading(true);

    if (
      newEmail !== email ||
      newUserName !== userName ||
      newDescription !== description ||
      newPicture !== picture
    ) {
      try {
        // update picture
        if (newPicture !== picture) {
          const uri = newPicture;
          const uriParts = uri.split(".");
          const fileType = uriParts[1];

          const formData = new FormData();
          formData.append("photo", {
            uri,
            name: `userPicture`,
            type: `image/${fileType}`,
          });

          const response = await axios.put(
            `https://express-airbnb-api.herokuapp.com/user/upload_picture`,

            formData,
            {
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }
          );

          if (response.data) {
            setPicture(response.data.photo[0].url);
            setIsLoading(false);
          }
        }

        // update email / username / description
        if (
          newEmail !== email ||
          newUserName !== userName ||
          newDescription !== description
        ) {
          const obj = {};
          if (newEmail !== email) {
            obj.email = newEmail;
          }
          if (newUserName !== userName) {
            obj.username = newUserName;
          }
          if (newDescription !== description) {
            obj.description = newDescription;
          }

          const response = await axios.put(
            `https://express-airbnb-api.herokuapp.com/user/update`,

            obj,
            {
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }
          );

          if (response.data) {
            setUserName(response.data.username);
            setEmail(response.data.email);
            setDescription(response.data.description);
          } else {
            setDisplayMessage({
              message: "An error occurred...Shit happens...",
              color: "error",
            });
          }
        }

        setDisplayMessage({
          message: "Your profile has successfully been updated",
          color: "success",
        });
        setIsLoading(false);
      } catch (error) {
        setDisplayMessage({
          message: error.response.data.error,
          color: "error",
        });
        setIsLoading(false);
        fetchData();
      }
    } else {
      setDisplayMessage({
        message: "No information changed",
        color: "error",
      });
      setIsLoading(false);
    }
  };

  // get picture from image library
  const uploadPicture = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        setNewPicture(result.uri);
      }
    }
    setDisplayMessage(false);
  };

  // get picture from camera
  const takePicture = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.cancelled) {
        setNewPicture(result.uri);
      }
    }
    setDisplayMessage(false);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle="dark-content" />

      {isLoading ? (
        <Lottie />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.topView}>
            <TouchableOpacity style={styles.pictureView}>
              {newPicture ? (
                <Image
                  source={{ uri: newPicture }}
                  style={styles.picture}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome5
                  name="user-alt"
                  size={100}
                  color={colors.lightGrey}
                />
              )}
            </TouchableOpacity>
            <View style={styles.icons}>
              <TouchableOpacity
                onPress={() => {
                  uploadPicture();
                }}
              >
                <MaterialIcons
                  name="photo-library"
                  size={30}
                  color={colors.grey}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  takePicture();
                }}
              >
                <FontAwesome5 name="camera" size={30} color={colors.grey} />
              </TouchableOpacity>
            </View>
          </View>

          <Input
            value={newEmail}
            setFunction={setNewEmail}
            setDisplayMessage={setDisplayMessage}
          />
          <Input
            value={newUserName}
            setFunction={setNewUserName}
            setDisplayMessage={setDisplayMessage}
          />
          <BigInput
            setFunction={setNewDescription}
            value={newDescription}
            setDisplayMessage={setDisplayMessage}
          />

          <View style={styles.view}>
            {displayMessage && (
              <Message
                message={displayMessage.message}
                color={displayMessage.color}
              />
            )}
          </View>

          <Button text="Update" setFunction={editInfos} />
          <Button
            text="Log out"
            setFunction={() => {
              setToken();
              setId();
            }}
            backgroundColor={true}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  scrollView: {
    alignItems: "center",
    backgroundColor: colors.backgroundColor,
  },
  picture: {
    height: 150,
    width: 150,
    borderRadius: 150,
  },
  pictureView: {
    marginVertical: 20,
    width: 170,
    height: 170,
    borderRadius: 170,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.lightPink,
    borderWidth: 2,
  },
  topView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  icons: {
    marginLeft: 20,
  },
  iconButton: {
    marginTop: 40,
  },
  view: {
    height: 30,
  },
});
