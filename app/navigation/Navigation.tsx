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
import BudgetManagementTool from "../screens/BudgetManagementTool";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import { useTheme } from "../context/ThemeContext";
import ModuleContent from "../screens/ModuleContent";
import LearningPath from "../screens/LearningPath";
import Tools from "../screens/Tools";
import Analytics from "../screens/Analytics";


const Stack = createStackNavigator<RootStackParamList>();

const Navigator = () => {
  const { theme, isDark } = useTheme();
  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.border,
          notification: theme.primary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: 'normal',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: 'normal',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: 'bold',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: 'bold',
          },
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="screens/Landing"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="screens/Landing" component={Landing} />
        <Stack.Screen name="auth/SignUp" component={SignUp} />
        <Stack.Screen name="auth/Login" component={Login} />
        <Stack.Screen name="screens/Dashboard" component={Dashboard} />
        <Stack.Screen name="screens/Learning" component={Learning} />
        <Stack.Screen
          name="screens/FinancialTermGlossary"
          component={FinancialTermGlossary}
        />
        <Stack.Screen
          name="screens/TaxEstimatorTool"
          component={TaxEstimatorTool}
        />
        <Stack.Screen name="screens/BudgetManagementTool" component={BudgetManagementTool} />
        <Stack.Screen name="screens/Profile" component={Profile} />
        <Stack.Screen name="screens/Settings" component={Settings} />
        <Stack.Screen name="screens/ModuleContent" component={ModuleContent} />
        <Stack.Screen name="screens/LearningPath" component={LearningPath} />
        <Stack.Screen name="screens/Tools" component={Tools} />
        <Stack.Screen name="screens/Analytics" component={Analytics} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
