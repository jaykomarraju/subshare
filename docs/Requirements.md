# **Subshare Requirements Document**

## **1\. Introduction**

**Subshare** is a web application designed to simplify the management and tracking of shared subscription payments (such as Netflix, YouTube Premium, etc.) among a group of users. The platform helps an administrator (the person paying the subscription) to create a subscription group, invite friends to join, track payments, send reminders, and view transaction histories—all through an intuitive and shareable interface.

---

## **2\. Problem Statement**

In many shared subscription scenarios, one person pays the full subscription fee while friends owe their share. However, there isn’t a centralized, efficient system to track who has paid and who has not. This results in:

* Lack of transparency in tracking contributions.  
* Potential misunderstandings or delays in payment.  
* Manual follow-ups that are time-consuming and error-prone.

**Subshare** solves this problem by providing a dedicated platform where payment statuses are recorded and updated in real time, reducing friction and ensuring accountability among group members.

---

## **3\. Goals and Objectives**

* **Transparency:** Provide a clear view of subscription payment statuses.  
* **Efficiency:** Automate reminders and notifications to reduce manual follow-ups.  
* **User Engagement:** Create an intuitive, sharable, and mobile-responsive UI.  
* **Security:** Ensure secure handling of user data and payment-related information.  
* **Scalability:** Design an architecture that can handle growing user numbers and multiple groups.

---

## **4\. Scope**

### **In-Scope Features**

1. **User Accounts & Authentication:**  
   * User sign-up/login with email/password and social logins.  
   * Basic profile management.  
2. **Dashboard:**  
   * Overview of active subscriptions.  
   * Placeholders for payment statuses, subscription groups, and notifications.  
3. **Subscription Group Management:**  
   * Ability for an admin to create and customize a subscription group.  
   * Invitation system via email, SMS, or shareable links.  
4. **Payment Tracking:**  
   * Marking subscription as “Paid” by the admin.  
   * Tracking each invited member's payment status (Paid/Pending).  
   * Timestamped transaction history.  
5. **Notifications & Reminders:**  
   * Automated in-app, email, or SMS reminders for pending payments.  
   * Customizable reminder settings.  
6. **Basic Transaction History:**  
   * Detailed logs of payment activities and contributions.  
7. **UI/UX Considerations:**  
   * Responsive design (mobile-first).  
   * Intuitive layout with clear navigation and user-friendly elements.

### **Out-of-Scope (for MVP)**

* Direct in-app payment gateway integration (optional for later releases).  
* Advanced gamification features (such as leaderboards or badges).  
* Detailed analytics or reporting beyond the basic transaction history.

---

## **5\. Functional Requirements**

### **5.1 User Accounts & Authentication**

* **FR1:** The system shall allow users to sign up using an email/password combination.  
* **FR2:** The system shall support social logins (Google, Facebook, etc.) as an alternative method.  
* **FR3:** The system shall enable users to update their profile details (name, profile picture, etc.).  
* **FR4:** Authentication endpoints must securely store passwords using hashing.

### **5.2 Dashboard**

* **FR5:** Upon logging in, the user shall be redirected to a personalized dashboard.  
* **FR6:** The dashboard shall display active subscriptions, payment statuses, and notifications.  
* **FR7:** The dashboard shall use visual indicators (e.g., color coding, progress bars) to denote payment statuses.

### **5.3 Subscription Group Management**

* **FR8:** A group admin shall be able to create a new subscription group, specifying:  
  * Subscription name (e.g., Netflix, YouTube Premium)  
  * Payment amount  
  * Due date  
  * Customizable group details (e.g., image/logo)  
* **FR9:** The system shall allow the admin to invite members via email, SMS, or a shareable link.  
* **FR10:** The system shall allow the admin to mark the subscription as “Paid.”

### **5.4 Payment Tracking**

* **FR11:** Each group member’s payment status shall be tracked (e.g., Pending, Paid).  
* **FR12:** The system shall record the date and time when a payment is marked as complete.  
* **FR13:** The admin and members shall be able to view a detailed transaction history.

### **5.5 Notifications & Reminders**

* **FR14:** The system shall send automated notifications to remind members of pending payments.  
* **FR15:** The reminder settings shall be customizable by the admin and members.  
* **FR16:** Notifications shall be delivered via in-app alerts and optionally through email/SMS.

### **5.6 Security & Privacy**

* **FR17:** All sensitive data (e.g., passwords, payment details) must be encrypted both in transit and at rest.  
* **FR18:** The system shall follow best practices for securing user data and must adhere to applicable data protection regulations.

---

## **6\. Non-Functional Requirements**

* **NFR1:** The platform shall have a responsive design that works seamlessly on mobile, tablet, and desktop devices.  
* **NFR2:** The system should be scalable to support multiple subscription groups and a growing user base.  
* **NFR3:** The platform must have a high level of uptime with minimal latency for real-time updates.  
* **NFR4:** The codebase shall be maintainable and follow established coding standards and documentation practices.  
* **NFR5:** The system shall ensure a user-friendly and intuitive UI/UX.

---

# **User Stories for Subshare**

### **User Story 1: Subscription Group Creation & Management (Admin Perspective)**

**Title:** Create and Manage Subscription Group

**As** a subscription group admin (Person A),  
**I want** to create a new subscription group for a shared service (e.g., Netflix), invite my friends, and mark the subscription payment as complete,  
**so that** I can efficiently manage and track the contributions of each group member.

**Acceptance Criteria:**

* The admin can successfully sign up and log in.  
* The admin can navigate to the dashboard and select “Create New Group.”  
* The admin can set the subscription details (name, payment amount, due date, image/logo).  
* The admin can invite members using email, SMS, or a shareable link.  
* The admin can mark the subscription as “Paid,” updating the dashboard in real time.  
* The system records the timestamp of the payment and displays a transaction history.

---

### **User Story 2: Payment Notification & Contribution (Member Perspective)**

**Title:** Receive Payment Notification and Confirm Contribution

**As** a group member invited to join a subscription group,  
**I want** to receive a notification when a subscription payment is due and be able to confirm my payment status,  
**so that** I can ensure my share is recorded and the admin is aware of my contribution.

**Acceptance Criteria:**

* The member can sign up or log in via the invitation link.  
* The member sees the subscription group details on the dashboard.  
* The member receives notifications (in-app and email/SMS) about the pending payment.  
* The member can mark their payment status as “Paid” (or complete the payment via integrated gateway in later phases).  
* Upon payment confirmation, both the member and admin see an updated payment status and transaction history.

---

# **Conclusion**

This comprehensive requirements document and the accompanying updated user stories provide a clear roadmap for developing **Subshare**. The focus is on creating a secure, intuitive, and efficient platform for managing shared subscription payments. Each requirement and user story is designed to ensure that the platform is both functional and user-friendly from day one.

