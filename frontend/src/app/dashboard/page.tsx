"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NanoBananaDashboard from "@/components/dashboard/NanoBananaDashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <NanoBananaDashboard />
    </ProtectedRoute>
  );
}