export interface Household {
  _id: string;
  name: string;
  ownerId: string;
  members: User[];
  devices: Device[];
  logs: Log[];
  createdAt: Date;
  __v: number;
}

export interface HouseholdWithOwner {
  _id: string;
  name: string;
  ownerId: User;
  members: User[];
  devices: Device[];
  logs: Log[];
  createdAt: Date;
  __v: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: string;
}

export interface Device {
  _id: string;
  name: string;
  type: string;
  active: boolean;
  alarm_triggered: number;
}

export interface Log {
  _id: string;
  userId: string;
  deviceId: string;
  type: string;
  message: string;
  createdAt: string;
}
