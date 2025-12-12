## The Problem

I need your help as an expert DevOps practitioner and as a experienced software organization planner.

I have two groups of product teams. Each group has three or four development teams of about 5 to 8 people.

We have one group called Spirit that consist of senior developers across both groups. They meet to discuss the priorities a high level for both groups, but they don't do any sprint planning because each of those individuals already belong to scrum teams in the product groups. So it's more for coordination and sharing of ideas and thoughts on what to do for these internal libraries and tools.

We have about 10 internal libraries and tools that we have created and barely maintain. New features and improvements are deprioritized in favor of updating dependencies and keeping the code API up to date. 

New features and improvements to these products happen maybe once or twice a year.

Even the maintenance can lag behind for over a year before we rush through several maintenance tickets. A big reason for this is because we have to Wait for the product teams to have availability / bandwidth to do work on the internal libraries and tools.

I am trying to think of different ways to structure the organization so that we can better say up to date on the maintenance needs and provide continuous improvements based off our internal developer needs. 

I could think of two options, but I need your help and figure out a third option. 

The two options I have, so far, is

1) Keep things as they are structurally, with maybe a few adjustments.

2) change the Spirit group, into an actual scrum dev team. Take the spirit group outside of the product groups so it is parallel to them in the org chart. That way the spirit group has its own developer resources independent of the product teams, in order to do the work on the internal libraries and tools.

Please ask me any questions that would help you and give me a few options for what the third choice could be.


## Suggestions for Structuring Your Organization's Product Teams

To improve the efficiency and responsiveness of your internal libraries and tools maintenance, here are three options.

These three options present different paths forward, allowing for both structural changes and enhanced collaboration. They can help address the ongoing challenges of maintaining and improving internal tools and libraries while ensuring that teams remain engaged and responsible for their upkeep.

---

### Option 1: Maintain Current Structure with Adjustments

This option involves keeping the existing structure but making minor adjustments to enhance coordination and responsiveness. Implement the following adjustments:

- **Regular Sync-Up Meetings:** Introduce bi-weekly or monthly sync-ups specifically focused on the internal libraries and tools. This can help track maintenance needs, prioritize improvements, and distribute responsibilities more effectively across the product teams.
- **Dedicated Maintenance Slots:** Encourage product teams to allocate a certain percentage of their time (e.g., 10-15%) exclusively for maintenance work on internal tools. This can create a culture where maintenance is seen as part of their responsibilities.
- **Use of Kanban Boards:** Implement a Kanban board for tracking maintenance tickets and feature requests. This can provide visibility into ongoing efforts and ensure that team members are aware of priorities.

---

### Option 2: Transform Spirit Group into a Scrum Team

By converting the Spirit group into an independent scrum team focused on the internal libraries and tools, you can achieve several benefits:

- **Focused Resources:** This independent team can prioritize maintenance and feature development without being heavily reliant on product teams' availability.
- **Continuous Improvement:** With established sprint cycles, the team can regularly plan, execute, and review improvements and maintenance efforts.
- **Improved Velocity:** This structure can lead to more frequent updates and enhancements, addressing backlog issues more proactively.

---


Here are additional alternatives for structuring your organization to enhance maintenance and development of your internal libraries and tools. Each option aims at promoting collaboration and accountability, while addressing your specific needs.

These alternative paths aim to cultivate a more proactive and collaborative culture regarding the maintenance and improvement of internal tools, driving better outcomes across your organization.

---

### 1. **Implement a Center of Excellence (CoE)**

Create a Center of Excellence for internal tools and libraries that serves as a central body focusing on best practices, governance, and knowledge sharing.

- **Knowledge Sharing and Training:** The CoE can provide ongoing training to all teams on best practices for using and maintaining internal tools.
- **Standardized Processes:** Develop standardized procedures for maintenance and feature requests, ensuring that work is not only reactive but also proactive.
- **Performance Metrics:** Implement key performance indicators (KPIs) to gauge tool usage and identify areas needing improvement, fostering accountability.

---

### 2. **Establish an Internal Platform Team**

Create a dedicated Internal Platform Team that supports all product teams by simplifying access to shared libraries and tools. This team should focus on developer experience and effective internal tool management.

- **Self-Service Capabilities:** Develop internal self-service capabilities so that developers can access and utilize tools without requiring dedicated time from product teams.
- **Feedback Mechanism:** Implement a structured feedback system to gather insights on the usage and required features of internal tools, ensuring continuous improvement.

---

### 3. **Utilize Timeboxed Sprints for Maintenance Tasks**

Introduce a dedicated sprint cycle specifically for maintenance and improvement of internal libraries and tools, separate from product development cycles.

- **Scheduled Maintenance Sprints:** Allow teams to participate in a scheduled maintenance sprint every quarter. This can prevent the backlog from accumulating and ensure timely updates.
- **Cross-Team Participation:** Encourage participation from multiple product teams, fostering shared responsibility and enhancing collaboration on improvement tasks.

---

### 4. **Adopt a Rotation Model for Responsibility**

Implement a rotation model, where different teams take turns being responsible for the maintenance and improvement of specific internal libraries or tools.

- **Shared Ownership:** This model promotes shared ownership and accountability. By rotating responsibilities, all teams will understand the internal tools more deeply.
- **Knowledge Transfer:** Engage in regular knowledge transfer sessions after each rotation, ensuring that insights and lessons learned are documented and shared.

---

### 5. **Create a Developer Advocacy Program**

Establish a developer advocacy program that focuses on promoting best practices in tool usage and gathering feedback directly from developers using the internal libraries.

- **Internal Advocates:** Assign advocates within each product team to champion the needs of developers and facilitate communication with those maintaining the internal tools.
- **Regular Engagement:** Host hackathons or workshops where developers can collaborate and work on ideas for improvements, furthering engagement and innovation.

---

## References

- [Create the ideal DevOps team structure](https://about.gitlab.com/topics/devops/build-a-devops-team/)
- [Architecture strategies for fostering DevOps culture](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/devops-culture)
- [How to scale DevOps with an internal platform team?](https://humanitec.com/blog/how-to-scale-devops-with-an-internal-platform-team)
- [The Four Key Metrics of DevOps](https://humanitec.com/blog/devops-key-metrics)
- [DevOps team structure: types, roles & responsibilities](https://www.atlassian.com/devops/frameworks/team-structure)
- [Spotify Engineering: Guilds and Tribes Model](https://engineering.atspotify.com/2014/03/spotify-engineering-culture-part-1/)
- [ThoughtWorks: Platform Teams](https://www.thoughtworks.com/insights/blog/platform-teams-are-not-just-devops)
- [Martin Fowler: Center of Excellence](https://martinfowler.com/bliki/CenterOfExcellence.html)
- [Atlassian: Developer Advocacy](https://www.atlassian.com/blog/technology/developer-advocacy)
- [Scrum.org: Scrum Team Structure](https://www.scrum.org/resources/what-is-a-scrum-team)
- [Google: SRE Rotation Model](https://sre.google/sre-book/on-call/)
- [Kanban Board Best Practices](https://kanbanize.com/kanban-resources/getting-started/what-is-kanban-board)
- [Agile Alliance: Timeboxed Sprints](https://www.agilealliance.org/glossary/timebox/)
- [Platform Engineering: Internal Developer Platforms](https://platformengineering.org/blog/internal-developer-platforms)



### Option 3: Create a Cross-Functional Guild System

Establish a guild model that allows product team members to participate in cross-functional groups focused on specific internal libraries and tools. Here’s how it could work:

#### **Formation of Guilds**

- **Mixed Membership:** Each guild comprises representatives from different product teams, including developers, QA, and Ops. This diversity fosters shared ownership and responsibility.
- **Expert Leadership:** Lead each guild with subject matter experts from the Spirit group, ensuring technical leadership and alignment with best practices.

#### **Guild Responsibilities**

- **Regular Work Sessions:** Guilds should hold regular meetings to discuss priorities, share knowledge, and work collaboratively on maintenance and feature tasks. This can lead to a culture of continuous improvement across teams.
- **Maintenance Cycles:** Assign specific maintenance responsibilities to guild members that rotate periodically to ensure a broader understanding of dependencies and codebases.
- **Feedback Loops:** Foster a culture where guild members can provide continuous feedback on the performance of internal libraries and their impact on product development, facilitating adaptive improvements.

---