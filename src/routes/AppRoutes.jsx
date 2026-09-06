import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import ParagraphReading from "../pages/ParagraphReading";
import Register from "../pages/Register";
import MockInterview from "../pages/MockInterview";
import InitialInterview from "../pages/InitialInterview";
import InitialInterviewRecording from "../pages/InitialInterviewRecording";
import MockInterviewFeedback from "../pages/MockInterviewFeedback";
import PracticeHistory from "../pages/PracticeHistory";
import Profile from "../pages/Profile";
import PerformanceSummary from "../pages/PerformanceSummary";
import AdminLogin from "../pages/AdminLogin";
import SuperAdminLogin from "../pages/SuperAdminLogin";
import CreateAdminAccount from "../pages/CreateAdminAccount";
import AdminDashboard from "../pages/AdminDashboard";
import ManageInterviewQuestions from "../pages/ManageInterviewQuestions";
import MonitorUsers from "../pages/MonitorUsers";
import AdminProfile from "../pages/AdminProfile";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import SuperAdminQuestionApprovals from "../pages/SuperAdminQuestionApprovals";
import SuperAdminUsers from "../pages/SuperAdminUsers";
import ForgotPassword from "../pages/ForgotPassword";
import ParagraphAssessment from "../pages/ParagraphAssessment";
import ParagraphAssessmentResult from "../pages/ParagraphAssessmentResult";
import PacingExercisePage from "../pages/PacingExercise";
import SuperAdminProfile from "../pages/SuperAdminProfile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ParagraphReading" element={<ParagraphReading />} />
      <Route path="/paragraph-assessment/:level" element={<ParagraphAssessment />} />
      <Route path="/paragraph-result/:level" element={<ParagraphAssessmentResult />} />
      <Route path="/pacing-exercise/:level" element={<PacingExercisePage />} />
      <Route path="/pacing-exercise" element={<PacingExercisePage />} />
      <Route path="/pacing-drill/:level" element={<PacingExercisePage />} />
      <Route path="/easy-level-paragraph-reading" element={<ParagraphAssessment level="easy" />} />
      <Route path="/medium-level-paragraph-reading" element={<ParagraphAssessment level="medium" />} />
      <Route path="/hard-level-paragraph-reading" element={<ParagraphAssessment level="hard" />} />
      <Route path="/EasyLevelResult" element={<ParagraphAssessmentResult level="easy" />} />
      <Route path="/medium-level-result" element={<ParagraphAssessmentResult level="medium" />} />
      <Route path="/hard-level-result" element={<ParagraphAssessmentResult level="hard" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/MockInterview" element={<MockInterview />} />
      <Route path="/InitialInterview" element={<InitialInterview />} />
      <Route path="/InitialInterviewRecording" element={<InitialInterviewRecording />} />
      <Route path="/MockInterviewFeedback" element={<MockInterviewFeedback />} />
      <Route path="/PracticeHistory" element={<PracticeHistory />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/PerformanceSummary" element={<PerformanceSummary />} />
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/SuperAdminLogin" element={<SuperAdminLogin />} />
      <Route path="/CreateAdminAccount" element={<CreateAdminAccount />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/SuperAdminDashboard" element={<SuperAdminDashboard />} />
      <Route path="/SuperAdminQuestionApprovals" element={<SuperAdminQuestionApprovals />} />
      <Route path="/SuperAdminUsers" element={<SuperAdminUsers />} />
      <Route path="/ManageInterviewQuestions" element={<ManageInterviewQuestions />} />
      <Route path="/MonitorUsers" element={<MonitorUsers />} />
      <Route path="/AdminProfile" element={<AdminProfile />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/SuperAdminProfile" element={<SuperAdminProfile />} />
    </Routes>
  );
}
