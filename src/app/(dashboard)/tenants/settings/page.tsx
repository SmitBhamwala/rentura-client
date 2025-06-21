"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation
} from "@/state/api";

export default function TenantSettingsPage() {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTenantSettings] = useUpdateTenantSettingsMutation();

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
    await updateTenantSettings({
      cognitoId: authUser?.cognitoInfo.userId || "",
      ...data
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="tenant"
    />
  );
}
