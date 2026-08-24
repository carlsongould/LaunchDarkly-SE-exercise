
# LaunchDarkly SE Exercise

A small React + TypeScript application demonstrating how LaunchDarkly can separate **application deployment** from **feature release, targeting, and remediation**.

The application presents a customer dashboard with a gated **Customer Insights** feature. LaunchDarkly controls whether the feature is available, allowing the feature to be enabled or disabled without redeploying the application or refreshing the browser.

---

## Demo

The application demonstrates the following operational flow:

**Deploy → Release → Monitor → Remediate**

```mermaid
flowchart TD
    LD[LaunchDarkly] --> FF[Feature Flag]

    FF --> OFF[OFF]
    FF --> ON[ON]

    OFF --> UI[Existing UI]
    ON --> CI[Customer Insights]

    CI --> CHANGE[Flag Changed]
    CHANGE --> SDK[Browser SDK]
    SDK --> LISTENER[React Listener]
    LISTENER --> UPDATE[UI Updates]
```

The goal is to demonstrate the operational value of feature management rather than build a complex application.

---

## Technology Stack

* React
* TypeScript
* Vite
* LaunchDarkly JavaScript Client SDK
* Node.js
* npm
* Git/GitHub

No database or backend service is required for the basic demonstration.

---

## Environment Assumptions

This project was developed and tested on **macOS**.

### Prerequisites

* macOS
* Node.js 20+
* npm
* Git
* A modern browser such as Chrome, Safari, or Firefox
* A LaunchDarkly account
* A LaunchDarkly project/environment

Homebrew is recommended for installing Node.js and other development tools.

Verify the local environment:

```bash
brew --version
node --version
npm --version
git --version
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/launchdarkly-se-exercise.git
cd launchdarkly-se-exercise
```
* Move App.tsx launchdarkly.tsx and styles.css to the src folder. 
* Move ReleaseStatus.tsx CustomerDashboard.tsx CustomerInsights.tsx to the src/components folder. 

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure LaunchDarkly

Create a `.env` file in the project root:

```env
VITE_LD_CLIENT_ID=YOUR_LAUNCHDARKLY_CLIENT_SIDE_ID
```

The application requires the **LaunchDarkly Client-side ID** for the environment being used.

> **Important:** Do not use a LaunchDarkly server-side SDK key in this application.

Do not commit `.env` to GitHub.

A `.env.example` file can be used as a template:

```env
VITE_LD_CLIENT_ID=
```

### 4. Start the Application

```bash
npm run dev
```

Vite will provide a local URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# LaunchDarkly Configuration

## Feature Flag

Create a **Boolean feature flag** in LaunchDarkly with the following configuration:

| Setting       | Value                       |
| ------------- | --------------------------- |
| Name          | `Customer Insights`         |
| Key           | `customer-insights-enabled` |
| Initial state | `OFF`                       |

Make sure the flag is available to the **LaunchDarkly client-side SDK**.

---

## Customer Context

The application uses a customer context similar to:

| Attribute    | Value          |
| ------------ | -------------- |
| Customer     | Jane Smith     |
| Customer key | `Acme-Tools` |
| Plan         | `enterprise`   |

The `plan` attribute is used later for LaunchDarkly targeting.

---

# Part 1: Feature Flag Demonstration

Start the application:

```bash
npm run dev
```

With the flag set to **OFF**, the dashboard should display the normal customer dashboard without the Customer Insights feature.

In LaunchDarkly, change:

```text
customer-insights-enabled
OFF → ON
```

The browser should receive the change through the LaunchDarkly SDK.

The application should then display:

> ✨ Customer Insights

**No browser refresh should be required.**

Change the flag back:

```text
ON → OFF
```

The Customer Insights feature should disappear without refreshing the page.

### Expected Flow

```mermaid
flowchart TD
    LD[LaunchDarkly] -->|Streaming update| SDK[LaunchDarkly JavaScript SDK]
    SDK -->|Change event| STATE[React State]
    STATE --> DASH[Customer Dashboard]
```

This demonstrates that a feature can be **released or rolled back independently of an application deployment**.

---

# Part 2: Targeting

The application provides a customer context with:

```text
plan = enterprise
```

Configure the LaunchDarkly flag so that:

```text
plan == enterprise
        │
        ▼
       ON
```

Customers who do not meet the targeting rule should receive:

```text
plan != enterprise
        │
        ▼
       OFF
```

This demonstrates the distinction between **deployment and exposure**.

The application can be deployed once while LaunchDarkly determines which customer contexts receive the new capability.

---

# Part 3: Remediation Trigger

Create a LaunchDarkly trigger associated with:

```text
customer-insights-enabled
```

Configure the trigger to turn the feature flag **OFF**.

Store the generated trigger URL securely.

> **The trigger URL should not be exposed to browser code.**

## Important

Do **not** use:

```env
VITE_LD_TRIGGER_URL=...
```

Vite exposes variables beginning with `VITE_` to the client-side application.

A LaunchDarkly administrative/remediation trigger should remain **outside the public browser bundle**.

---

## Testing the Trigger

The trigger can be invoked from a local Mac Terminal.

For example:

```bash
export LD_TRIGGER_URL="https://YOUR_TRIGGER_URL"
```

Then:

```bash
curl -X POST "$LD_TRIGGER_URL"
```

Alternatively:

```bash
curl -X POST "https://YOUR_TRIGGER_URL"
```

---

## Remediation Flow

With Customer Insights enabled, the remediation demonstration follows this sequence:

```mermaid
flowchart TD
    PROBLEM[Problem Detected] --> MONITOR[Monitoring System]
    MONITOR -->|POST| TRIGGER[LaunchDarkly Trigger]
    TRIGGER --> FLAG[Feature Flag → OFF]
    FLAG --> SDK[LaunchDarkly SDK]
    SDK --> REACT[React Listener]
    REACT --> REMOVE[Customer Insights Removed]
```

In a production environment, the `curl` command could be replaced by an automated monitoring or incident-response system.

---

# Project Structure

```text
launchdarkly-se-exercise/
├── README.md
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── launchdarkly.ts
    └── components/
        ├── CustomerDashboard.tsx
        ├── CustomerInsights.tsx
        └── ReleaseStatus.tsx
```

---

# Key Components

### `launchdarkly.ts`

Initializes the LaunchDarkly client and defines the customer context used for flag evaluation.

### `App.tsx`

Waits for LaunchDarkly initialization, evaluates the feature flag, and listens for real-time flag changes.

### `CustomerDashboard.tsx`

Displays the customer dashboard and conditionally renders Customer Insights.

### `CustomerInsights.tsx`

Represents the new feature being controlled by LaunchDarkly.

### `ReleaseStatus.tsx`

Displays whether Customer Insights is currently **LIVE** or **OFF**.

### `styles.css`

Provides the presentation and responsive layout for the application.

---

# Demonstration

A simple demonstration setup uses three browser/terminal windows.

### Window 1 — Application

```text
http://localhost:5173
```

### Window 2 — LaunchDarkly

Feature flag:

```text
customer-insights-enabled
```

### Window 3 — Terminal

```bash
curl -X POST "$LD_TRIGGER_URL"
```

## Demonstration Sequence

1. Start with Customer Insights disabled.
2. Turn the LaunchDarkly flag **ON**.
3. Show the feature appearing without a browser refresh.
4. Turn the flag **OFF**.
5. Show the feature disappearing without a refresh.
6. Configure targeting for enterprise customers.
7. Enable the feature.
8. Invoke the remediation trigger from Terminal.
9. Show LaunchDarkly turning the feature **OFF**.



# Individual Targeting

The application supports both **individual targeting** and **rule-based targeting** using the same LaunchDarkly feature flag.

This allows the demonstration to show the difference between:

* Targeting a specific customer
* Targeting a group of customers based on attributes

---

## Configure Individual Targeting

In LaunchDarkly, open the feature flag:

```text
customer-insights-enabled
```

Navigate to the **Targeting** section.

Configure an individual target for:

```text
Customer:
Jane Smith

Context key:
customer-123
```

Set the individual target's variation to:

```text
ON
```

The resulting configuration should conceptually look like:

```text
Individual Targeting

customer-123
Jane Smith
     │
     ▼
    ON
```

The important value is the context key:

```text
customer-123
```

This corresponds to the context created by the application:

```ts
{
  kind: "user",
  key: "customer-123",
  name: "Jane Smith",
  plan: "standard",
  country: "US",
}
```

> The `key` uniquely identifies the customer context used for individual targeting.

---

## Configure Rule-Based Targeting

After the individual target, add a targeting rule for enterprise customers.

Configure:

```text
IF
    plan is enterprise

THEN
    ON
```

The targeting configuration should conceptually be:

```text
┌─────────────────────────────────────┐
│ Individual Target                   │
│ customer-123 → ON                   │
├─────────────────────────────────────┤
│ Rule                                 │
│ plan == enterprise → ON              │
├─────────────────────────────────────┤
│ Default                             │
│ everyone else → OFF                  │
└─────────────────────────────────────┘
```

This allows the application to demonstrate both targeting approaches.

---

## Demonstrating Individual Targeting

The application supports selecting a customer through the URL.

Start the application:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173/?customer=customer-123
```

The application loads the context:

```text
Jane Smith
customer-123
plan = standard
```

Because `customer-123` is individually targeted, the result should be:

```text
Customer Insights → ON
```

### Important Demonstration Point

Jane has:

```text
plan = standard
```

She does **not** match the enterprise targeting rule.

She receives the feature because she is **individually targeted**.

This makes the distinction between individual and rule-based targeting visible during the demonstration.

---

## Demonstrating Rule-Based Targeting

Open:

```text
http://localhost:5173/?customer=customer-456
```

The application loads:

```text
John Doe
customer-456
plan = enterprise
```

Assuming `customer-456` is not individually targeted, the enterprise rule evaluates to:

```text
plan == enterprise
        │
        ▼
       ON
```

The result should be:

```text
Customer Insights → ON
```

This demonstrates **rule-based targeting**.

---

## Demonstrating the Default OFF Variation

Open:

```text
http://localhost:5173/?customer=customer-789
```

The application loads:

```text
Alex Johnson
customer-789
plan = standard
```

Alex is:

* Not individually targeted
* Not an enterprise customer

Therefore, the default variation should apply:

```text
Customer Insights → OFF
```

---

## Targeting Demonstration Matrix

| Customer     | Context Key    | Plan         | Individual Target | Rule Match | Result  |
| ------------ | -------------- | ------------ | ----------------- | ---------- | ------- |
| Jane Smith   | `customer-123` | `standard`   | Yes               | No         | **ON**  |
| John Doe     | `customer-456` | `enterprise` | No                | Yes        | **ON**  |
| Alex Johnson | `customer-789` | `standard`   | No                | No         | **OFF** |

This provides a clear demonstration of how LaunchDarkly can control feature exposure at both the **individual** and **rule-based** levels.

---

## Demonstrating Individual targeting

For the interview, demonstrate the three customers in this order.

### 1. Individual Targeting

Open:

```text
http://localhost:5173/?customer=customer-123
```

Show:

```text
Jane Smith
standard · customer-123

✨ Customer Insights
```

Explain:

> "Jane is receiving the feature because her specific customer context is individually targeted. She does not qualify for the enterprise rule."

### 2. Rule-Based Targeting

Open:

```text
http://localhost:5173/?customer=customer-456
```

Show:

```text
John Doe
enterprise · customer-456

✨ Customer Insights
```

Explain:

> "John isn't individually targeted. He's receiving the feature because he matches the enterprise targeting rule."

### 3. Default Behavior

Open:

```text
http://localhost:5173/?customer=customer-789
```

Show:

```text
Alex Johnson
standard · customer-789

Customer Insights → OFF
```

Explain:

> "Alex doesn't match the individual target or the enterprise rule, so he receives the default OFF variation."

---

## Real-Time Changes Still Apply

Individual targeting does not change the application's real-time behavior.

For example, while viewing:

```text
http://localhost:5173/?customer=customer-123
```

change the individual target in LaunchDarkly:

```text
customer-123
ON → OFF
```

The browser should receive the flag change through the LaunchDarkly SDK and remove Customer Insights **without a browser refresh**.

Change it back:

```text
customer-123
OFF → ON
```

Customer Insights should reappear without refreshing the page.

This demonstrates that LaunchDarkly controls both **who receives the feature** and **when the feature is released or rolled back**.

---

## Targeting Flow

The complete targeting model is:

```mermaid
flowchart TD
    CONTEXT[Customer Context] --> INDIVIDUAL{Individual Target?}

    INDIVIDUAL -->|customer-123| ON1[ON]
    INDIVIDUAL -->|No| RULE{plan == enterprise?}

    RULE -->|Yes| ON2[ON]
    RULE -->|No| OFF[OFF]

    ON1 --> FEATURE[Customer Insights]
    ON2 --> FEATURE
```

This demonstrates the core LaunchDarkly capability required by the exercise:

**Deploy → Target → Release → Monitor → Remediate**

10. Show the browser responding to the change.

---


