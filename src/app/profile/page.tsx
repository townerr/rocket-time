"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useToast } from "~/hooks/use-toast";
import { Skeleton } from "~/components/ui/skeleton";

// Types
interface ProfileFormData {
  firstname: string;
  lastname: string;
  name: string;
  email: string;
}

interface ProfileData {
  name: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  // Add other fields as needed
}

// Component for loading skeleton
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-28" />
    </div>
  );
}

// Component for avatar section
function ProfileAvatar({ name, email }: { name: string; email: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mb-6 flex items-center space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src="" alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-lg font-medium">{name}</div>
        <div className="text-sm text-muted-foreground">{email}</div>
      </div>
    </div>
  );
}

// Component for form field
function FormField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} value={value} onChange={onChange} />
    </div>
  );
}

export default function ProfilePage() {
  const { toast } = useToast();
  const { data: profile, isLoading } = api.profile.getProfile.useQuery();
  const updateProfileMutation = api.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState<ProfileFormData>({
    firstname: "",
    lastname: "",
    name: "",
    email: "",
  });

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        firstname: profile.firstname ?? "",
        lastname: profile.lastname ?? "",
        name: profile.name ?? "",
        email: profile.email ?? "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <form onSubmit={handleSubmit}>
            {profile && (
              <ProfileAvatar
                name={profile.name ?? "User"}
                email={profile.email ?? "No email"}
              />
            )}

            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  id="firstname"
                  label="First Name"
                  value={formData.firstname}
                  onChange={handleChange}
                />
                <FormField
                  id="lastname"
                  label="Last Name"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>

              <FormField
                id="name"
                label="Display Name"
                value={formData.name}
                onChange={handleChange}
              />

              <FormField
                id="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
