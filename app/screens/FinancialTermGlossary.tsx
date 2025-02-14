import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";

export default function FinancialTermGlossary() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 40,
      marginBottom: 20,
    },
    logo: {
      width: 75,
      height: 75,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 20,
      textAlign: "center",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 20,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
    },
    letterSection: {
      marginBottom: 20,
    },
    letter: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },
    termCard: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    termText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 5,
    },
    definition: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 10,
    },
    learnMoreButton: {
      backgroundColor: theme.primary,
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      alignSelf: "flex-start",
    },
    learnMoreText: {
      fontSize: 14,
      color: theme.surface,
    },
    scrollViewContent: {
      paddingBottom: 100,
    },
    navBar: {
      bottom: 0,
      width: "115%",
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.surface,
      paddingVertical: 10,
      paddingHorizontal: 40,
    },
    navBarIcon: {
      fontSize: 30,
      color: theme.text,
    },
    navText: {
      fontSize: 12,
      fontWeight: "500",
      color: theme.text,
      marginTop: 5,
    },
  });

  const handleLetterPress = (letter: string) => {
    setSelectedLetter(letter === selectedLetter ? null : letter);
  };

  const handleTermPress = (term: string) => {
    alert(`Learn more about: ${term}`);
  };

  const terms: { [key: string]: { term: string; definition: string }[] } = {
    A: [
      {
        term: "Absolute Advantage",
        definition:
          "Absolute advantage is when a person, company, or country can produce more of a good or service with the same amount of resources (or produce the same amount using fewer resources) compared to others.",
      },
      {
        term: "Accounting Equation",
        definition:
          "The Accounting Equation is the foundation of double-entry bookkeeping and represents the relationship between a company's assets, liabilities, and equity.",
      },
      {
        term: "Acquisition",
        definition:
          "An acquisition is when one company purchases most or all of another company's shares or assets to take control of that company.",
      },
      {
        term: "Accounting Rate of Return (ARR)",
        definition:
          "The Accounting Rate of Return (ARR) is a financial metric used to evaluate the profitability of an investment. It measures the expected annual return as a percentage of the initial investment cost or average investment.",
      },
    ],
    B: [
      {
        term: "Balanced Scorecard",
        definition:
          "A balanced scorecard (BSC) is defined as a management system that provides feedback on both internal business processes and external outcomes to continuously improve strategic performance and results",
      },
      {
        term: "Bond",
        definition:
          "Bonds are issued by governments and corporations when they want to raise money. By buying a bond, you're giving the issuer a loan, and they agree to pay you back the face value of the loan on a specific date, and to pay you periodic interest payments along the way, usually twice a year.",
      },
      {
        term: "Budget",
        definition:
          "A budget is a monthly or annual plan that documents your income, tracks your expenses and leaves room for financial goals.",
      },
      {
        term: "Bull Market",
        definition:
          "A bull market is a financial market in which prices are rising or are expected to rise.",
      },
    ],

    C: [
      {
        term: "Capital Gain",
        definition:
          "A capital gain is the profit earned from the sale of an asset, such as stocks, real estate, or a business, when the selling price exceeds the purchase price.",
      },
      {
        term: "Cash Flow",
        definition:
          "Cash flow is the total amount of money being transferred into and out of a business, especially as affecting liquidity.",
      },
      {
        term: "Credit Score",
        definition:
          "A credit score is a numerical expression based on a level analysis of a person's credit files, representing the creditworthiness of an individual.",
      },
    ],
    D: [
      {
        term: "Depreciation",
        definition:
          "Depreciation refers to the gradual decrease in the value of an asset over time due to wear and tear or obsolescence.",
      },
      {
        term: "Dividend",
        definition:
          "A dividend is a payment made by a corporation to its shareholders, usually as a distribution of profits.",
      },
      {
        term: "Debt-to-Income Ratio",
        definition:
          "The debt-to-income ratio is a personal finance measure that compares the amount of debt you have to your overall income.",
      },
    ],
    E: [
      {
        term: "Equity",
        definition:
          "Equity represents the value of ownership in a company or property after deducting liabilities.",
      },
      {
        term: "Exchange Rate",
        definition:
          "An exchange rate is the value of one currency for the purpose of conversion to another.",
      },
      {
        term: "Economies of Scale",
        definition:
          "Economies of scale refer to the cost advantage that arises with increased output of a product.",
      },
    ],
    F: [
      {
        term: "Fixed Cost",
        definition:
          "Fixed costs are business expenses that remain constant regardless of the level of goods or services produced.",
      },
      {
        term: "FICO Score",
        definition:
          "A FICO score is a type of credit score that lenders use to assess an individual's credit risk.",
      },
      {
        term: "Fiduciary Duty",
        definition:
          "Fiduciary duty is the legal obligation of one party to act in the best interest of another.",
      },
    ],
    G: [
      {
        term: "Gross Income",
        definition:
          "Gross income is the total income earned by an individual or company before taxes and deductions.",
      },
      {
        term: "Goodwill",
        definition:
          "Goodwill is an intangible asset that represents the excess value paid during an acquisition for the reputation or brand of a business.",
      },
      {
        term: "Gearing Ratio",
        definition:
          "A gearing ratio measures the financial leverage of a company by comparing its debt to its equity.",
      },
    ],
    H: [
      {
        term: "Hedge",
        definition:
          "A hedge is an investment strategy used to offset potential losses in another investment.",
      },
      {
        term: "Human Capital",
        definition:
          "Human capital refers to the skills, knowledge, and experience possessed by an individual or population, viewed in terms of their value to an organization or country.",
      },
      {
        term: "Housing Market",
        definition:
          "The housing market refers to the supply and demand for residential properties in a specific area.",
      },
    ],
    I: [
      {
        term: "Inflation",
        definition:
          "Inflation is the rate at which the general level of prices for goods and services is rising, reducing purchasing power.",
      },
      {
        term: "Initial Public Offering (IPO)",
        definition:
          "An Initial Public Offering (IPO) is the process by which a private company offers its shares to the public for the first time.",
      },
      {
        term: "Interest Rate",
        definition:
          "An interest rate is the percentage charged on a loan or paid on savings over a specific period.",
      },
    ],
    J: [
      {
        term: "Joint Account",
        definition:
          "A joint account is a bank account shared by two or more individuals, typically family members or business partners.",
      },
      {
        term: "Junk Bond",
        definition:
          "A junk bond is a high-yield bond with a lower credit rating, typically offering higher returns but with higher risk.",
      },
      {
        term: "Job Costing",
        definition:
          "Job costing is a method of calculating the cost of a specific project or job in a business.",
      },
    ],
    K: [
      {
        term: "Key Performance Indicator (KPI)",
        definition:
          "A KPI is a measurable value that indicates how effectively an individual or organization is achieving a key objective.",
      },
      {
        term: "Knowledge Economy",
        definition:
          "The knowledge economy is an economic system based on intellectual capital and the production of knowledge.",
      },
      {
        term: "Kite Mark",
        definition:
          "A kite mark is a certification mark indicating conformity to a specific standard of quality and safety.",
      },
    ],
    L: [
      {
        term: "Liquidity",
        definition:
          "Liquidity refers to how easily an asset can be converted into cash without affecting its market price.",
      },
      {
        term: "Leverage",
        definition:
          "Leverage is the use of borrowed capital to increase the potential return of an investment.",
      },
      {
        term: "Loan-to-Value Ratio (LTV)",
        definition:
          "The Loan-to-Value Ratio is a financial term used by lenders to express the ratio of a loan to the value of the asset purchased.",
      },
    ],
    M: [
      {
        term: "Market Capitalization",
        definition:
          "Market capitalization is the total value of a company's shares of stock, calculated by multiplying the share price by the number of shares.",
      },
      {
        term: "Monetary Policy",
        definition:
          "Monetary policy refers to the actions taken by a central bank to regulate the money supply and interest rates in an economy.",
      },
      {
        term: "Mutual Fund",
        definition:
          "A mutual fund is an investment vehicle that pools money from multiple investors to invest in a diversified portfolio of assets.",
      },
    ],
    N: [
      {
        term: "Net Income",
        definition:
          "Net income is the total earnings of a business or individual after all expenses, taxes, and deductions are subtracted.",
      },
      {
        term: "Net Worth",
        definition:
          "Net worth is the value of all assets owned by a person or business minus any liabilities owed.",
      },
      {
        term: "Nominal Value",
        definition:
          "Nominal value refers to the face value or stated value of an asset, security, or financial instrument.",
      },
    ],
    O: [
      {
        term: "Opportunity Cost",
        definition:
          "Opportunity cost is the value of the next best alternative forgone when making a decision.",
      },
      {
        term: "Overdraft",
        definition:
          "An overdraft is a financial arrangement where you can withdraw more money from your bank account than you currently have, up to a limit.",
      },
      {
        term: "Operating Income",
        definition:
          "Operating income is a company's profit after deducting operating expenses such as wages, depreciation, and cost of goods sold.",
      },
    ],
    P: [
      {
        term: "Principal",
        definition:
          "The principal is the original sum of money borrowed in a loan or invested, excluding interest or earnings.",
      },
      {
        term: "Portfolio",
        definition:
          "A portfolio is a collection of financial investments like stocks, bonds, commodities, and real estate.",
      },
      {
        term: "Price-to-Earnings Ratio (P/E)",
        definition:
          "The P/E ratio is a valuation metric that measures a company's current share price relative to its per-share earnings.",
      },
    ],
    Q: [
      {
        term: "Quarterly Earnings",
        definition:
          "Quarterly earnings refer to the profits or losses that a company reports every three months.",
      },
      {
        term: "Quotas",
        definition:
          "Quotas are trade restrictions that limit the quantity or value of goods that can be imported or exported during a specific period.",
      },
      {
        term: "Qualitative Analysis",
        definition:
          "Qualitative analysis is a method of evaluating investments based on non-quantifiable factors like management quality and industry trends.",
      },
    ],
    R: [
      {
        term: "Return on Investment (ROI)",
        definition:
          "ROI is a financial metric used to measure the profitability of an investment relative to its cost.",
      },
      {
        term: "Revenue",
        definition:
          "Revenue is the total amount of money generated from the sale of goods or services before any expenses are deducted.",
      },
      {
        term: "Risk Tolerance",
        definition:
          "Risk tolerance refers to an investor's ability and willingness to endure potential losses in their investment portfolio.",
      },
    ],
    S: [
      {
        term: "Stock",
        definition:
          "Stock represents ownership in a corporation and a claim on part of the corporation's assets and earnings.",
      },
      {
        term: "Savings Account",
        definition:
          "A savings account is a bank account that earns interest and is used to hold money for future use.",
      },
      {
        term: "Shareholder Equity",
        definition:
          "Shareholder equity is the residual interest in the assets of a company after deducting its liabilities.",
      },
    ],
    T: [
      {
        term: "Taxable Income",
        definition:
          "Taxable income is the portion of your income that is subject to taxation after deductions and exemptions.",
      },
      {
        term: "Treasury Bond",
        definition:
          "A treasury bond is a government debt security that earns fixed interest over a period of time.",
      },
      {
        term: "Time Value of Money (TVM)",
        definition:
          "The time value of money is the concept that money available now is worth more than the same amount in the future due to its earning potential.",
      },
    ],
    U: [
      {
        term: "Unsecured Loan",
        definition:
          "An unsecured loan is a loan that does not require collateral and is issued based on creditworthiness.",
      },
      {
        term: "Underwriting",
        definition:
          "Underwriting is the process by which a financial institution evaluates the risk of insuring, lending, or issuing securities.",
      },
      {
        term: "Utility",
        definition:
          "Utility refers to the total satisfaction received from consuming a good or service.",
      },
    ],
    V: [
      {
        term: "Variable Cost",
        definition:
          "Variable costs are expenses that change in proportion to the production output of a business.",
      },
      {
        term: "Venture Capital",
        definition:
          "Venture capital is a form of private equity financing provided to startups and small businesses with high growth potential.",
      },
      {
        term: "Valuation",
        definition:
          "Valuation is the process of determining the present value of an asset or company.",
      },
    ],
    W: [
      {
        term: "Wealth Management",
        definition:
          "Wealth management is a financial service that combines investment advice, tax services, and planning to manage an individual’s wealth.",
      },
      {
        term: "Working Capital",
        definition:
          "Working capital is the difference between a company's current assets and current liabilities.",
      },
      {
        term: "Withholding Tax",
        definition:
          "Withholding tax is an amount that an employer withholds from an employee's paycheck and pays directly to the government as partial payment of income tax.",
      },
    ],
    X: [
      {
        term: "X-Efficiency",
        definition:
          "X-efficiency refers to the degree of efficiency maintained by firms under competitive conditions.",
      },
      {
        term: "Exchange-Traded Fund (ETF)",
        definition:
          "An ETF is a type of investment fund and exchange-traded product that holds assets such as stocks, bonds, or commodities and is traded on stock exchanges.",
      },
      {
        term: "XIRR",
        definition:
          "XIRR stands for Extended Internal Rate of Return, which calculates annualized returns for cash flows that are irregular or non-periodic.",
      },
    ],
    Y: [
      {
        term: "Yield",
        definition:
          "Yield is the income return on an investment, such as the interest or dividends received, expressed as a percentage of the investment’s cost or market value.",
      },
      {
        term: "Year-to-Date (YTD)",
        definition:
          "Year-to-Date (YTD) refers to the period beginning from the start of the current year to the present date.",
      },
      {
        term: "Yield Curve",
        definition:
          "A yield curve is a graphical representation of interest rates on bonds of different maturities.",
      },
    ],
    Z: [
      {
        term: "Zero-Based Budgeting (ZBB)",
        definition:
          "Zero-based budgeting is a budgeting method where all expenses must be justified for each new period, starting from a zero base.",
      },
      {
        term: "Zero Coupon Bond",
        definition:
          "A zero coupon bond is a bond that is issued at a discount and does not pay periodic interest, with the face value paid at maturity.",
      },
      {
        term: "Zoning",
        definition:
          "Zoning refers to the process of dividing land into zones where certain land uses are permitted or prohibited.",
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons
            name="person-circle-outline"
            size={36}
            color="#344950"
            onPress={() => navigation.navigate("screens/Profile")}
          />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/MoneyMentorLogoGradient.png")}
          style={styles.logo}
        />
        <TouchableOpacity>
          <Ionicons
            name="settings-outline"
            size={36}
            color="#344950"
            onPress={() => navigation.navigate("screens/Settings")}
          />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <Text style={styles.pageTitle}>Financial Term Glossary</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#B0BEC5"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Term search"
          placeholderTextColor="#B0BEC5"
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {Object.keys(terms).map((letter) => (
          <View key={letter} style={styles.letterSection}>
            <TouchableOpacity onPress={() => handleLetterPress(letter)}>
              <Text style={styles.letter}>{letter}</Text>
            </TouchableOpacity>
            {selectedLetter === letter &&
              terms[letter].map(({ term, definition }) => (
                <View key={term} style={styles.termCard}>
                  <Text style={styles.termText}>{term}</Text>
                  <Text style={styles.definition}>{definition}</Text>
                  <TouchableOpacity
                    style={styles.learnMoreButton}
                    onPress={() => handleTermPress(term)}
                  >
                    <Text style={styles.learnMoreText}>Learn More</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity>
          <Ionicons
            name="home-outline"
            style={styles.navBarIcon}
            onPress={() => navigation.navigate("screens/Dashboard")}
          />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="construct-outline"
            style={styles.navBarIcon}
            onPress={() => navigation.navigate("screens/Tools")}
          />
          <Text style={styles.navText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="analytics-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="school-outline"
            style={styles.navBarIcon}
            onPress={() => navigation.navigate("screens/Learning")}
          />
          <Text style={styles.navText}>Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
