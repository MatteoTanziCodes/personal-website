import { IconProps } from "@iconify/react";

export type IconType = React.FC<IconProps>;

export interface IconConfig {
  icon: string;
  label: string;
}

export type IconName =
  | "rest"
  | "filebeat"
  | "apachekafka"
  | "soapui"
  | "jira"
  | "confluence"
  | "java"
  | "bash"
  | "github"
  | "moon"
  | "sun"
  | "user"
  | "briefcase"
  | "book"
  | "plane"
  | "globe";