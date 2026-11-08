import { boolean, date, index, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core/index";

export const userRoleEnum = pgEnum('user_role', [
    'admin',
    'director',
    'manager',
    'supervisor',
    'promoter',
])

export const accountStatusEnum = pgEnum('account_status', [
    'active',
    'inactive',
    'archived'
])

export const notificationTypeEnum = pgEnum('notification_type', [
    'urgent',
    'attention',
    'update',
    'system'
])

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 150 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull().default('promoter'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [index('users_name_idx').on(table.name)])

export const accounts = pgTable('accounts', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 200 }).notNull(),
    systemId: uuid('system_id').notNull().references(() => systems.id, { onDelete: 'restrict' }),
    bankId: uuid('bank_id').notNull().references(() => banks.id, { onDelete: 'restrict' }),
    city: varchar('city', { length: 120 }).notNull(),
    state: varchar('state', { length: 2 }).notNull(),
    categoryId: uuid('category_id').notNull().references(() => categories.id),
    responsibleId: uuid('responsible_id').references(() => users.id, { onDelete: 'restrict' }),
    dueDate: date('due_date'),
    status: accountStatusEnum('status').notNull().default('active'),
    notes: text('notes').notNull().default(''),
    websiteUrl: text('website_url').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    index("accounts_status_idx").on(table.status),
    index("accounts_due_date_idx").on(table.dueDate),
    index("accounts_responsible_idx").on(table.responsibleId),
    index("accounts_name_idx").on(table.name),
])

export const accountCredentials = pgTable('account_credentials', {
    id: uuid('id').defaultRandom().primaryKey(),
    accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
    username: varchar('username', { length: 255 }).notNull(),
    passwordEncrypted: text('password_encrypted').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    index('account_credentials_account_idx').on(table.accountId)
])

export const notifications = pgTable("notifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    accountId: uuid("account_id").references(() => accounts.id, { onDelete: "set null" }),
    title: varchar("title", { length: 255 }).notNull(),
    detail: text("detail").notNull().default(""),
    type: notificationTypeEnum("type").notNull().default("system"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    readAt: timestamp("read_at", { withTimezone: true, }),
},
    (table) => [
        index("notifications_user_created_idx").on(
            table.userId,
            table.createdAt,
        ),
        index("notifications_user_unread_idx").on(
            table.userId,
            table.isRead,
        ),
        index("notifications_account_idx").on(table.accountId),
    ],
);

export const activities = pgTable("activities", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    accountId: uuid("account_id").references(() => accounts.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
},
    (table) => [
        index("activities_created_idx").on(table.createdAt),
        index("activities_account_idx").on(table.accountId),
        index("activities_user_idx").on(table.userId),
    ],
);

export const banks = pgTable('banks', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 150 }).notNull().unique()
})

export const systems = pgTable('systems', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 150 }).notNull().unique()
})

export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 150 }).notNull().unique()
})