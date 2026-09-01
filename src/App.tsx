import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { History } from "./pages/History";

// Create a client
const queryClient = new QueryClient();

// Dark theme configuration for Ant Design
const antdTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#10b981", // emerald-500
    colorBgBase: "#0f172a",
    colorBgContainer: "#1e293b",
    colorBorder: "rgba(255, 255, 255, 0.1)",
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
  components: {
    Input: {
      colorBgContainer: "#0f172a",
      colorBorder: "#334155",
      activeBorderColor: "#10b981",
      hoverBorderColor: "#10b981",
    },
    Button: {
      borderRadius: 8,
    },
    Checkbox: {
      colorPrimary: "#10b981",
      colorPrimaryHover: "#059669",
    },
  },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:sessionId" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
            {/* Catch all to Dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
