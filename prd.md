Bilkul. Main isay **implementation-first PRD** bana raha hoon — yani har phase independently build/test ho sake aur tum ek phase complete karke next par jao.

Stack fixed:

* **Frontend:** React
* **Backend:** Node.js + Express
* **Database:** PostgreSQL
* **ORM:** Prisma
* **AI:** LLM API for automated replies
* **Channels:** WhatsApp + Email
* **Architecture:** REST API + webhook-based integrations

# CRM — Detailed Product Requirements Document

## 0. Product Vision

Build a multi-channel CRM for a wholesale business where:

> **Customer WhatsApp/email par contact kare → CRM automatically customer/inquiry identify/create kare → conversation save ho → AI reply generate kare → salesperson CRM se conversation monitor/control kare → lead pipeline mein move ho → follow-ups/tasks manage hon → complete customer history available ho.**

The CRM should act as the **central source of truth** for customer communication.

---

# Phase 1 — Project Foundation

### Goal

Application ka basic skeleton ready karna.

### 1.1 Repository structure

Recommended:

```text
crm/
│
├── client/
│   └── React + Vite
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.ts
│   │
│   └── prisma/
│
└── README.md
```

### 1.2 Backend setup

Implement:

* Express
* TypeScript
* Prisma
* PostgreSQL connection
* dotenv
* CORS
* error handling
* request validation
* logging

### 1.3 Frontend setup

Implement:

* React
* TypeScript
* React Router
* API client
* basic layout
* sidebar
* top navbar

### 1.4 Environment variables

```env
DATABASE_URL=
JWT_SECRET=

AI_API_KEY=

WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=

EMAIL_API_KEY=
```

### Phase completion

You should be able to:

```text
React → Express → PostgreSQL
```

successfully communicate.

---

# Phase 2 — Authentication & Users

## Goal

CRM mein salespeople/admin login kar saken.

### Features

* Login
* Logout
* Password hashing
* JWT/session authentication
* Current user
* Protected routes

### User roles

Initially:

```text
ADMIN
SALES_AGENT
```

### Admin

Can:

* manage users
* see all customers
* see all leads
* manage pipeline
* manage automation
* see reports

### Sales Agent

Can:

* see assigned leads
* communicate with customers
* update pipeline
* create tasks
* add notes

### API

```text
POST /auth/login
POST /auth/logout
GET  /auth/me
```

### DB

```text
User
```

Fields:

```text
id
name
email
passwordHash
role
createdAt
updatedAt
```

---

# Phase 3 — Customer Management

## Goal

CRM ka core customer database.

## Customer entity

Example:

```text
Ahmed Traders

Phone: +92...
Email: ahmed@example.com
Company: Ahmed Traders
Source: WhatsApp
Assigned To: Ali
```

### Customer fields

```text
id
name
companyName
email
phone
address
city
source
assignedUserId
createdAt
updatedAt
```

### Customer source

```text
MANUAL
WHATSAPP
EMAIL
WEBSITE
OTHER
```

### UI

Customer list:

```text
Customers

[ Search customer ]

Name          Company       Phone        Source
Ahmed         Ahmed Traders +92...       WhatsApp
Ali            Ali Store     +92...       Email
```

### Customer detail page

```text
Ahmed Traders

Contact Information
-------------------
Name
Phone
Email
Company
Address

Assigned Agent
---------------

Conversations
-------------

Leads
-----

Tasks
-----

Notes
-----
```

### APIs

```text
GET    /customers
GET    /customers/:id
POST   /customers
PATCH  /customers/:id
DELETE /customers/:id
```

### Important

Phone/email par duplicate customer create nahi hona chahiye.

---

# Phase 4 — Lead & Inquiry Management

## Goal

Customer aur sales opportunity ko separate rakhna.

### Lead

Example:

```text
Ahmed Traders
Requirement: 100 cartons
Value: Rs. 500,000
Status: New
```

### Lead fields

```text
id
customerId
title
description
value
status
pipelineStageId
assignedUserId
source
createdAt
updatedAt
```

### Lead statuses

```text
OPEN
WON
LOST
```

### Important distinction

```text
Customer
    ↓
Lead / Opportunity
    ↓
Pipeline
```

Ek customer ke multiple leads ho sakte hain.

---

# Phase 5 — Sales Pipeline

## Goal

Salesperson ko lead ki progress visually manage karni hai.

### Default stages

```text
New Lead
   ↓
Contacted
   ↓
Qualified
   ↓
Quotation Sent
   ↓
Negotiation
   ↓
Won
```

Lost ko separate outcome rakho.

### Kanban UI

```text
┌─────────────┬─────────────┬──────────────┐
│ New         │ Contacted   │ Qualified    │
├─────────────┼─────────────┼──────────────┤
│ Ahmed       │ Ali Store   │ XYZ Traders  │
│ Rs 50k      │ Rs 80k      │ Rs 200k      │
│             │             │              │
└─────────────┴─────────────┴──────────────┘
```

### Features

* Create stage
* Rename stage
* Reorder stage
* Move lead
* Assign lead
* Mark won/lost
* Drag/drop

### APIs

```text
GET  /pipeline/stages
POST /pipeline/stages

PATCH /leads/:id/stage
PATCH /leads/:id/assign
PATCH /leads/:id/status
```

---

# Phase 6 — Conversations Architecture

**Ye bohat important phase hai.**

Ab customer communication ka proper model banao.

## Conversation

A conversation represents one communication thread.

Example:

```text
Ahmed Traders
    │
    └── WhatsApp Conversation
            │
            ├── Message
            ├── Message
            ├── Message
            └── Message
```

### Conversation fields

```text
id
customerId
channel
status
subject
lastMessageAt
createdAt
updatedAt
```

### Channels

```text
WHATSAPP
EMAIL
```

### Conversation status

```text
OPEN
CLOSED
```

---

# Phase 7 — Messages

## Goal

Every incoming/outgoing message permanently store karna.

### Message

```text
id
conversationId
senderType
senderId
content
messageType
direction
status
externalMessageId
metadata
createdAt
```

### Sender type

```text
CUSTOMER
AGENT
AI
SYSTEM
```

### Direction

```text
INBOUND
OUTBOUND
```

### Message type

```text
TEXT
IMAGE
DOCUMENT
AUDIO
VIDEO
```

Initially **TEXT only** implement kar sakte ho.

### Status

```text
RECEIVED
SENDING
SENT
DELIVERED
READ
FAILED
```

---

# Phase 8 — CRM Unified Inbox

## Goal

WhatsApp + Email conversations ek interface mein.

UI:

```text
┌─────────────────────────────────────────────────┐
│ Inbox                                           │
├───────────────┬─────────────────────────────────┤
│ Conversations │ Ahmed Traders                   │
│               │                                 │
│ Ahmed Traders │ Customer:                      │
│ Ali Store     │ Assalam o Alaikum              │
│ XYZ Traders   │                                 │
│               │ You:                            │
│               │ Wa Alaikum Assalam              │
│               │                                 │
│               │ Customer:                       │
│               │ 100 cartons chahiye             │
│               │                                 │
│               │ [Type message...] [Send]        │
└───────────────┴─────────────────────────────────┘
```

### Inbox filters

```text
All
WhatsApp
Email
Unread
Assigned to me
AI handled
Needs human
```

### Important

Agent CRM ke andar se reply karega.

---

# Phase 9 — WhatsApp Connector

## Goal

Actual WhatsApp messages ko CRM mein automatically lana aur CRM se WhatsApp par bhejna.

Architecture:

```text
Customer WhatsApp
       ↓
WhatsApp Business API
       ↓
Webhook
       ↓
Express Backend
       ↓
Message Processing
       ↓
PostgreSQL
       ↓
CRM Inbox
```

## Incoming webhook

WhatsApp message:

```text
"Mujhe 100 cartons chahiye"
```

Backend:

1. webhook receive
2. verify webhook
3. identify phone number
4. find customer
5. create customer if not found
6. find/create conversation
7. save message
8. determine whether lead should be created
9. trigger AI automation

---

# Phase 10 — WhatsApp Outgoing Messages

CRM mein:

```text
[ Wa Alaikum Assalam! 100 cartons available hain. ]
                                      [Send]
```

Flow:

```text
CRM
 ↓
POST /messages
 ↓
Backend
 ↓
WhatsApp API
 ↓
Customer
```

Database mein outgoing message bhi save hoga.

```text
senderType = AGENT
direction = OUTBOUND
```

---

# Phase 11 — Email Connector

Same architecture.

```text
Customer Email
      ↓
Email Provider
      ↓
Webhook
      ↓
Backend
      ↓
Customer identification
      ↓
Conversation
      ↓
Message
      ↓
CRM Inbox
```

### Email conversation

Email ke liye:

```text
subject
from
to
cc
message body
attachments
externalMessageId
```

Initially attachments skip karke text-only email implement kar sakte ho.

---

# Phase 12 — Automatic Customer Creation

Ab tumhara initial requirement properly solve hoga.

### WhatsApp customer

New phone:

```text
+923001234567
```

Database mein nahi mila.

System:

```text
CREATE CUSTOMER
       ↓
CREATE CONVERSATION
       ↓
SAVE MESSAGE
       ↓
CREATE LEAD
```

### Existing customer

Phone already exists:

```text
+923001234567
```

Then:

```text
Existing Customer
       ↓
Existing/New Conversation
       ↓
Save Message
```

**Duplicate customer nahi banega.**

---

# Phase 13 — Automatic Lead Creation

Har message ko lead banana zaroori nahi.

For example:

> "Hello"

Sirf conversation create ho.

Lekin:

> "Mujhe 100 cartons chahiye."

System isko potential sales inquiry samajh sakta hai.

Initially simple rules:

```text
If new customer contacts
        ↓
Create lead
```

Later AI classification:

```text
Message
 ↓
AI
 ↓
Intent
 ├── SALES_INQUIRY
 ├── SUPPORT
 ├── GENERAL
 ├── COMPLAINT
 └── ORDER
```

Agar:

```text
SALES_INQUIRY
```

then create/update lead.

---

# Phase 14 — AI Automation Engine

**Yahan AI properly introduce karo.**

AI ko direct WhatsApp se connect mat karo.

Better:

```text
Incoming Message
       ↓
CRM Backend
       ↓
Save Message
       ↓
Automation Engine
       ↓
AI Service
       ↓
Generate Reply
       ↓
Safety/Business Rules
       ↓
Send Reply
```

---

# Phase 15 — AI Context

AI ko sirf latest message mat bhejna.

Context do:

```text
Customer information
+
Recent conversation
+
Business information
+
Products/pricing if available
+
Current lead status
```

Example:

```text
Customer:
Ahmed Traders

Current lead:
100 cartons

Recent messages:
Customer: I need 100 cartons.
Agent: Sure, let me check.
Customer: What's your best price?
```

AI ko ye context milega.

---

# Phase 16 — AI Reply Modes

Do modes rakho.

### Mode 1 — Draft

AI reply generate kare:

```text
Suggested reply:

"Sure Ahmed, I'll prepare the best wholesale
quotation for 100 cartons."
```

Agent click:

**Send**

### Mode 2 — Automatic

AI directly reply kare:

```text
Customer
   ↓
AI
   ↓
Auto reply
```

---

# Phase 17 — Human Handoff

Ye **must-have** feature hai.

AI har cheez handle nahi karega.

Example customer:

> "Mujhe manager se baat karni hai."

AI:

```text
Intent = HUMAN_REQUEST
```

Then:

```text
AI AUTO REPLY OFF
        ↓
Assign to salesperson
        ↓
Notify agent
```

CRM mein:

```text
⚠ Needs Human Attention
```

---

# Phase 18 — AI Automation Rules

Admin rules configure kar sake:

```text
Rule:
When new WhatsApp message arrives
→ Generate AI reply
→ Send automatically
```

Another:

```text
When customer asks for quotation
→ Create lead
→ Notify salesperson
```

Another:

```text
When customer doesn't respond for 2 days
→ Create follow-up task
```

---

# Phase 19 — AI Business Knowledge

AI ko business ke bare mein information chahiye.

Initially simple:

```text
Business Name
Business Description
Working Hours
Contact Information
Return Policy
Delivery Policy
General FAQs
```

Later:

```text
Products
Prices
Stock
Discount rules
```

**Important:** pricing/order information ko AI ke hallucination par depend mat karna. Structured database se values retrieve karwao.

---

# Phase 20 — Tasks & Follow-ups

Customer:

> "I'll confirm tomorrow."

CRM:

```text
Follow-up task

Customer: Ahmed Traders
Due: Tomorrow
Assigned: Ali
Related Lead: 100 Cartons
```

### Task fields

```text
id
title
description
dueDate
priority
status
assignedUserId
customerId
leadId
```

Status:

```text
TODO
IN_PROGRESS
COMPLETED
CANCELLED
```

---

# Phase 21 — Notes

Agent customer profile par note add kar sake:

```text
"Ahmed prefers monthly bulk orders."
```

Notes internal honge.

Customer ko nahi dikhne chahiye.

---

# Phase 22 — Customer 360 View

Ab customer detail page powerful banega:

```text
Ahmed Traders
────────────────────────

Contact
Phone
Email
Company

────────────────────────

Current Leads

100 Cartons
Stage: Negotiation
Value: Rs. 500,000

────────────────────────

Conversations

WhatsApp
Email

────────────────────────

Recent Activity

WhatsApp message
Quotation sent
Follow-up created

────────────────────────

Tasks

Follow-up tomorrow

────────────────────────

Notes

Prefers bulk orders
```

---

# Phase 23 — Notifications

Notifications:

```text
🔔 New lead
🔔 New WhatsApp message
🔔 New email
🔔 AI needs human intervention
🔔 Follow-up due
🔔 Message failed
```

Initially in-app notifications enough.

---

# Phase 24 — Dashboard

Admin dashboard:

```text
Total Customers
Total Leads
New Leads
Open Deals
Won Deals
Lost Deals
Revenue
Unread Messages
Pending Follow-ups
```

Charts:

```text
Leads by Source

WhatsApp █████████
Email    █████
Manual   ███
```

Pipeline:

```text
New              42
Contacted        31
Qualified        19
Quotation        12
Negotiation       7
Won               5
```

---

# Phase 25 — Search & Filters

Global search:

```text
Ahmed
```

Should find:

* customer
* phone
* email
* lead
* conversation
* messages

Filters:

```text
Source
Channel
Pipeline Stage
Assigned Agent
Date
Lead Status
```

---

# Phase 26 — Audit Log

Important business actions record karo:

```text
Ali changed lead stage
Ahmed was assigned to Sara
AI sent a reply
Quotation status changed
Lead marked Won
```

DB:

```text
AuditLog
```

Fields:

```text
id
userId
action
entityType
entityId
metadata
createdAt
```

---

# Phase 27 — Error Handling & Reliability

Especially connectors ke liye.

Suppose WhatsApp API fail:

```text
CRM
 ↓
WhatsApp API
 ↓
FAILED
```

Message ko:

```text
status = FAILED
```

rakhna.

UI:

```text
⚠ Message failed
[Retry]
```

Duplicate webhook aaye to duplicate message create nahi hona chahiye.

Isliye:

```text
externalMessageId
```

unique rakho.

---

# Phase 28 — Security

Implement:

* password hashing
* JWT/session security
* role-based authorization
* API validation
* rate limiting
* input sanitization
* webhook verification
* secrets only in environment variables
* database constraints
* audit logs

AI API keys frontend mein **kabhi nahi**.

---

# Phase 29 — Testing

Har phase ke saath testing.

### Unit tests

Test:

```text
Customer creation
Lead creation
Pipeline movement
AI classification
```

### Integration tests

```text
Webhook
 ↓
Customer
 ↓
Conversation
 ↓
Message
 ↓
Lead
```

### End-to-end test

Actual flow:

```text
WhatsApp message
 ↓
Webhook
 ↓
CRM
 ↓
AI
 ↓
Reply
 ↓
Customer receives reply
```

---

# Phase 30 — Production Deployment

Suggested:

```text
Frontend
React
 ↓
Vercel / similar

Backend
Node + Express
 ↓
Cloud server

Database
PostgreSQL
 ↓
Managed PostgreSQL

Redis
 ↓
Background jobs
```

AI and connector jobs ke liye eventually queue use karna better hoga:

```text
Message received
      ↓
Save immediately
      ↓
Queue job
      ↓
AI processing
      ↓
Send reply
```

Isse webhook request unnecessarily slow nahi hogi.

---

# Recommended Prisma DB Architecture

High-level schema:

```text
User
 │
 ├──────────────┐
 ↓              ↓
Customer       Lead
 │              │
 ├── Conversation
 │       │
 │       └── Message
 │
 ├── Note
 ├── Task
 └── Lead

Lead
 ↓
PipelineStage

Conversation
 ↓
Channel

Automation
 ↓
AutomationRule

AuditLog
```

### Core models

```text
User
Customer
Lead
PipelineStage
Conversation
Message
Task
Note
AutomationRule
AuditLog
```

### Later models

```text
Product
Order
OrderItem
Attachment
EmailThread
WhatsAppAccount
AIUsageLog
Notification
```

---

# The Most Important DB Relationships

```text
User 1 ──── * Lead

Customer 1 ──── * Lead

Customer 1 ──── * Conversation

Conversation 1 ──── * Message

Lead * ──── 1 PipelineStage

Customer 1 ──── * Task

Customer 1 ──── * Note

User 1 ──── * Task
```

---

# Implementation Order

**Is order ko follow karna. Randomly features start mat karna.**

| Phase | Module                 | Priority |
| ----- | ---------------------- | -------- |
| 1     | Project setup          | 🔴       |
| 2     | Auth + Users           | 🔴       |
| 3     | Customers              | 🔴       |
| 4     | Leads                  | 🔴       |
| 5     | Pipeline               | 🔴       |
| 6     | Conversations          | 🔴       |
| 7     | Messages               | 🔴       |
| 8     | Unified Inbox          | 🔴       |
| 9     | WhatsApp Integration   | 🔴       |
| 10    | WhatsApp Sending       | 🔴       |
| 11    | Email Integration      | 🔴       |
| 12    | Auto Customer Creation | 🔴       |
| 13    | Auto Lead Creation     | 🟠       |
| 14    | AI Engine              | 🔴       |
| 15    | AI Context             | 🔴       |
| 16    | AI Draft/Auto Reply    | 🔴       |
| 17    | Human Handoff          | 🔴       |
| 18    | Automation Rules       | 🟠       |
| 19    | Tasks/Follow-ups       | 🟠       |
| 20    | Notes                  | 🟡       |
| 21    | Customer 360           | 🟠       |
| 22    | Notifications          | 🟠       |
| 23    | Dashboard              | 🟡       |
| 24    | Search/Filters         | 🟡       |
| 25    | Audit Logs             | 🟡       |
| 26    | Testing                | 🔴       |
| 27    | Deployment             | 🔴       |

---

# MVP ko aur smart tareeqe se divide karo

Agar tum akelay develop kar rahe ho, **sab kuch ek saath mat banana.**

### MVP 1 — CRM Core

```text
Auth
+
Customers
+
Leads
+
Pipeline
```

Result:

> Basic CRM usable hai.

### MVP 2 — Communication

```text
Conversations
+
Messages
+
Unified Inbox
+
WhatsApp
```

Result:

> WhatsApp se aane wali inquiries CRM mein appear hoti hain.

### MVP 3 — Email

```text
Email connector
+
Email conversations
+
Reply from CRM
```

Result:

> WhatsApp + Email ek inbox mein.

### MVP 4 — AI

```text
AI classification
+
AI reply
+
Auto reply
+
Human handoff
```

Result:

> CRM automatically customers ko respond kar sakta hai.

### MVP 5 — Productivity

```text
Tasks
+
Follow-ups
+
Notifications
+
Customer 360
```

### MVP 6 — Management

```text
Dashboard
+
Reports
+
Audit logs
+
Advanced automation
```

---

# Ek final real-life scenario

Ab dekho tumhara **complete product** actually kaise behave karega:

```text
Ahmed WhatsApp par message karta hai
          ↓
"Mujhe 100 cartons chahiye"
          ↓
WhatsApp webhook
          ↓
Backend
          ↓
Phone check
          ↓
Customer doesn't exist
          ↓
CREATE CUSTOMER
          ↓
CREATE CONVERSATION
          ↓
SAVE MESSAGE
          ↓
CREATE LEAD
          ↓
Pipeline = NEW
          ↓
AI analyzes message
          ↓
Intent = SALES_INQUIRY
          ↓
AI generates response
          ↓
"Sure, 100 cartons ke liye..."
          ↓
WhatsApp API
          ↓
Ahmed receives reply
          ↓
Message CRM DB mein save
          ↓
Lead appears in Inbox/Pipeline
          ↓
Salesperson opens Ahmed
          ↓
Sees complete conversation
          ↓
Moves lead → QUALIFIED
          ↓
Sends quotation
          ↓
Lead → QUOTATION SENT
          ↓
Creates follow-up
          ↓
Ahmed confirms order
          ↓
Lead → WON
```

**Ye tumhare CRM ka core "happy path" hai.** Is flow ko pehle perfectly implement karna — phir edge cases, analytics aur fancy features add karna.

### Ek architectural recommendation

**Prisma + PostgreSQL bilkul sahi choice hai.** Lekin WhatsApp/email/AI ko directly controllers ke andar mat bhar dena. Services separate rakho:

```text
controllers/
    message.controller.ts

services/
    customer.service.ts
    lead.service.ts
    conversation.service.ts
    whatsapp.service.ts
    email.service.ts
    ai.service.ts
    automation.service.ts
```

Phir:

```text
WhatsAppService
EmailService
AIService
```

replace/extend karna future mein easy rahega.

**Aur sabse important:** webhook → DB save → background processing → AI → outbound message ka pattern rakho. AI/API slow ya temporarily down ho to incoming customer message lose nahi hona chahiye.
