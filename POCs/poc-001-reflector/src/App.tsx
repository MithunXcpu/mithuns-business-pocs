import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { ConnectPage } from "@/pages/ConnectPage";
import { SignalsPage } from "@/pages/SignalsPage";
import { FindingsPage } from "@/pages/FindingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<ConnectPage />} />
          <Route path="signals" element={<SignalsPage />} />
          <Route path="findings" element={<FindingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
