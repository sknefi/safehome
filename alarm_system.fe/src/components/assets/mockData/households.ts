import { Household } from "../interfaces";

export const mockHousehold: Household = {
  id: "household-1",
  name: "Smith Family Home",
  admin: [
    { id: "user-1", firstName: "John", lastName: "Smith" },
    { id: "user-2", firstName: "Jane", lastName: "Smith" },
  ],
  members: [
    { id: "user-3", firstName: "Emma", lastName: "Smith" },
    { id: "user-4", firstName: "Mike", lastName: "Smith" },
  ],
  devices: [
    {
      id: "device-1",
      name: "Smart Lock",
      type: "Security",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "device-2",
      name: "Thermostat",
      type: "Climate",
      createdAt: new Date("2023-12-10"),
    },
  ],
  logs: [
    {
      id: "log-1",
      userId: "user-1",
      deviceId: "device-1",
      type: "Unlock",
      message: "John unlocked the front door",
      date: new Date("2024-03-10T08:30:00"),
    },
  ],
  current_state: "Active",
  trigger_alarm: false,
  createdAt: new Date("2024-01-01"),
};

export const mockHouseholds: Household[] = [
  {
    id: "household-1",
    name: "Smith Family Home",
    admin: [
      { id: "user-1", firstName: "John", lastName: "Smith" },
      { id: "user-2", firstName: "Jane", lastName: "Smith" },
    ],
    members: [
      { id: "user-3", firstName: "Emma", lastName: "Smith" },
      { id: "user-4", firstName: "Mike", lastName: "Smith" },
    ],
    devices: [
      {
        id: "device-1",
        name: "Smart Lock",
        type: "Security",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "device-2",
        name: "Thermostat",
        type: "Climate",
        createdAt: new Date("2023-12-10"),
      },
    ],
    logs: [
      {
        id: "log-1",
        userId: "user-1",
        deviceId: "device-1",
        type: "Unlock",
        message: "John unlocked the front door",
        date: new Date("2024-03-10T08:30:00"),
      },
    ],
    current_state: "Active",
    trigger_alarm: false,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "household-2",
    name: "Johnson Apartment",
    admin: [{ id: "user-5", firstName: "Robert", lastName: "Johnson" }],
    members: [{ id: "user-6", firstName: "Lisa", lastName: "Johnson" }],
    devices: [
      {
        id: "device-3",
        name: "Camera",
        type: "Security",
        createdAt: new Date("2024-02-05"),
      },
      {
        id: "device-4",
        name: "Smart Light",
        type: "Lighting",
        createdAt: new Date("2024-01-22"),
      },
    ],
    logs: [
      {
        id: "log-2",
        userId: "user-5",
        deviceId: "device-3",
        type: "Camera View",
        message: "Robert accessed the security camera feed",
        date: new Date("2024-03-12T18:15:00"),
      },
      {
        id: "log-3",
        userId: "user-6",
        deviceId: "device-4",
        type: "Light Control",
        message: "Lisa turned off the living room lights",
        date: new Date("2024-03-13T22:00:00"),
      },
    ],
    current_state: "Inactive",
    trigger_alarm: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "household-3",
    name: "Miller Villa",
    admin: [
      { id: "user-7", firstName: "William", lastName: "Miller" },
      { id: "user-8", firstName: "Sophia", lastName: "Miller" },
    ],
    members: [
      { id: "user-9", firstName: "Noah", lastName: "Miller" },
      { id: "user-10", firstName: "Olivia", lastName: "Miller" },
    ],
    devices: [
      {
        id: "device-5",
        name: "Smart TV",
        type: "Entertainment",
        createdAt: new Date("2024-03-01"),
      },
      {
        id: "device-6",
        name: "Security Alarm",
        type: "Security",
        createdAt: new Date("2024-02-10"),
      },
      {
        id: "device-7",
        name: "Garage Door",
        type: "Access",
        createdAt: new Date("2024-01-05"),
      },
    ],
    logs: [
      {
        id: "log-4",
        userId: "user-9",
        deviceId: "device-5",
        type: "TV On",
        message: "Noah turned on the Smart TV",
        date: new Date("2024-03-14T19:30:00"),
      },
      {
        id: "log-5",
        userId: "user-8",
        deviceId: "device-6",
        type: "Alarm Triggered",
        message: "Sophia triggered the security alarm by mistake",
        date: new Date("2024-03-15T07:00:00"),
      },
      {
        id: "log-6",
        userId: "user-10",
        deviceId: "device-7",
        type: "Garage Open",
        message: "Olivia opened the garage door",
        date: new Date("2024-03-16T17:45:00"),
      },
    ],
    current_state: "Active",
    trigger_alarm: false,
    createdAt: new Date("2024-03-01"),
  },
];
