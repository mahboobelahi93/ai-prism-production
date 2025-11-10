import type { EnrollStatus } from "@prisma/client";

export type Enrollment = {
  id: string;
  email: string;
  pilot: string;
  pilot_id: string;
  user_id: string;
  status: EnrollStatus;
};

export type StatusCounts = {
  ALL: number;
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
};

export type UserProgressData = {
  id: string;
  email: string;
  pilot: {
    id: string;
    title: string;
  };
  status: string;
  progress: any;
};
