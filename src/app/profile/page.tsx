"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useToast } from "~/hooks/use-toast";
import { Skeleton } from "~/components/ui/skeleton";

export default function ProfilePage() {
  const { toast } = useToast();
  const { data: profile, isLoading } = api.profile.getProfile.useQuery();
  const { mutate: updateProfile } = api.profile.updateProfile.useMutation({
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

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    name: "",
    email: "",
  });

  // Update form data when profile is loaded
  useState(() => {
    if (profile) {
      setFormData({
        firstname: profile.firstname ?? "",
        lastname: profile.lastname ?? "",
        name: profile.name ?? "",
        email: profile.email ?? "",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile?.image ?? ""} alt="Profile" />
              <AvatarFallback>
                {profile?.firstname?.[0]}
                {profile?.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                {profile?.firstname} {profile?.lastname}
              </h2>
              <p className="text-gray-500 mb-1">{profile?.email}</p>
              <p className="text-gray-500">
                {profile?.isManager ? "Manager" : "Employee"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) =>
                    setFormData({ ...formData, firstname: e.target.value })
                  }
                  disabled={!profile?.isManager}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) =>
                    setFormData({ ...formData, lastname: e.target.value })
                  }
                  disabled={!profile?.isManager}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!profile?.isManager}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!profile?.isManager}
              />
            </div>

            {!profile?.isManager && profile?.managerInfo && (
              <div className="space-y-2">
                <Label>Manager</Label>
                <p className="text-gray-600">
                  {profile.managerInfo.firstname} {profile.managerInfo.lastname}
                </p>
              </div>
            )}

            {profile?.isManager && (
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            <Skeleton className="w-32 h-32 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
