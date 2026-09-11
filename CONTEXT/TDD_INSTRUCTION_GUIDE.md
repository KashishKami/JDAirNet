# TDD Instruction Guide
## How to Write Checklists That Produce Rock-Solid, Fully Wired Features

> **Who is this for?** Anyone — developer, product owner, or AI assistant — working on the Capital Bridge CRM. If you hand this guide to a complete beginner, they should be able to write a proper implementation checklist by the end of it.

> **Why does this exist?** Many teams discover "phantom features" — things that have green (passing) tests but are completely broken in the real, running application. The root cause is always poorly written checklists that allow lazy mocking and skipped integration. This guide makes that impossible.

---

## Part 1: The 5 Principles of a Great Checklist

### Principle 1: Always Start with "Root Cause" and End with "Verification Chain"

Every checklist must be **bookended** by these two things.

**Root Cause** answers: *Why does this problem exist, or why does this feature need to be built?*
It stops the developer (or AI) from guessing what to fix or build. Without it, they might fix the wrong thing, and the tests might still pass.

**Verification Chain** answers: *What does success look like from the user's perspective, end to end?*
It is not "tests pass." It is a human-readable sequence of events: *User does X → System does Y → User sees Z.*
If the feature doesn't achieve this exact chain, it is not done — no matter what the tests say.

> **Bad:** "Fix the customer scoping bug."
>
> **Good:**
> **Root cause:** `GET /api/customers` has no `ownedByAgentId` filter, so all brokers can see all customers. A Freight Broker in the dropdown sees customers that belong to other brokers.
> **Verification chain:** Broker A logs in → navigates to New Shipment → types customer name → dropdown shows ONLY Broker A's customers → Broker A selects a customer → form auto-fills with that customer's data → customer from Broker B does NOT appear in dropdown → ✅ Done.

---

### Principle 2: Demand a Confirmed RED State Before Any Code

This is the most important principle and the one most commonly skipped.

**The rule:** A test must be written first, run, and confirmed to be **failing (RED)** before any implementation code is written.

**Why?** If a test passes immediately after you write it (before writing the feature), it means the test is not actually testing reality. It is probably mocked incorrectly, or it is testing something that already works. A test that can't fail is worthless.

**How to write it:** Every test instruction must end with: *"Run — confirm RED."*

> **Bad:** "Write a test for due date calculation and then implement it."
>
> **Good:**
> - [ ] **RED — Unit (`shipment.service.test.ts`):**
>   - [ ] Test: Call `computeCarrierDueDate({ option: 'NET_30', invoiceReceivedDate: '2026-07-01' })` → assert result is `'2026-07-31'`.
>   - [ ] **Run — confirm RED (function doesn't exist yet).**

The phrase "Run — confirm RED" is not optional decoration. It is a gate. You do not proceed to GREEN until you have seen the test fail.

---

### Principle 3: Always Require Both a Unit Test AND an Integration Test

**Unit tests** prove that a single function or component works correctly in isolation.
**Integration tests** prove that the full system path — from HTTP request, through the router, through the service, into the database, and back — works correctly.

You need **both**. A unit test alone is never sufficient for a feature that spans the backend and frontend.

| Test Type | What It Proves | Is It Enough Alone? |
|---|---|---|
| Unit (service) test | `computeCarrierDueDate()` returns the correct date | NO. The API might not call this function correctly. |
| Integration test | `PATCH /api/shipments/[id]` updates `carrierDueDate` in the DB | NO. The frontend might not send the invoice date. |
| **Both together** | The full path from UI form → API → service → DB → UI display | YES. |

---

### Principle 4: Separate the Tiers Explicitly (DB → Backend → Frontend)

A checklist that says "update the carrier due date feature" is useless. A good checklist breaks the work into the architectural layers it touches.

The standard tiers in CB CRM are:

1. **Schema / Migration:** Any change to `prisma/schema.prisma` requires a named migration. Specify the migration name explicitly (e.g., `--name add_carrier_invoice_date`).
2. **Repository (`src/repository/`):** Does the query need to return a new field? Join a new table? Accept a new filter parameter?
3. **Service (`src/service/`):** What business logic changes? What is the calculation or rule? Are the inputs typed correctly?
4. **Business Logic Constants (`src/lib/`):** Does this feature require updating a constants file (e.g., `paymentOptions.ts`)?
5. **Controller (`src/app/api/`):** Is the new field being validated (Zod)? Serialized into the response? Are auth/permission guards correct?
6. **Frontend Type (`src/types/`):** Does the TypeScript type that mirrors the API response need a new field?
7. **Frontend Component (`src/components/`):** What exactly changes in the JSX? Which prop changes? Which conditional render?

By listing each tier, you make it impossible to skip a step. If the Repository returns a field but the Controller doesn't serialize it, the frontend will never see it.

---

### Principle 5: The "No Fake Pass" Rule

A checklist item is only checked off `[x]` when:
1. The test was seen failing (RED).
2. The implementation was written.
3. The test is now passing (GREEN).
4. The **verification chain** was manually validated in the running browser.

A test that passes because it was written incorrectly (e.g., it mocks the exact value it's testing for, or uses `expect(true).toBe(true)`) is a **Fake Pass**. Fake Passes are worse than no tests — they give false confidence.

**Signs of a Fake Pass:**
- The test passes without any implementation code written.
- The test asserts something trivially true (e.g., `expect(response).toBeDefined()`).
- The test mocks the exact return value it's asserting.
- The test uses `as any` to bypass TypeScript and tests a wrong shape.

---

## Part 2: The Standard Checklist Template

Use this template for every Work Item (`W-XXX`) in `current_state.md`:

```markdown
### Phase N — [Phase Name]

#### W-N01 — [Short Feature Name]

**Root cause:**
[One or two sentences explaining WHY this work is needed.]

**Goal:**
[What the system will be able to do after this work is done.]

**Approach:**
[High-level implementation strategy. Which layers are touched. What the key algorithm or logic is.]

---

- [ ] **RED — Integration (`src/tests/[feature].test.ts`):**
  - [ ] Test: [Exact description of the failing test — what endpoint, what input, what expected output.]
  - [ ] **Run — confirm RED.**

- [ ] **GREEN — Backend:**
  - [ ] [Schema] [If schema change needed: Describe the Prisma model change. Specify migration name.]
  - [ ] [Repository] [Describe the query change in `src/repository/[name].repository.ts`.]
  - [ ] [Service] [Describe the business logic change in `src/service/[name].service.ts`.]
  - [ ] [Controller] [Describe the API route change in `src/app/api/[path]/route.ts`. Include Zod validation and permission guard.]
  - [ ] Run integration test — **confirm GREEN.**

- [ ] **RED — Unit / Component (`src/tests/[component].test.tsx`):**
  - [ ] Test: [Exact description of the unit test — what component prop, what render, what user interaction, what assertion.]
  - [ ] **Run — confirm RED.**

- [ ] **GREEN — Frontend:**
  - [ ] [Type] Update `src/types/[name].ts` to include the new field.
  - [ ] [Component] Describe the exact JSX change in `src/components/[name].tsx`.
  - [ ] Run component test — **confirm GREEN.**

- [ ] **Verification chain:**
  - [ ] [Step 1: User action in the browser.]
  - [ ] [Step 2: Expected system behavior.]
  - [ ] [Step 3: Expected UI outcome.]
  - [ ] ✅ Done.
```

---

## Part 3: CB CRM-Specific Rules

### Rule 1: Always Check the Permission Gate First

Every API route change must include a permission check. Before writing any backend code for a feature, identify the permission key from `project_data.md` Section 5 and add it to the checklist explicitly.

**Template:**
```markdown
- [ ] [Controller] Add permission guard: check `req.session.user` has `shipments:edit-financial` 
      using `src/lib/checkPermission.ts`. Return HTTP 403 if not granted.
```

### Rule 2: Accountant Edits Must Always Include the Notes Enforcement Check

Any work item that touches the `PATCH /api/shipments/[id]` route MUST include this checklist item:

```markdown
- [ ] [Controller] If `session.user.systemRole === 'ACCOUNTANT'`, validate that 
      `req.body.notesAndRemarks` is a non-empty string. Return HTTP 400 with 
      `{ error: "Accountants must provide a reason for all shipment changes." }` if missing.
```

### Rule 3: Hierarchy Scoping Must Be Explicit in Every Shipment/Customer Query

Any work item that adds a new list/filter endpoint for shipments or customers must explicitly state how hierarchy scoping is applied.

**Template:**
```markdown
- [ ] [Service] Call `src/service/user.service.ts#getVisibleUserIds(sessionUserId)` to get 
      the list of agent IDs whose data this user is allowed to see. Pass this as an array 
      filter to the repository (`agentId IN [...]`).
```

### Rule 4: Carrier Creation Must Always Go Through the Shipment Transaction

Any work item touching carrier creation must include this note:

```markdown
- [ ] [Service] Carrier creation must be wrapped in `prisma.$transaction([...])` with 
      the parent shipment creation. Never create a carrier outside of a shipment context.
```

### Rule 5: Audit Log Entry is Mandatory on All Shipment Updates

Any work item that modifies a shipment field must create an audit log entry:

```markdown
- [ ] [Service] After computing the diff between old and new values, call 
      `shipmentAuditLog.repository.ts#createAuditLogEntries(shipmentId, diffs, reason, userId)` 
      for each changed field. Never skip this step.
```

### Rule 6: Due Dates Must Be Recomputed on All Relevant Updates

If a work item changes `invoiceSentDate`, `carrierInvoiceReceivedDate`, `factoringInvoiceReceivedDate`, or `carrierPaymentOption`, the checklist must include:

```markdown
- [ ] [Service] Call `computeAllDueDates(shipmentData)` from `src/service/shipment.service.ts` 
      and include the result in the Prisma update payload. Never set an invoice date 
      without recomputing the corresponding due date.
```

---

## Part 4: Common Mistakes to Avoid

### Mistake 1: Testing Only the Happy Path
Bad checklists test only the successful case. Always add at least one failure case per feature.

| Feature | Happy Path | Required Failure Tests |
|---|---|---|
| Accountant edits shipment | Notes are provided → 200 OK | Notes are empty → 400 Bad Request |
| Create customer | Valid data → 201 Created | Duplicate name → 409 Conflict |
| Carrier authority number | Unique type+number → 201 Created | Duplicate type+number → 409 Conflict |
| Customer suggestion dropdown | Broker sees own customers | Broker does NOT see other brokers' customers |

### Mistake 2: Mocking the Database in Integration Tests
Integration tests in this project use a **real test database** (`cb_crm_test`) running in the Docker container. Never mock Prisma in an integration test. Mocking is only acceptable in unit tests of the Service Layer (where the repository is mocked, but the service logic is real).

### Mistake 3: Forgetting to Update `current_state.md`
After completing each checklist item, immediately mark it `[x]` in `current_state.md`. If an item is in progress, mark it `[/]`. Never let the tracker fall more than one work item behind.

### Mistake 4: Skipping the Type Update
When the backend API response gains a new field, the corresponding TypeScript type in `src/types/` MUST be updated in the same work item. Do not defer this to a later phase — it causes cascading TypeScript errors.

### Mistake 5: Writing Component Tests That Mock the API Response with the Wrong Shape
If the API returns `{ shipment: { ...fields } }` but the component test mocks it as `{ ...fields }` (without the wrapper), the test will pass but the component will fail in the real browser. Always verify the mock shape matches the actual API response shape by checking the controller serialization code.

---

## Part 5: Example — A Complete, Correctly Written Work Item

```markdown
#### W-702 — Accountant Shipment Edit Enforcement (Notes Required)

**Root cause:**
The `PATCH /api/shipments/[id]` endpoint currently accepts edits from any authenticated user
without requiring a reason. Accountants can change financial amounts with no audit trail.
This violates the core business rule that every accountant change must be traceable.

**Goal:**
1. The backend rejects any Accountant-role PATCH request to `/api/shipments/[id]` where
   `notesAndRemarks` is missing or empty (HTTP 400).
2. The frontend disables the Save button until `notesAndRemarks` is filled in
   (only when the session user is an Accountant).
3. Every approved edit creates one `ShipmentAuditLog` row per changed field.

**Approach:**
Add a role check in the shipment controller. In the service layer, diff old vs. new
values and create audit log entries. In the frontend edit form, add a conditional
`required` attribute to the `notesAndRemarks` textarea based on `session.user.systemRole`.

---

- [ ] **RED — Integration (`src/tests/shipments.test.ts`):**
  - [ ] Test: POST login as Accountant → PATCH `/api/shipments/[testShipmentId]` with
        `{ customerAmount: 9999 }` (no `notesAndRemarks`) → assert HTTP 400, body
        `{ error: "Accountants must provide a reason for all shipment changes." }`.
  - [ ] Test: Same request WITH `notesAndRemarks: "Corrected invoice amount"` → assert HTTP 200,
        DB row updated, one `ShipmentAuditLog` row created with `fieldChanged: "customerAmount"`,
        `reason: "Corrected invoice amount"`, `changedByUserId: accountantId`.
  - [ ] **Run — confirm RED (no enforcement exists yet).**

- [ ] **GREEN — Backend:**
  - [ ] [Schema] No schema change needed — `ShipmentAuditLog` and `notesAndRemarks` fields
        already exist per `database_schema.md`.
  - [ ] [Repository] Create `src/repository/shipmentAuditLog.repository.ts`:
        `createAuditLogEntries(entries: AuditLogEntry[])` — batch insert multiple log rows.
  - [ ] [Service] In `src/service/shipment.service.ts`, add `updateShipment()`:
        - Accepts `(shipmentId, oldData, newData, editorUser, reason)`.
        - Validates: if `editorUser.systemRole === 'ACCOUNTANT'` and `!reason`, throws
          `AccountantReasonRequiredError`.
        - Computes diff: for each field in `newData` that differs from `oldData`, build
          an `AuditLogEntry`.
        - Calls `prisma.$transaction([prisma.shipment.update(...), auditLogRepo.createAuditLogEntries(...)])`.
        - Recomputes due dates and markup if relevant fields changed.
  - [ ] [Controller] In `src/app/api/shipments/[id]/route.ts` PATCH handler:
        - Check `shipments:edit-basic` OR `shipments:edit-financial` permission (whichever applies).
        - Parse `notesAndRemarks` from body via Zod (optional string field).
        - Call `shipmentService.updateShipment(...)`. Catch `AccountantReasonRequiredError`
          → return HTTP 400 with error message.
  - [ ] Run integration tests — **confirm GREEN.**

- [ ] **RED — Unit / Component (`src/tests/ShipmentEditForm.test.tsx`):**
  - [ ] Test: Render `<ShipmentEditForm />` with mock session `{ systemRole: 'ACCOUNTANT' }`.
        Assert that the `notesAndRemarks` textarea has the `required` attribute.
        Assert that the Save button is `disabled` when `notesAndRemarks` is empty.
        Assert that the Save button is `enabled` after typing "reason text".
  - [ ] Test: Render with mock session `{ systemRole: 'BROKER' }`.
        Assert that the Save button is NOT disabled when `notesAndRemarks` is empty.
  - [ ] **Run — confirm RED.**

- [ ] **GREEN — Frontend:**
  - [ ] [Type] No new type fields needed (the types already include `notesAndRemarks`).
  - [ ] [Component] In `src/components/shipments/ShipmentEditForm.tsx`:
        - Read `session.user.systemRole` from `useSession()`.
        - If `systemRole === 'ACCOUNTANT'`: add `required` to the `notesAndRemarks` textarea,
          apply a highlight border (`border-amber-400`), and add helper text:
          "As an accountant, a reason is required for all changes."
        - Disable the Submit button with `disabled={isAccountant && !notesAndRemarksValue}`.
  - [ ] Run component test — **confirm GREEN.**

- [ ] **Verification chain:**
  - [ ] Log in as Accountant (`accountant@capitalbridge.com`).
  - [ ] Navigate to a shipment detail page → click Edit.
  - [ ] Observe: "Notes & Remarks" field is highlighted in amber with required label.
  - [ ] Change `customerAmount` → attempt to click Save with empty Notes → Save button is
        disabled.
  - [ ] Type a reason in Notes → Save button becomes enabled → click Save.
  - [ ] Observe: Shipment is updated. Navigate to the Audit Log tab on the shipment detail
        page → confirm one new entry appears with `customerAmount`, old value, new value,
        the typed reason, and the accountant's name.
  - [ ] Repeat: Log in as Broker → edit a shipment → confirm Save is NOT blocked when
        Notes is empty.
  - [ ] ✅ Done.
```

---

## Summary: The Checklist Quality Checklist

Before submitting any work item checklist for review, verify:

- [ ] Root cause is written (explains WHY, not just WHAT).
- [ ] At least one RED integration test is specified (with exact endpoint, input, and expected output).
- [ ] Each backend tier is listed separately (Schema/Repo/Service/Controller).
- [ ] Permission key is explicitly checked in the Controller tier.
- [ ] At least one RED component/unit test is specified.
- [ ] Frontend type update is included if the API response shape changes.
- [ ] Verification chain describes the full user flow in the browser.
- [ ] At least one failure/edge case test is specified.
- [ ] For any shipment edit: Accountant enforcement check is included.
- [ ] For any shipment edit: Audit log creation is included.
- [ ] For any customer query: Hierarchy scoping note is included.
- [ ] For any invoice date change: Due date recomputation is included.
