import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import Landing from "../screens/Landing";
import SignUp from "../auth/SignUp";
import Login from "../auth/Login";
import Dashboard from "../screens/Dashboard";
import Learning from "../screens/Learning";
import FinancialTermGlossary from "../screens/FinancialTermGlossary";
import TaxEstimatorTool from "../screens/TaxEstimatorTool";

const Stack = createStackNavigator<RootStackParamList>();

const Navigator = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="screens/Landing">
      <Stack.Screen name="screens/Landing" component={Landing} />
      <Stack.Screen name="auth/SignUp" component={SignUp} />
      <Stack.Screen name="auth/Login" component={Login} />
      <Stack.Screen name="screens/Dashboard" component={Dashboard} />
      <Stack.Screen name="screens/Learning" component={Learning} />
      <Stack.Screen
        name="screens/FinancialTermGlossary"
        component={FinancialTermGlossary}
      />
      <Stack.Screen name="screens/TaxEstimatorTool" component={TaxEstimatorTool} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default Navigator;
