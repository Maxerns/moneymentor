# MoneyMentor

A mobile app that helps adults build financial literacy — a live markets dashboard, budgeting, a UK tax estimator, an interactive glossary, and guided learning modules.

**Engineering deep-dive → [ARCHITECTURE.md](ARCHITECTURE.md)** — the Cloudflare edge API proxy, caching, live-data sourcing, and testing behind the revived app.

---

## Overview

MoneyMentor helps adults improve their financial literacy and money-management skills. It tackles poor financial knowledge with practical tools, educational resources, and interactive features that encourage better budgeting, saving, and decision-making.

**What it brings together**

- **Financial education** — complex terms and concepts simplified into accessible content.
- **Budgeting tools** — track spending, set goals, and manage budgets.
- **Interactive learning** — quizzes, calculators, and charts that make money engaging.
- **Personal guidance** — reminders, tips, and progress tracking.
- **User-centric design** — simple and engaging across all levels of financial knowledge.

## Aim

To improve individuals' ability to manage personal expenditure and increase financial literacy among adults — helping them make informed decisions, build healthier money habits, and reduce financial stress.

## Objectives

- Identify knowledge gaps in financial literacy through questionnaires and research.
- Design a mobile app with accessible, engaging financial-learning tools.
- Incorporate interactive features — goal tracking, calculators, quizzes, and progress visualisations.
- Promote positive financial behaviours with budgeting templates, reminders, and tips.
- Test usability and effectiveness with real users.
- Encourage long-term engagement through appealing, adaptable design.

## Screens

_Captured on iOS (iPhone 16 Pro), with live data served through the edge proxy._

**Auth**

<img src="docs/screenshots/10-landing.png" width="230" alt="Landing" />
<img src="docs/screenshots/08-login.png" width="230" alt="Login" />
<img src="docs/screenshots/09-signup.png" width="230" alt="Sign up" />

**Dashboard, tools & settings**

<img src="docs/screenshots/03-home.png" width="230" alt="Home dashboard" />
<img src="docs/screenshots/04-tools.png" width="230" alt="Tools" />
<img src="docs/screenshots/07-settings.png" width="230" alt="Settings" />

**Markets, tax & budgeting**

<img src="docs/screenshots/01-dashboard.png" width="230" alt="Markets dashboard with live data" />
<img src="docs/screenshots/02-tax-estimator.png" width="230" alt="Tax Estimator" />
<img src="docs/screenshots/11-budget.png" width="230" alt="Budget Manager" />

**Learning & glossary**

<img src="docs/screenshots/06-learning.png" width="230" alt="Learning modules" />
<img src="docs/screenshots/05-glossary.png" width="230" alt="Financial Term Glossary" />

## Design & research

<details>
<summary><b>UML, personas, user journeys & prototypes</b> — click to expand</summary>

### Use case diagram

<img width="900" alt="Use case diagram" src="https://github.com/user-attachments/assets/ba347278-47e1-4a0e-82b3-927a9ad7e494" />

### User personas

<img width="700" alt="User persona 1" src="https://github.com/user-attachments/assets/e8f06832-6b0d-4ae3-bba7-b14eb41408d3" />
<img width="700" alt="User persona 2" src="https://github.com/user-attachments/assets/9fbad36b-58b4-483c-8ffd-303d9b33f8ae" />

### User journeys

<img width="900" alt="User journey 1" src="https://github.com/user-attachments/assets/311afb06-cf2c-44aa-b568-65ea2427a5cf" />
<img width="900" alt="User journey 2" src="https://github.com/user-attachments/assets/da2bc4c9-c33c-45f1-8fac-81e5ef7228b2" />

### Activity diagrams

<img width="640" alt="Activity diagram 1" src="https://github.com/user-attachments/assets/8b28b216-12b9-4943-b07a-92b08cabcdaa" />
<img width="640" alt="Activity diagram 2" src="https://github.com/user-attachments/assets/15e92a78-a70a-453b-a938-847bf18b2f0f" />

### Low-fidelity prototypes

<img width="900" alt="Glossary wireflow" src="https://github.com/user-attachments/assets/d9ca0016-9845-4e75-b9c2-3318ebbb8557" />
<img width="900" alt="Tax estimator wireflow" src="https://github.com/user-attachments/assets/f917b596-40fe-4407-96fa-438e3576639a" />

### High-fidelity prototypes

<img width="900" alt="Glossary workflow" src="https://github.com/user-attachments/assets/04ff635e-1338-4cb0-81a0-265f8534e327" />
<img width="900" alt="Tax estimator workflow" src="https://github.com/user-attachments/assets/03cabf8c-b533-4422-9cb0-5f5910a7ad98" />
<img width="900" alt="Figma prototype overview" src="https://github.com/user-attachments/assets/ac8b26d3-6eb2-4aa5-8bcf-370359635909" />

</details>

## Tech

React Native (Expo SDK 52) · TypeScript · Firebase Auth + Firestore · Cloudflare Workers + KV.

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for the full engineering write-up and how to run it locally.
