import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { AnalyticsTabContent } from "./AdminAnalytics";
import { Activity } from "lucide-react";

const AdminAnalyticsHub = () => {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" /> Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Events en sessies
        </p>
      </div>

      <AnalyticsTabContent />
    </AdminLayout>
  );
};

export default AdminAnalyticsHub;
