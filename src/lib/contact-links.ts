import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { profile } from "@/content/profile";

export type ContactLink = { label: string; href: string; icon: typeof Mail };

/** The contact buttons (Email, LinkedIn, GitHub) that the profile has a value for, in that order. */
export function getContactLinks(): ContactLink[] {
  return [
    profile.contact.email && {
      label: "Email",
      href: `mailto:${profile.contact.email}`,
      icon: Mail,
    },
    profile.contact.linkedin && {
      label: "LinkedIn",
      href: profile.contact.linkedin,
      icon: LinkedinIcon,
    },
    profile.contact.github && {
      label: "GitHub",
      href: profile.contact.github,
      icon: GithubIcon,
    },
  ].filter(Boolean) as ContactLink[];
}
