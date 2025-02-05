import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { learningService } from "../services/learningService";
import { auth } from "@/firebase/config";
import { ModuleProgress } from "../types/learningTypes";

// Define content interface
interface ModuleSection {
  title: string;
  content: string;
  examples?: string[];
}

interface ModuleContent {
  title: string;
  description: string;
  sections: ModuleSection[];
  exercises?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

const moduleContents: { [key: string]: ModuleContent } = {
  "Interest Rates": {
    title: "Understanding Interest Rates",
    description:
      "Learn about how interest rates work and their impact on your finances.",
    sections: [
      {
        title: "What is Interest?",
        content:
          "Interest is the cost of borrowing money or the reward for lending it. It is usually expressed as a percentage of the borrowed or invested amount.",
        examples: ["Savings Account: 2% APY", "Credit Card: 18% APR"],
      },
      {
        title: "Simple vs Compound Interest",
        content:
          "Simple interest is calculated only on the principal amount. Compound interest is calculated on both the principal and accumulated interest, leading to exponential growth over time.",
        examples: [
          "Simple Interest: £1000 at 5% for 1 year = £50 interest",
          "Compound Interest: £1000 at 5% compounded annually for 2 years = £102.50 interest",
        ],
      },
      {
        title: "Types of Interest Rates",
        content:
          "Different financial products have different types of interest rates. Understanding these helps make informed financial decisions.",
        examples: [
          "Fixed Rate: Rate stays constant",
          "Variable Rate: Rate can change",
          "APR: Annual Percentage Rate includes fees",
        ],
      },
    ],
  },

  "Investment Basics": {
    title: "Introduction to Investing",
    description:
      "Learn the fundamentals of investing and different investment vehicles.",
    sections: [
      {
        title: "Why Invest?",
        content:
          "Investing helps grow wealth over time and beat inflation. It's about making your money work for you through various investment vehicles.",
        examples: [
          "Inflation Protection",
          "Wealth Building",
          "Passive Income Generation",
        ],
      },
      {
        title: "Types of Investments",
        content:
          "There are various investment options available, each with different risk levels and potential returns.",
        examples: [
          "Stocks: Company ownership shares",
          "Bonds: Government/Corporate debt",
          "Mutual Funds: Professionally managed investment pools",
          "ETFs: Exchange-Traded Funds",
          "Real Estate: Property investments",
        ],
      },
      {
        title: "Risk and Return",
        content:
          "Understanding the relationship between risk and return is crucial. Generally, higher potential returns come with higher risks.",
        examples: [
          "Low Risk: Savings accounts, government bonds",
          "Medium Risk: Corporate bonds, balanced funds",
          "High Risk: Individual stocks, cryptocurrencies",
        ],
      },
    ],
  },

  "Budgeting Fundamentals": {
    title: "Mastering Budget Basics",
    description:
      "Learn how to create and maintain a successful budget to achieve your financial goals.",
    sections: [
      {
        title: "Creating a Budget",
        content:
          "A budget is a financial plan that helps you track income and expenses. It's the foundation of financial health.",
        examples: [
          "50/30/20 Rule: 50% needs, 30% wants, 20% savings",
          "Zero-based budgeting",
          "Envelope system",
        ],
      },
      {
        title: "Income and Expenses",
        content:
          "Track all sources of income and categorize expenses to understand your spending patterns.",
        examples: [
          "Fixed Expenses: Rent, utilities, loan payments",
          "Variable Expenses: Food, entertainment, shopping",
          "Irregular Expenses: Car maintenance, gifts",
        ],
      },
      {
        title: "Setting Financial Goals",
        content:
          "Define clear, achievable financial goals and adjust your budget to meet them.",
        examples: [
          "Short-term: Emergency fund",
          "Medium-term: Car purchase",
          "Long-term: Retirement savings",
        ],
      },
    ],
  },

  "Credit & Debt Management": {
    title: "Managing Credit and Debt",
    description:
      "Learn how to use credit responsibly and manage debt effectively.",
    sections: [
      {
        title: "Understanding Credit",
        content:
          "Credit is borrowed money that must be repaid with interest. Your credit score affects your borrowing ability.",
        examples: [
          "Credit Score Components",
          "Credit Report Elements",
          "Types of Credit Accounts",
        ],
      },
      {
        title: "Debt Management Strategies",
        content:
          "Different approaches to managing and reducing debt effectively.",
        examples: [
          "Avalanche Method: Highest interest first",
          "Snowball Method: Smallest balance first",
          "Debt Consolidation",
        ],
      },
      {
        title: "Building Good Credit",
        content: "Steps to build and maintain a good credit score.",
        examples: [
          "Pay bills on time",
          "Keep credit utilization low",
          "Monitor credit report regularly",
        ],
      },
    ],
  },

  "Mortgage Essentials": {
    title: "Understanding Mortgages",
    description: "Essential knowledge about home loans and mortgage options.",
    sections: [
      {
        title: "Types of Mortgages",
        content:
          "Different mortgage types suit different financial situations.",
        examples: [
          "Fixed-rate mortgages",
          "Variable-rate mortgages",
          "Interest-only mortgages",
        ],
      },
      {
        title: "Mortgage Costs",
        content:
          "Understanding all costs associated with getting and maintaining a mortgage.",
        examples: [
          "Down payment requirements",
          "Closing costs",
          "Monthly payments breakdown",
        ],
      },
      {
        title: "Application Process",
        content: "Steps involved in applying for and securing a mortgage.",
        examples: [
          "Credit check requirements",
          "Income verification",
          "Property valuation",
        ],
      },
    ],
  },

  "Insurance Basics": {
    title: "Insurance Fundamentals",
    description:
      "Learn about different types of insurance and how to protect yourself and your assets.",
    sections: [
      {
        title: "Types of Insurance",
        content:
          "Different insurance types provide protection against various risks.",
        examples: [
          "Life Insurance",
          "Health Insurance",
          "Property Insurance",
          "Car Insurance",
        ],
      },
      {
        title: "Insurance Terms",
        content: "Key terms and concepts in insurance.",
        examples: [
          "Premium: Regular payment amount",
          "Deductible: Amount you pay before coverage",
          "Coverage Limit: Maximum payout",
        ],
      },
      {
        title: "Choosing Coverage",
        content: "How to select appropriate insurance coverage for your needs.",
        examples: [
          "Risk assessment",
          "Cost-benefit analysis",
          "Policy comparison",
        ],
      },
    ],
  },

  "Saving Strategies": {
    title: "Smart Saving Strategies",
    description:
      "Effective methods to save money and build financial security.",
    sections: [
      {
        title: "Emergency Fund",
        content:
          "Building and maintaining an emergency fund for unexpected expenses.",
        examples: [
          "3-6 months of expenses",
          "Accessible savings account",
          "Regular contributions",
        ],
      },
      {
        title: "Saving Methods",
        content: "Different approaches to saving money effectively.",
        examples: [
          "Automatic transfers",
          "Round-up savings",
          "Challenge-based saving",
        ],
      },
      {
        title: "Smart Shopping",
        content: "Strategies to save money on purchases.",
        examples: [
          "Compare prices",
          "Use cashback/rewards",
          "Seasonal shopping",
        ],
      },
    ],
  },

  "Tax Planning": {
    title: "Tax Planning Basics",
    description:
      "Understanding taxes and strategies to manage tax obligations.",
    sections: [
      {
        title: "Tax Basics",
        content:
          "Understanding different types of taxes and how they affect you.",
        examples: ["Income Tax", "National Insurance", "Capital Gains Tax"],
      },
      {
        title: "Tax-Efficient Savings",
        content: "Ways to save and invest while minimizing tax burden.",
        examples: ["ISAs", "Pension contributions", "Tax-free allowances"],
      },
      {
        title: "Tax Returns",
        content: "Guide to completing and filing tax returns accurately.",
        examples: [
          "Required documentation",
          "Important deadlines",
          "Common deductions",
        ],
      },
    ],
  },

  "Retirement Planning": {
    title: "Planning for Retirement",
    description:
      "Essential knowledge about retirement planning and pension options.",
    sections: [
      {
        title: "Retirement Basics",
        content:
          "Understanding the fundamentals of retirement planning and why starting early matters.",
        examples: [
          "Power of compound interest",
          "State Pension eligibility",
          "Retirement age considerations",
        ],
      },
      {
        title: "Pension Types",
        content: "Different pension schemes and how they work.",
        examples: [
          "State Pension",
          "Workplace pensions",
          "Personal pensions",
          "SIPP (Self-Invested Personal Pension)",
        ],
      },
      {
        title: "Retirement Income",
        content:
          "Understanding different sources of retirement income and how to plan for them.",
        examples: [
          "Pension income",
          "Investment income",
          "Property income",
          "Part-time work in retirement",
        ],
      },
      {
        title: "Investment Strategies",
        content: "How to invest for retirement at different life stages.",
        examples: [
          "Early career: Higher risk, growth-focused",
          "Mid-career: Balanced approach",
          "Near retirement: Conservative, preservation-focused",
        ],
      },
      {
        title: "Retirement Planning Tools",
        content: "Tools and calculations to help plan for retirement.",
        examples: [
          "Pension calculators",
          "Retirement age calculator",
          "Income needs assessment",
        ],
      },
    ],
  },

  "Stock Market Basics": {
    title: "Understanding the Stock Market",
    description:
      "Learn how the stock market works and basic investment strategies.",
    sections: [
      {
        title: "Stock Market Fundamentals",
        content: "Basic concepts of how the stock market operates.",
        examples: [
          "What is a stock exchange",
          "How stocks are traded",
          "Market indices",
        ],
      },
      {
        title: "Investment Analysis",
        content: "Methods to analyze and select stocks.",
        examples: [
          "Fundamental Analysis",
          "Technical Analysis",
          "Market Research",
        ],
      },
      {
        title: "Trading Basics",
        content: "Understanding how to buy and sell stocks.",
        examples: ["Types of orders", "Trading platforms", "Trading costs"],
      },
    ],
  },

  "Student Finance": {
    title: "Managing Student Finances",
    description:
      "Guide to managing money and understanding student financial options.",
    sections: [
      {
        title: "Student Loans",
        content:
          "Understanding different types of student loans and repayment options.",
        examples: [
          "Tuition fee loans",
          "Maintenance loans",
          "Repayment thresholds",
        ],
      },
      {
        title: "Budgeting for Students",
        content: "How to manage money effectively while studying.",
        examples: [
          "Term-time budgeting",
          "Part-time work",
          "Student discounts",
        ],
      },
      {
        title: "Financial Support",
        content: "Additional financial support options for students.",
        examples: ["Grants and bursaries", "Scholarships", "Hardship funds"],
      },
    ],
  },
};

export default function ModuleContent() {
  const route = useRoute<RouteProp<any>>();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const moduleTitle = route.params?.title;
  const content = moduleContents[moduleTitle];
  const [progress, setProgress] = useState<ModuleProgress | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      const userProgress = await learningService.getUserProgress();
      if (userProgress?.progress[moduleTitle]) {
        setProgress(userProgress.progress[moduleTitle]);
      }
    };
    loadProgress();
  }, [moduleTitle]);

  const handleCompleteSection = async (sectionTitle: string) => {
    if (!auth.currentUser) return;

    const newProgress = {
      moduleId: moduleTitle,
      completed: false,
      lastAccessed: new Date().toISOString(),
      sectionsCompleted: [...(progress?.sectionsCompleted || []), sectionTitle],
    };

    // Update UI immediately
    setProgress(newProgress);

    // Save to Firebase
    await learningService.updateModuleProgress(moduleTitle, newProgress);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      paddingTop: 40,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginLeft: 20,
    },
    content: {
      padding: 20,
    },
    description: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 10,
    },
    sectionContent: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 24,
    },
    example: {
      fontSize: 14,
      color: theme.secondaryText,
      marginTop: 10,
      fontStyle: "italic",
    },
  });

  if (!content) {
    return (
      <View style={styles.container}>
        <Text>Module content not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{content.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>{content.description}</Text>

        {content.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
            {section.examples?.map((example, i) => (
              <Text key={i} style={styles.example}>
                • {example}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
