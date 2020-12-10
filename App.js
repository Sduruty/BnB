import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Containers
import AroundMeScreen from "./containers/AroundMeScreen";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import RoomScreen from "./containers/RoomScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";

// Components
import ReturnButton from "./components/ReturnButton";
import Logo from "./components/Logo";

// Icons & colors
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import colors from "./assets/colors";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // save or remove token in AsyncStorage & state
  const setToken = async (token) => {
    if (token) {
      AsyncStorage.setItem("userToken", token);
      setUserToken(token);
    } else {
      AsyncStorage.removeItem("userToken");
      setUserToken(null);
    }
  };

  // save or remove id in AsyncStorage & state
  const setId = async (id) => {
    if (id) {
      AsyncStorage.setItem("userId", id);
      setUserId(id);
    } else {
      AsyncStorage.removeItem("userId");
      setUserId(null);
    }
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      setUserToken(userToken);
      setUserId(userId);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? null : userToken === null ? (
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" options={{ header: () => null }}>
            {() => <SignInScreen setToken={setToken} setId={setId} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" options={{ header: () => null }}>
            {() => <SignUpScreen setToken={setToken} setId={setId} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Tab"
            options={{
              header: () => null,
              animationEnabled: false,
            }}
          >
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: colors.pink,
                  inactiveTintColor: colors.grey,
                }}
              >
                {/*HOME TAB */}
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: true,
                      }}
                    >
                      {/*HOME SCREEN */}
                      <Stack.Screen
                        name="Home"
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                        }}
                      >
                        {(props) => <HomeScreen {...props} />}
                      </Stack.Screen>


                      
                      {/*ROOM SCREEN */}
                      <Stack.Screen
                        name="Room1"
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                          headerLeft: () => <ReturnButton />,
                        }}
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                {/*AROUND ME TAB */}
                
                <Tab.Screen
                  name="AroundMe"
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator screenOptions={{ headerShown: true }}>
                      {/*AROUND ME SCREEN */}
                      <Stack.Screen
                        name="AroundMe"
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                        }}
                      >
                        {(props) => <AroundMeScreen {...props} />}
                      </Stack.Screen>
                      {/*ROOM AROUND ME SCREEN */}
                      <Stack.Screen
                        name="Room2"
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                          headerLeft: () => <ReturnButton />,
                        }}
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                {/*PROFILE TAB */}
                <Tab.Screen
                  name="Profile"
                  options={{
                    tabBarLabel: "My profile",
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name="user" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator screenOptions={{ headerShown: true }}>
                      {/*PROFILE SCREEN */}
                      <Stack.Screen
                        name="Profile"
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                        }}
                      >
                        {(props) => (
                          <ProfileScreen
                            {...props}
                            userToken={userToken}
                            userId={userId}
                            setToken={setToken}
                            setId={setId}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
