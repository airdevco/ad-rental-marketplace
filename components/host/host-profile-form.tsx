"use client";

import { useRef } from "react";
import { Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type HostProfileData = {
  name: string;
  bio: string;
  photo: string;
};

type Props = {
  data: HostProfileData;
  onChange: (updated: Partial<HostProfileData>) => void;
  /** Show heading + subheading (used in onboarding). Omit in dashboard where heading is separate. */
  showHeading?: boolean;
  /** Show Save button (used in dashboard). Omit in onboarding where Continue is the action. */
  showSave?: boolean;
  onSave?: () => void;
};

export function HostProfileForm({ data, onChange, showHeading = false, showSave = false, onSave }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ photo: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      {showHeading && (
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900">Set up your host profile</h2>
          <p className="mt-2 text-muted-foreground">
            Guests are more likely to book when they know who they're staying with.
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />

      {/* Avatar */}
      <div className="group relative flex flex-col items-center gap-3">
        {data.photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.photo}
              alt="Host"
              className="size-20 rounded-full border border-zinc-200 object-cover"
            />
            <button
              type="button"
              onClick={() => onChange({ photo: "" })}
              className="absolute top-0 flex size-20 items-center justify-center rounded-full bg-black/20 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
              aria-label="Remove photo"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-zinc-700 text-white shadow-md">
                <Trash2 className="size-4" />
              </span>
            </button>
          </>
        ) : (
          <Avatar className="size-20 border border-zinc-200">
            <AvatarFallback className="bg-zinc-100 text-2xl text-zinc-500">
              <User className="size-10" />
            </AvatarFallback>
          </Avatar>
        )}
        <Button
          variant="outline"
          size="sm"
          className="rounded-[5px] shadow-none"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload photo
        </Button>
      </div>

      {/* Display name */}
      <div className="space-y-1.5">
        <Label htmlFor="host-profile-name" className="text-xs font-semibold text-zinc-900">
          Display name
        </Label>
        <Input
          id="host-profile-name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Alex"
          className="h-11 rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="host-profile-bio" className="text-xs font-semibold text-zinc-900">
          About you <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="host-profile-bio"
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Tell guests a bit about yourself — where you're from, what you love about your city, or what kind of host you are."
          rows={4}
          className="rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
        />
      </div>

      {showSave && (
        <div className="flex justify-end">
          <Button
            className="h-11 rounded-[5px] bg-primary font-medium shadow-none hover:bg-primary/90"
            onClick={onSave}
          >
            Save profile
          </Button>
        </div>
      )}
    </div>
  );
}
