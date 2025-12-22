import { EmploymentType } from "@/lib/generated/prisma";

export type Experience = {
  id: string;

  title: string;
  employmentType: EmploymentType;
  company: string;

  startMonth: number;
  startYear: number;

  endMonth?: number;
  endYear?: number;

  isCurrent: boolean;
};

export default Experience;
