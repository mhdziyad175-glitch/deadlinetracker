# Security Specification for Assignment Deadline Tracker

## Data Invariants
- An assignment must be owned by the authenticated user (`userId`).
- An assignment cannot be accessed or modified by anyone other than the owner.
- Priority must be one of: `low`, `medium`, `high`.
- Status must be one of: `pending`, `completed`.
- Timestamps (`createdAt`, `updatedAt`) must be server-validated.

## The "Dirty Dozen" Payloads (Denial Expected)
1. Creating an assignment for another user's `userId`.
2. Updating an assignment with a 2MB note string (size limit).
3. Deleting someone else's assignment.
4. Listing all assignments without a `where('userId', '==', uid)` clause (secure list query).
5. Setting `priority` to "extremely-urgent" (enum bypass).
6. Changing `createdAt` on an update (immutability).
7. Creating an assignment without a title.
8. Injection: Using a script tag in the `module` name.
9. Privilege Escalation: Trying to write to the `admins` collection (if it existed).
10. Orphaned Writes: Creating an assignment with an invalid document ID format.
11. Timing attack: Sending a future `serverTimestamp`.
12. PII Leak: Reading another user's `private/profile`.
