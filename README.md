# 💪 Fitness Tracker Web

<p align="center">
  <img src="https://github.com/user-attachments/assets/200a95f5-03dd-4aed-a646-5508e870fca4" alt="Live Demo Screenshot" width="600">
</p>

> A real-time fitness tracking web application that uses TensorFlow.js and pose detection to monitor exercise form, count repetitions, and provide feedback — all through your webcam!

<details open>
<summary>🇺🇸 English</summary>

## 🚀 Features

- 🎯 **Real-Time Pose Detection** – Powered by TensorFlow.js and MoveNet/PoseNet
- 🧠 **Exercise Recognition** – Smart logic to detect current movements
- 🔁 **Repetition Counting** – Via angle thresholds and state machine logic
- 🛡️ **Form Feedback** – Real-time correction cues for safer workouts
- 🧾 **Exercise Library** – Supports multiple common exercises
- 💬 **Assistant Chatbot** – Built-in chatbot to guide users, answer questions, and suggest form improvements

## 🛠️ Technical Stack

- **Frontend**: React + TypeScript  
- **Styling**: Tailwind CSS  
- **UI Library**: Shadcn UI  
- **Pose Detection**: TensorFlow.js with MoveNet/PoseNet  
- **State Management**: React Hooks + Context API  
- **Backend**: Supabase

## 🔐 Privacy First

All pose estimation runs **entirely in-browser**. No video or data is uploaded — your privacy is respected by design.

## 🏋️ Supported Exercises

| Exercise | Preview |
|----------|---------|
| **Squats** | ![Squats](https://i.pinimg.com/originals/f9/db/a3/f9dba36451cab8b0b5be6d5ec9fd438a.gif) |
| **Bicep Curls** | ![Bicep Curls](https://i.pinimg.com/originals/68/4d/50/684d50925eabbdf60f66d4bf7013c9ef.gif) |
| **Push-ups** | ![Push-ups](https://i.pinimg.com/originals/fd/bb/09/fdbb092b58863e5c86fdb8bb1411fcea.gif) |
| **Pull-ups** | ![Pull-ups](https://tunturi.org/Blogs/2022/09-pull-up.gif) |
| **Forward Lunges** | ![Forward Lunge](Forward%20Lunge.gif) |

## 🧪 Getting Started

### Prerequisites

- Node.js (v18+) and npm/yarn/bun installed
- Modern web browser with webcam access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ma7moud12975/Fitness-Tracker-web-v1.git
   cd Fitness-Tracker-web-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open the application**
   
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser

5. **Allow camera access**
   
   When prompted, allow access to your webcam to enable pose detection

6. **Start exercising!**
   
   Choose your exercise, get in position, and the tracker will do the rest

## 🔧 Building for Production

```bash
npm run build
# or
yarn build
# or
bun build
```

The built files will be in the `dist` directory, ready to be deployed.

## 🌟 Inspiration

This project was inspired by the Python-based [Fitness Tracker Pro](https://github.com/a1harfoush/Fitness_Tracker_Pro), adapted for the modern web using JavaScript and TensorFlow.js.

</details>
