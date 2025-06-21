"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation
} from "@/state/api";

export default function ManagerSettingsPage() {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateManagerSettings] = useUpdateManagerSettingsMutation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManagerSettings({
      cognitoId: authUser?.cognitoInfo.userId || "",
      ...data
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="manager"
    />
  );
}
