import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "./Landing";
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Learning from "./Learning";
import FinancialTermGlossary from "./FinancialTermGlossary";

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Learning" component={Learning} />
      <Stack.Screen name="FinancialTermGlossary" component={FinancialTermGlossary} />
    </Stack.Navigator>
  );
};

export default Navigator;