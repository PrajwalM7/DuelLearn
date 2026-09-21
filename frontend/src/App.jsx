import { BrowserRouter, Routes, Route } from "react-router-dom";
import SocketProvider from "./SocketProvider";

import Auth from "./pages/Auth";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import StudentDashboard from "./pages/StudentDashboard";
import Battle from "./pages/Battle";
import LearningPage from "./learning/pages/learningpage.jsx";
import SubjectPage from "./learning/pages/subjectPage.jsx";
import MissionPage from "./learning/pages/MissionPage.jsx";
import { XpProvider } from "./XPContext.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/learning" element={<LearningPage />} />
        <Route path="/subject/:id" element={<SubjectPage />} />
        <Route path="/mission/:id" element={<MissionPage />} />
        <Route path="leaderboard" element={<Leaderboard/>}/>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;