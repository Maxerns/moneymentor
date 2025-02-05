import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import {
  ModuleProgress,
  UserLearningProgress,
  LearningPathType,
} from "../types/learningTypes";

export const learningPaths: LearningPathType[] = [
  {
    id: "beginner",
    name: "Financial Basics",
    description: "Start your financial journey with the basics",
    modules: [
      "Budgeting Fundamentals",
      "Saving Strategies",
      "Credit & Debt Management",
    ],
    difficulty: "beginner",
    order: ["module1", "module2", "module3"],
  },
  {
    id: "intermediate",
    name: "Investment Focus",
    description: "Learn how to grow your wealth",
    modules: ["Investment Basics", "Interest Rates", "Stock Market"],
    difficulty: "intermediate",
    order: ["module4", "module5", "module6"],
  },
  {
    id: "advanced",
    name: "Wealth Building",
    description: "Advanced strategies for financial growth",
    modules: ["Tax Planning", "Retirement", "Estate Planning"],
    difficulty: "advanced",
    order: ["module7", "module8", "module9"],
  },
];

export const learningService = {
  async getUserProgress(): Promise<UserLearningProgress | null> {
    if (!auth.currentUser) return null;

    try {
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "learning",
        "progress"
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserLearningProgress;
      }

      // Initialize default progress with required currentModule
      const defaultProgress: UserLearningProgress = {
        selectedPath: "",
        currentModule: "",
        progress: {},
        recommendations: [],
        lastUpdated: new Date().toISOString(),
      };
      await setDoc(docRef, defaultProgress);
      return defaultProgress;
    } catch (error) {
      console.error("Error in getUserProgress:", error);
      throw error;
    }
  },

  async updateModuleProgress(
    moduleId: string,
    progress: ModuleProgress
  ): Promise<void> {
    if (!auth.currentUser) throw new Error("User not authenticated");

    try {
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "learning",
        "progress"
      );
      await updateDoc(docRef, {
        [`progress.${moduleId}`]: progress,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  },

  async setLearningPath(pathId: string): Promise<void> {
    if (!auth.currentUser) throw new Error("User not authenticated");

    try {
      const path = learningPaths.find((p) => p.id === pathId);
      if (!path) throw new Error("Invalid path ID");

      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "learning",
        "progress"
      );
      await setDoc(
        docRef,
        {
          selectedPath: pathId,
          currentModule: path.order[0],
          progress: {},
          lastUpdated: new Date().toISOString(),
          recommendations: path.modules,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error setting learning path:", error);
      throw error;
    }
  },

  async getCurrentModule(): Promise<string | null> {
    if (!auth.currentUser) return null;

    const docRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "learning",
      "progress"
    );
    const docSnap = await getDoc(docRef);
    return docSnap.data()?.currentModule || null;
  },
};
