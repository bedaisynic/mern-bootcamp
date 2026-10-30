import { sql } from "drizzle-orm";
import { db } from "./index.js";
import { users, tickets } from "./schema.js";

export const initializeDatabase = async () => {
  console.log("Initializing in-memory database...");

  db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  db.run(sql`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      category TEXT NOT NULL,
      reporter_name TEXT NOT NULL,
      reporter_email TEXT NOT NULL,
      assignee_id INTEGER REFERENCES users(id),
      sla_deadline INTEGER NOT NULL,
      resolved_at INTEGER,
      closed_at INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  console.log("Seeding database...");

  const insertedUsers = await db
    .insert(users)
    .values([
      {
        username: "admin",
        password: "123",
        displayName: "Admin User",
        email: "admin@helpdesk.com",
        role: "admin",
      },
      {
        username: "alice",
        password: "123",
        displayName: "Alice Johnson",
        email: "alice@helpdesk.com",
        role: "agent",
      },
      {
        username: "bob",
        password: "123",
        displayName: "Bob Smith",
        email: "bob@helpdesk.com",
        role: "agent",
      },
      {
        username: "carol",
        password: "123",
        displayName: "Carol Williams",
        email: "carol@helpdesk.com",
        role: "agent",
      },
      {
        username: "dave",
        password: "123",
        displayName: "Dave Brown",
        email: "dave@helpdesk.com",
        role: "viewer",
      },
    ])
    .returning();

  console.log(`Inserted ${insertedUsers.length} users`);

  const now = new Date();
  const hourMs = 60 * 60 * 1000;

  await db.insert(tickets).values([
    {
      title: "Login page returns 500 error",
      description:
        "Users are unable to log in. The login page is throwing a 500 internal server error.",
      status: "open",
      priority: "urgent",
      category: "bug",
      reporterName: "John Doe",
      reporterEmail: "john@example.com",
      assigneeId: null,
      slaDeadline: new Date(now.getTime() + 4 * hourMs),
    },
    {
      title: "Add dark mode support",
      description:
        "Request to add a dark mode theme to the application for better user experience.",
      status: "open",
      priority: "low",
      category: "feature_request",
      reporterName: "Jane Smith",
      reporterEmail: "jane@example.com",
      assigneeId: insertedUsers[1].id,
      slaDeadline: new Date(now.getTime() + 72 * hourMs),
    },
    {
      title: "Cannot reset password",
      description:
        "The password reset link in the email is not working. Users are unable to reset their passwords.",
      status: "open",
      priority: "high",
      category: "bug",
      reporterName: "Mike Johnson",
      reporterEmail: "mike@example.com",
      assigneeId: insertedUsers[2].id,
      slaDeadline: new Date(now.getTime() - 2 * hourMs),
    },
    {
      title: "API rate limiting not working",
      description:
        "The API rate limiting feature is not functioning correctly. Some endpoints are not being rate limited.",
      status: "open",
      priority: "medium",
      category: "bug",
      reporterName: "Sarah Williams",
      reporterEmail: "sarah@example.com",
      assigneeId: insertedUsers[3].id,
      slaDeadline: new Date(now.getTime() + 24 * hourMs),
    },
    {
      title: "Dashboard loading slowly",
      description:
        "The dashboard takes too long to load. Need to optimize queries and reduce load time.",
      status: "open",
      priority: "medium",
      category: "bug",
      reporterName: "Tom Brown",
      reporterEmail: "tom@example.com",
      assigneeId: null,
      slaDeadline: new Date(now.getTime() + 24 * hourMs),
    },
    {
      title: "Export data to CSV feature",
      description:
        "Add ability to export ticket data to CSV format for reporting purposes.",
      status: "in_progress",
      priority: "medium",
      category: "feature_request",
      reporterName: "Emily Davis",
      reporterEmail: "emily@example.com",
      assigneeId: insertedUsers[1].id,
      slaDeadline: new Date(now.getTime() + 24 * hourMs),
    },
    {
      title: "Mobile app crashes on startup",
      description:
        "The mobile application crashes immediately after opening on iOS devices.",
      status: "in_progress",
      priority: "urgent",
      category: "bug",
      reporterName: "Chris Martinez",
      reporterEmail: "chris@example.com",
      assigneeId: insertedUsers[2].id,
      slaDeadline: new Date(now.getTime() - 1 * hourMs),
    },
    {
      title: "How to integrate with Slack?",
      description:
        "Need documentation on how to integrate the helpdesk system with Slack notifications.",
      status: "in_progress",
      priority: "low",
      category: "question",
      reporterName: "Lisa Anderson",
      reporterEmail: "lisa@example.com",
      assigneeId: insertedUsers[3].id,
      slaDeadline: new Date(now.getTime() + 72 * hourMs),
    },
    {
      title: "Email notifications not sending",
      description:
        "Users are not receiving email notifications for ticket updates.",
      status: "in_progress",
      priority: "high",
      category: "bug",
      reporterName: "David Wilson",
      reporterEmail: "david@example.com",
      assigneeId: insertedUsers[1].id,
      slaDeadline: new Date(now.getTime() + 8 * hourMs),
    },
    {
      title: "Account locked after failed login attempts",
      description:
        "User account is locked after 3 failed login attempts and cannot be unlocked.",
      status: "in_progress",
      priority: "medium",
      category: "account_issue",
      reporterName: "Rachel Taylor",
      reporterEmail: "rachel@example.com",
      assigneeId: insertedUsers[2].id,
      slaDeadline: new Date(now.getTime() + 24 * hourMs),
    },
    {
      title: "Search functionality improvements",
      description:
        "Improve the search feature to include filters and better relevance ranking.",
      status: "resolved",
      priority: "medium",
      category: "feature_request",
      reporterName: "Kevin Moore",
      reporterEmail: "kevin@example.com",
      assigneeId: insertedUsers[1].id,
      slaDeadline: new Date(now.getTime() - 48 * hourMs),
      createdAt: new Date(now.getTime() - 96 * hourMs),
      resolvedAt: new Date(now.getTime() - 24 * hourMs),
    },
    {
      title: "Profile picture upload fails",
      description:
        "Users cannot upload profile pictures. The upload button does not respond.",
      status: "resolved",
      priority: "low",
      category: "bug",
      reporterName: "Amanda Clark",
      reporterEmail: "amanda@example.com",
      assigneeId: insertedUsers[2].id,
      slaDeadline: new Date(now.getTime() - 96 * hourMs),
      createdAt: new Date(now.getTime() - 144 * hourMs),
      resolvedAt: new Date(now.getTime() - 48 * hourMs),
    },
    {
      title: "Two-factor authentication setup",
      description:
        "Request to add two-factor authentication for enhanced security.",
      status: "resolved",
      priority: "high",
      category: "feature_request",
      reporterName: "Brian Lee",
      reporterEmail: "brian@example.com",
      assigneeId: insertedUsers[3].id,
      slaDeadline: new Date(now.getTime() - 72 * hourMs),
      createdAt: new Date(now.getTime() - 120 * hourMs),
      resolvedAt: new Date(now.getTime() - 36 * hourMs),
    },
    {
      title: "Incorrect billing amount",
      description:
        "Customer was charged incorrect amount on their last invoice.",
      status: "resolved",
      priority: "urgent",
      category: "account_issue",
      reporterName: "Michelle White",
      reporterEmail: "michelle@example.com",
      assigneeId: insertedUsers[1].id,
      slaDeadline: new Date(now.getTime() - 8 * hourMs),
      createdAt: new Date(now.getTime() - 10 * hourMs),
      resolvedAt: new Date(now.getTime() - 2 * hourMs),
    },
    {
      title: "What are the system requirements?",
      description:
        "Need information about minimum system requirements to run the application.",
      status: "resolved",
      priority: "low",
      category: "question",
      reporterName: "Steven Harris",
      reporterEmail: "steven@example.com",
      assigneeId: insertedUsers[2].id,
      slaDeadline: new Date(now.getTime() - 120 * hourMs),
      createdAt: new Date(now.getTime() - 168 * hourMs),
      resolvedAt: new Date(now.getTime() - 96 * hourMs),
    },
    {
      title: "Bulk ticket assignment feature",
      description:
        "Add feature to assign multiple tickets to an agent at once.",
      status: "closed",
      priority: "medium",
      category: "feature_request",
      reporterName: "Nancy Martin",
      reporterEmail: "nancy@example.com",
      assigneeId: insertedUsers[1].id,
      slaDeadline: new Date(now.getTime() - 72 * hourMs),
      createdAt: new Date(now.getTime() - 120 * hourMs),
      resolvedAt: new Date(now.getTime() - 48 * hourMs),
      closedAt: new Date(now.getTime() - 24 * hourMs),
    },
    {
      title: "Database connection timeout",
      description:
        "Application frequently loses database connection and times out.",
      status: "closed",
      priority: "urgent",
      category: "bug",
      reporterName: "Paul Thompson",
      reporterEmail: "paul@example.com",
      assigneeId: insertedUsers[3].id,
      slaDeadline: new Date(now.getTime() - 12 * hourMs),
      createdAt: new Date(now.getTime() - 20 * hourMs),
      resolvedAt: new Date(now.getTime() - 6 * hourMs),
      closedAt: new Date(now.getTime() - 3 * hourMs),
    },
    {
      title: "Custom ticket fields",
      description:
        "Request to add custom fields to tickets for better categorization.",
      status: "closed",
      priority: "low",
      category: "feature_request",
      reporterName: "Karen Garcia",
      reporterEmail: "karen@example.com",
      assigneeId: insertedUsers[2].id,
      slaDeadline: new Date(now.getTime() - 144 * hourMs),
      createdAt: new Date(now.getTime() - 192 * hourMs),
      resolvedAt: new Date(now.getTime() - 120 * hourMs),
      closedAt: new Date(now.getTime() - 96 * hourMs),
    },
    {
      title: "Cannot access admin panel",
      description:
        "Admin users are unable to access the admin panel. Getting 403 forbidden error.",
      status: "closed",
      priority: "high",
      category: "account_issue",
      reporterName: "Daniel Rodriguez",
      reporterEmail: "daniel@example.com",
      assigneeId: insertedUsers[1].id,
      slaDeadline: new Date(now.getTime() - 16 * hourMs),
      createdAt: new Date(now.getTime() - 24 * hourMs),
      resolvedAt: new Date(now.getTime() - 10 * hourMs),
      closedAt: new Date(now.getTime() - 8 * hourMs),
    },
    {
      title: "Ticket priority levels explanation",
      description:
        "Need clarification on when to use each priority level for tickets.",
      status: "closed",
      priority: "low",
      category: "question",
      reporterName: "Jennifer Lopez",
      reporterEmail: "jennifer@example.com",
      assigneeId: insertedUsers[3].id,
      slaDeadline: new Date(now.getTime() - 168 * hourMs),
      createdAt: new Date(now.getTime() - 216 * hourMs),
      resolvedAt: new Date(now.getTime() - 144 * hourMs),
      closedAt: new Date(now.getTime() - 120 * hourMs),
    },
  ]);

  console.log("Inserted 20 tickets");
  console.log("Database initialized!");
};