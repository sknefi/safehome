import { Household, Log, User } from "../interfaces";

export const mockUsers: User[] = [];

export const mockHouseholds: Household[] = [
  {
    id: "h1",
    name: "Smith Family",
    password: "secure123",
    owner: mockUsers, // Placeholder, will update below
    logs: [],
    createdAt: new Date("2024-01-01T12:00:00Z"),
  },
  {
    id: "h2",
    name: "Johnson Home",
    password: "safe456",
    owner: mockUsers, // Placeholder, will update below
    logs: [],
    createdAt: new Date("2024-02-01T14:00:00Z"),
  },
];

// Now defining mock users and assigning household owners
mockUsers.push(
  {
    id: "u1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "admin",
    households: [mockHouseholds[0]],
    refreshToken: "token123",
    createdAt: new Date("2024-01-10T10:00:00Z"),
  },
  {
    id: "u2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "user",
    households: [mockHouseholds[0], mockHouseholds[1]],
    refreshToken: "token456",
    createdAt: new Date("2024-02-15T09:30:00Z"),
  }
);

// Assign correct owners
mockHouseholds[0].owner = [mockUsers[0]];
mockHouseholds[1].owner = [mockUsers[1]];

export const mockLogs: Log[] = [
  {
    id: "log1",
    userId: "u1",
    deviceId: "dev1",
    type: "INFO",
    message: "Device activated.",
    time: new Date("2024-03-05T18:45:00Z"),
    createdAt: new Date("2024-03-05T18:45:00Z"),
  },
];
