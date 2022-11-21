# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Assumptions

- Facilities table:

  ```
  {
  id: uint, // Facility's id
  owner: uint, // Company id owning this Facility
  started_at: date, // Started date
  ended_at: date, // Ended date, possibly null
  ...
  }
  ```

- Agents table:
  ```
  {
  id: uint, // Agent's id
  name: string, // Agent's name
  metadata: object, // Agent's metadata
  ...
  }
  ```
- Shifts table:
  ```
  {
  id: uint, // Shift's id
  facility_id: uint, // Facility's id
  agent_id: uint, // Agent's id
  started_at: date, // Started time
  ended_at: date, // Ended time
  ...
  }
  ```

### Tickets

**Ticket 1:**
**Description:**
Add `CustomAgentIds` table with the fields of:

```
{
  id: uint, // CustomAgentIds' id
  facility_id: uint, // Facility's id
  agent_id: uint, // Agent's id
  custom_id: string, // Custom id
}
```

Write any migration script to safely create table and generate the initiatial data containing all the partnership between facilities and agents saved in current database.
For the `custom_id` field, set the same value with `agent_id` by default for now.
The migration script can be written in SQL, Node.js or other preferred way, but needs to be safe, because it will be used on the production database.

**Acceptance Criteria:** - Use the migration script to generate initial data on staging database.

**Weight:** \* \* \* \* \_

**Dependencies:**
No dependencies

**Ticket 2:**
**Description:**
Implement `getCustomIds` function on the `CustomAgentIds` table.

Function signature would look like this:

```ts
function getCustomIds(facilityId: number, agentIds: number[]): object;
```

This function should return a mapping of `agent_id` => `custom_id` for given `facility_id` and `agent_ids`. If that `agent_id` is not found for the given `facility_id`,
set the value of that `agent_id` as `undefined`.

**Acceptance Criteria:** - Write unit tests to get custom ids with 3 different facilities and 20 different agents.

**Weight:** \* \* \_ \_ \_

**Dependencies:**
`Ticket 1`

**Ticket 3:**
**Description:**
Implement `getShiftsByFacility` function on the `Shifts` table.

Function signature would look like this:

```ts
function getShiftsByFacility(facilityId: number): ShiftsByFacility[];
```

`ShiftsByFacility` should contain the agent's metadata.
The function `getShiftsByFacility` is called with the Facility's id,
returning all Shifts worked that quarter, including some metadata about
the Agent assigned to each.

**Acceptance Criteria:** - Write unit tests to get shifts by facility with 3 different facilities.

**Weight:** \* \* \_ \_ \_

**Dependencies:**
No dependencies

**Ticket 4:**
**Description:**
Implement a module to output any data to form of PDF. Find any efficient
way to use a template file and fill the placeholders with real data.

**Acceptance Criteria:** - Should be able to write table. - Should be able to upload to stream. (e.g. file stream or cloud stream)

**Weight:** \* \* \* \_ \_

**Dependencies**
No dependencies

**Ticket 5:**
**Description:**
Implement `generateReport` function on the database aggregator layer.

Function signature would look like this:

```ts
function generateReport(shifts: Shift[]): ShiftsReportByFacility[];
```

The function `generateReport` is then called with the list of Shifts.
It converts them into a PDF which can be submitted by the Facility
for compliance.
Use the PDF export module. And export to several PDF files separated by facilities.
Because those files should reported to each facilities' owners.

**Acceptance Criteria:** - Write test scripts and try to get generate report for 300 different shifts.

**Weight:** \* \* - \_ \_

**Dependencies**
`Ticket 4`
