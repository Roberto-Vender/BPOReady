import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import ParagraphReading from "../pages/ParagraphReading";
import Register from "../pages/Register";
import EasyLevelParagraphReading from "../pages/EasyLevelParagraphReading";
import MediumLevelParagraphReading from "../pages/MediumLevelParagraphReading";
import HardLevelParagraphReading from "../pages/HardLevelParagraphReading";
import EasyLevelResult from "../pages/EasyLevelResult";
import MediumLevelResult from "../pages/MediumLevelResult";
import HardLevelResult from "../pages/HardLevelResult";
import MockInterview from "../pages/MockInterview";
import InitialInterview from "../pages/InitialInterview";
import InitialInterviewRecording from "../pages/InitialInterviewRecording";
import MockInterviewFeedback from "../pages/MockInterviewFeedback";
import PracticeHistory from "../pages/PracticeHistory";
import Profile from "../pages/Profile";
import PerformanceSummary from "../pages/PerformanceSummary";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import ManageInterviewQuestions from "../pages/ManageInterviewQuestions";
import MonitorUsers from "../pages/MonitorUsers";
import AdminProfile from "../pages/AdminProfile";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ParagraphReading" element={<ParagraphReading />} />
      <Route path="/easy-level-paragraph-reading" element={<EasyLevelParagraphReading />} />
      <Route path="/medium-level-paragraph-reading" element={<MediumLevelParagraphReading />} />
      <Route path="/hard-level-paragraph-reading" element={<HardLevelParagraphReading />} />
      <Route path="/EasyLevelResult" element={<EasyLevelResult />} />
      <Route path="/medium-level-result" element={<MediumLevelResult />} />
      <Route path="/hard-level-result" element={<HardLevelResult />} />
      <Route path="/register" element={<Register />} />
      <Route path="/MockInterview" element={<MockInterview />} />
      <Route path="/InitialInterview" element={<InitialInterview />} />
      <Route path="/InitialInterviewRecording" element={<InitialInterviewRecording />} />
      <Route path="/MockInterviewFeedback" element={<MockInterviewFeedback />} />
      <Route path="/PracticeHistory" element={<PracticeHistory />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/PerformanceSummary" element={<PerformanceSummary />} />
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/ManageInterviewQuestions" element={<ManageInterviewQuestions />} />
      <Route path="/MonitorUsers" element={<MonitorUsers />} />
      <Route path="/AdminProfile" element={<AdminProfile />} />
    </Routes>
  );
}
