import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomFormField } from "./FormField";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

export default function SettingsForm({
  initialData,
  onSubmit,
  userType
}: SettingsFormProps) {
  const [editMode, setEditMode] = useState(false);
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData
  });

  const toggleEditMode = () => {
    setEditMode(!editMode);

    if (editMode) {
      form.reset(initialData);
    }
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await onSubmit(data);
    setEditMode(false);
  };

  return (
    <div className="pt-8 mb-5 px-8">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">
          {userType.charAt(0).toUpperCase() + userType.slice(1)} Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account preferences and personal information
        </p>
      </div>
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6">
            <CustomFormField
              name="name"
              label="Name"
              type="text"
              disabled={!editMode}
            />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              disabled={!editMode}
            />
            <CustomFormField
              name="phoneNumber"
              label="Phone Number"
              type="number"
              disabled={!editMode}
            />

            <div className="pt-4 flex justify-between">
              <Button
                type="button"
                onClick={toggleEditMode}
                className="bg-secondary-500 text-white hover:bg-secondary-600">
                {editMode ? "Cancel" : "Edit"}
              </Button>

              {editMode && (
                <Button
                  type="submit"
                  className="bg-primary-700 text-white hover:bg-primary-800">
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
