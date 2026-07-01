// The navigation stack's routes and their params. This previously lived in the
// gitignored `.expo/types/` directory, so the project failed to typecheck from a
// clean checkout (and in CI). Committed here as real source.
export type RootStackParamList = {
  "screens/Landing": undefined;
  "auth/SignUp": undefined;
  "auth/Login": undefined;
  "screens/Dashboard": undefined;
  "screens/Learning": undefined;
  "screens/FinancialTermGlossary": undefined;
  "screens/TaxEstimatorTool": undefined;
  "screens/BudgetManagementTool": undefined;
  "screens/Profile": undefined;
  "screens/Settings": undefined;
  "screens/ModuleContent": { title?: string; moduleName?: string } | undefined;
  "screens/LearningPath": undefined;
  "screens/Tools": undefined;
  "screens/Analytics": undefined;
};
