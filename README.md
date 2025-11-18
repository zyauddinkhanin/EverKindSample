# 🚀 EverKindSample App

A modern, component-driven journal application built with **Expo React Native** and **TypeScript**. This app features a beautiful, gradient-heavy UI, smooth chat-style interactions, and sophisticated animations powered by `react-native-reanimated` to create a highly engaging user experience.

---

## ✨ Features

- **Chat-Style Journaling:** User entries and AI prompts are displayed in a clean, messaging interface.
- **Gradient UI:** Custom `expo-linear-gradient` implementation for both the screen background and interactive chat bubbles. The main journal card uses a layered approach to allow shadows to render correctly on iOS.
- **Smooth Animations:**
  - **Sequential Bubble Entry:** Chat bubbles fade in and slide up sequentially upon loading.
  - **Typing Indicator:** A realistic three-dot animation appears while the AI is "thinking."
  - **Card Transition:** A fluid slide-in/slide-out animation when saving a journal to reset the chat, mimicking a deck of cards.
- **TypeScript Architecture:** Component-Driven Development (CDD) with clear interfaces for maintainability and scalability.
- **Keyboard Handling:** Uses `KeyboardAvoidingView` for a seamless experience on iOS and Android.

---

## 🏗️ Architecture and Standards

The project follows a component-driven structure, utilizing TypeScript for type safety and `react-native-reanimated` for native-performance animations.

### Directory Structure

EverKindSample/ ├── src/ │ ├── components/ # Reusable UI elements (Buttons, Input, Bubbles) │ │ ├── AnimatedChatBubble.tsx │ │ ├── JournalCard.tsx │ │ ├── JournalInput.tsx │ │ └── TypingIndicator.tsx │ ├── constants/ # Global configuration (Colors.ts) │ ├── types.ts # TypeScript interfaces (JournalItem, Props) │ └── App.tsx # Main application state and routing (Entry point) ├── assets/ ├── babel.config.js # Required Reanimated plugin configuration └── package.json

### Key Technologies

| Technology                    | Purpose                                         |
| :---------------------------- | :---------------------------------------------- |
| **Expo**                      | Managed workflow for development and building.  |
| **TypeScript**                | Type safety and better code organization.       |
| **`react-native-reanimated`** | High-performance, declarative animations (V3+). |
| **`expo-linear-gradient`**    | Rendering complex gradient backgrounds.         |

---

## 🛠️ Installation and Setup

### Prerequisites

- Node.js (LTS recommended)
- Expo CLI (`npm install -g expo-cli`)

### Steps

1.  **Clone the Repository (If applicable):**

    ```bash
    git clone [repository-url]
    cd EverKindSample
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Install Native Modules (Crucial for Gradients and Animations):**

    ```bash
    npx expo install expo-linear-gradient react-native-reanimated
    ```

4.  **Configure Babel (Mandatory for Reanimated):**
    Ensure your `babel.config.js` file includes the Reanimated plugin as the **last item** in the `plugins` array:

    ```javascript
    // babel.config.js
    module.exports = function (api) {
      api.cache(true);
      return {
        presets: ["babel-preset-expo"],
        plugins: ["react-native-reanimated/plugin"],
      };
    };
    ```

5.  **Start the App (Clear Cache is Recommended):**
    ```bash
    npx expo start --clear-cache
    ```
    Scan the QR code with the Expo Go app on your mobile device or run in a simulator.

---

## ⚙️ How to Use

- **Journaling:** Type a message into the input field and press the **Send** button (which replaces the microphone icon) or the **Return** key on the keyboard.
- **AI Response:** An animated **typing indicator** will appear, followed by a simulated AI response after a random delay.
- **Reset Chat:** Tap the **"Save journal"** button to trigger the **slide-out animation**, reset the chat session, and seamlessly transition to a **new, empty chat card** via the slide-in animation.

---

## 📝 TypeScript Interfaces

The core data structure for the chat items is defined in `src/types.ts`:

```typescript
// src/types.ts
export type JournalItem = {
  type: "title" | "user" | "ai";
  text: string;
};

export interface ChatBubbleProps {
  text: string;
  isAI: boolean;
  delay: number;
}

export interface JournalCardProps {
  data: JournalItem[];
  onSave: () => void;
  cardTranslateX: number;
  isTyping: boolean;
}

export interface JournalInputProps {
  currentText: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
}
```
