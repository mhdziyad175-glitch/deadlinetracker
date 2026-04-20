/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'completed';

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  module: string;
  dueDate: string; // ISO String
  priority: Priority;
  status: Status;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
