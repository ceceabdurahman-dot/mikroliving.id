import { type BusyState } from "./adminPanelTypes";

export type NavigationForm = {
  label: string;
  url: string;
  location: "header" | "footer" | "legal";
  sort_order: number;
  opens_new_tab: boolean;
  is_active: boolean;
};

export type ContactForm = {
  label: string;
  value_text: string;
  href: string;
  icon_key: string;
  location_label: string;
  sort_order: number;
  is_active: boolean;
};

export type NavigationContactBusyState = Extract<BusyState, "idle" | "saving" | "deleting">;

export const contactIcons = ["AtSign", "MessageCircle", "Globe"];

export const emptyNavigationForm: NavigationForm = {
  label: "",
  url: "",
  location: "header",
  sort_order: 0,
  opens_new_tab: false,
  is_active: true,
};

export const emptyContactForm: ContactForm = {
  label: "",
  value_text: "",
  href: "",
  icon_key: "MessageCircle",
  location_label: "",
  sort_order: 0,
  is_active: true,
};
