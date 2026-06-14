"use client";

import { makeInitials, readAppSettings } from "@/lib/app-settings";
import type { TeamMember, TeamMemberStatus, UserRole } from "@/lib/types";

export const teamMembersStorageKey = "socialflow.team-members.v1";

export type TeamMemberInput = {
  name: string;
  email: string;
  role: UserRole;
  status?: TeamMemberStatus;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `member-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createOwnerMember(): TeamMember {
  const settings = readAppSettings();
  const now = new Date().toISOString();
  const name = settings.userName || "Ahmet Kurtis";

  return {
    id: "owner",
    name,
    email: "admin@socialflow.local",
    role: "admin",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}

export function readTeamMembers(): TeamMember[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(teamMembersStorageKey);
    if (!raw) {
      return [createOwnerMember()];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [createOwnerMember()];
  } catch {
    return [createOwnerMember()];
  }
}

export function writeTeamMembers(members: TeamMember[]) {
  window.localStorage.setItem(teamMembersStorageKey, JSON.stringify(members));
  window.dispatchEvent(new CustomEvent("socialflow:team-updated"));
}

export function saveTeamMember(input: TeamMemberInput) {
  const now = new Date().toISOString();
  const member: TeamMember = {
    id: createId(),
    name: input.name.trim() || "İsimsiz kullanıcı",
    email: input.email.trim().toLowerCase(),
    role: input.role,
    status: input.status ?? "invited",
    createdAt: now,
    updatedAt: now,
  };

  const existing = readTeamMembers();
  writeTeamMembers([member, ...existing]);

  return member;
}

export function updateTeamMember(
  id: string,
  updates: Partial<Pick<TeamMember, "name" | "email" | "role" | "status">>,
) {
  const now = new Date().toISOString();
  const next = readTeamMembers().map((member) =>
    member.id === id
      ? {
          ...member,
          ...updates,
          name: updates.name !== undefined ? updates.name.trim() : member.name,
          email: updates.email !== undefined ? updates.email.trim().toLowerCase() : member.email,
          updatedAt: now,
        }
      : member,
  );

  writeTeamMembers(next);
}

export function deleteTeamMember(id: string) {
  writeTeamMembers(readTeamMembers().filter((member) => member.id !== id));
}

export function getMemberInitials(member: Pick<TeamMember, "name" | "email">) {
  return makeInitials(member.name || member.email);
}
