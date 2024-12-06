# Sprint 3 worksheet

## Load testing
#### Environment for Load Testing
#### Tool Used:
We used Apache JMeter, an open-source performance testing tool, to simulate load and generate reports. JMeter allowed us to define and execute multiple threads to simulate concurrent user behavior.

##### Load Test Test plan stored in : 
RoomHubTestplan.jmx

##### Load Test results in : 
RoomHub160vs60,RoomHub400vs60,RoomHub3200vs300

#### Load Test Cases:
##### User Flow Simulation:
Actions focused on the three main features:
a. Task management (create, retrieve tasks).
b. Shared expenses (create and fetch transactions).
c. Announcements and reminders (send announcements, fetch notifications).
Login/logout was excluded as they directly interact with AWS Amplify.
API Paths Tested:
* CreateTransaction: Create shared expenses.
* CreateTask: Add a new task.
* SendAnnouncement: Send group announcements.
* GetSummary, GetCompletedTasks, GetPendingTasks: Retrieve task lists.
* GetNotifications: Retrieve reminders.
* GetTransactions: Retrieve all transactions.

#### Test Scenarios:
160vs60: 80 concurrent users, 8 requests per user.
400vs60: 50 concurrent users simulating a sudden spike, 8 requests per user.
3200vs300: 400 concurrent users with gradual buildup, 8 requests per user.

#### Load Testing Report
| Test Scenario   | Concurrent Users | Successful Requests | Remarks                                   |
|-----------------|------------------|---------------------|-------------------------------------------|
| 160vs60         | 160              | 158                 | Performed well under regular load.       |
| 400vs60         | 400              | 292                 | Performance degraded under spike load.   |
| 3200vs300       | 3200             | 882                 | Significant failure rate under sustained heavy load. |


#### Metrics Observed:
Response Time:
For 160vs60, response times stayed under the 500ms goal for 90% of requests.
For 400vs60, response times exceeded 500ms for around 40% of requests.
For 3200vs300, response times consistently exceeded the 500ms target, with many timeouts.

#### CPU and Memory Usage:
AWS Lambda showed increased latency under higher loads due to cold start effects and lack of scaling efficiency.

#### Bottleneck Found
One significant bottleneck was the lack of effective scaling for high concurrent user spikes. The Lambda function cold starts and DynamoDB read/write capacity limits were prominent factors. For the 3200vs300 test, the number of simultaneous requests overwhelmed the system, leading to timeouts and errors.

#### Non-Functional Requirement Assessment

##### Original Goal:
Implement in-memory caching to reduce database query load by at least 50% for frequently accessed data.
Maintain response times under 500ms for 90% of requests with 100 concurrent users.

##### Results:
Achieved for regular loads (160vs60): Despite not implementing in-memory caching, the system still managed to meet response time goals under regular load. This indicates that the backend architecture and database indexing were optimized enough to handle moderate loads efficiently.
Partially achieved for spikes (400vs60): Response times degraded during spikes but stayed under 500ms for about 60% of requests. The lack of in-memory caching likely contributed to increased query times.
Failed for heavy sustained loads (3200vs300): The system struggled significantly, with high error rates and timeouts, confirming that caching could have played a critical role in handling such scenarios.

##### Why Did We Meet Some Goals Without Caching?
Efficient Database Queries:
Well-optimized queries in DynamoDB reduced response times even without caching.
AWS Lambda Scalability (Regular Loads):
AWS Lambda's ability to handle regular loads ensured the backend performed well under non-peak conditions.
Minimal Cold Starts:
During the 160vs60 test, cold starts were negligible due to steady, predictable traffic.

##### Could Goals Be Fully Met with Money?
Yes, additional investment could help achieve full compliance with non-functional requirements:
Introduce Caching:
Implementing AWS Elasticache (e.g., Redis) would reduce database dependency and drastically improve response times for frequently accessed data.
Provisioned Lambda Concurrency:
Reducing cold start times during spikes would improve performance in high-load scenarios.
Increase DynamoDB Throughput:
Setting auto-scaling read/write capacity would help handle peak loads.

#### Conclusion
Despite not implementing in-memory caching, the application met its goals for regular loads and partially met them during spikes. This demonstrates that efficient backend design can achieve strong performance even without caching, but sustained heavy loads exposed the system's limitations. With caching and infrastructure upgrades, the app could meet all non-functional goals effectively.



## Security analysis
**1. Choice of Security Analysis Tool and how we run**

Choice of Security Analysis Tool:
  * Our project uses ZAP by Checkmarx, a recognized static and dynamic application security testing tool. This choice aligns with requirement of analyzing the programming language predominantly used in the project's source code. ZAP is specifically designed to identify security vulnerabilities in web applications through automated scanning and is effective for analyzing both server-side and client-side code.

Running the Tool:

  The execution involves:

    1. Setting up ZAP and configuring it to target the RoomHub project.

    2. To run a Quick Start Automated Scan:

        1. Start ZAP and click the **Quick Start** tab of the Workspace Window.

        2. Click the large Automated Scan button.

        3. In the **URL to attack** text box, enter the full URL of the web application you want to attack.

        4. Click the **Attack**
    
    3. Scanning the application by simulating interactions with the interface to identify vulnerabilities and code related issues. We used both traditional and ajax spider for crawling our web application. The traditional ZAP spider discover links by examining the HTML in resposnes from web application. In addition, AJAX spider is likely to be more effective. This spider explores our web application by involving browsers which then follow the links that have been generated. After scanning completed, we can view Alert Details follow by these categories: High, Medium, Low, Informational and False Positive.

    4. To Manually Explore your application:

        1. Start ZAP and click the **Quick Start** tab of the Workspace Window.

        2. Click the large Manual Explore button

        3. In the **URL to explore** text box, enter the full URL of the web application you want to explore.

        4. Select the browser you would like to use.

        5. Click the **Launch Browser**

    5. By using **Manual Explore**, we explore all of our web application with a browser proxying through ZAP. Next, ZAP passively scans all of the requests and response made during our exploration for vulnerabilities, continues to build the site tree, and records alerts for potential vulnerabilities found during the exploration. Hence, it's important that ZAP explore each page of our web application. 

    6. Generating a detailed report, which includes detected problems categorized by severity, type, and suggest remediations

**2. Report as an appendix and 5 detected problems** 

  * [Security Analysis Report (Appendix)](./RoomHub-Report.pdf)

5 detected problems:

    1. Cloud Metadata Potentially Exposed

        * Description: The application exposes cloud metadata endpoints, potentially allowing attackers to retrieve sensitive data such as cloud credentials or configurations.

        * Impact: Exploitation can lead to unauthorized access to cloud infrastructure or privilege escalation.

        * Solutions: 
            * Restrict access to cloud metadata services.
            * Use firewall rules to block public access to metadata endpoints.
            * Implement access controls and monitor access logs for unusual activities.
    
    2. Content Security Policy (CSP) Header Not Set
        
        * Description: The application does not set a Content Security Policy (CSP), leaving it vulnerable to various injection attacks, including Cross-Site Scripting (XSS).

        * Impact: Attackers could exploit this to run malicious scripts in the user's browser.

        * Solutions:
            * Define and implement a strong CSP header to restrict resource loading.
            * Regularly review and update the CSP policy to adapt to application changes.
    
    3. Cross-Domain Misconfiguration

        * Description: Cross-origin resource sharing (CORS) is misconfigured, potentially allowing unauthorized access to sensitive resources from external domains.

        * Impact: Attackers could exploit this to steal sensitive data via a malicious website.

        * Solutions:
            * Ensure that the CORS policy specifies trusted domains only.
            * Avoid using overly permissive settings like Access-Control-Allow-Origin: *.

    4. Missing Anti-Clickjacking Header

        * Description: The application does not set the X-Frame-Options or Content-Security-Policy header to prevent clickjacking attacks.

        * Impact: An attacker could embed the application in a malicious iframe, tricking users into performing unintended actions.

        * Solutions:
            * Add the X-Frame-Options header with the value DENY or SAMEORIGIN.
            * Use CSP with the frame-ancestors directive to control iframe embedding.
    
    5. Hidden File Found

        * Description: A file or directory that is not intended to be public was discovered on the server.

        * Impact: Such files may contain sensitive data, configurations, or credentials that attackers can exploit.

        * Solutions:
            * Identify and remove hidden or sensitive files from public directories.
            * Use .gitignore or server configurations to block access to such files.

**3. Handle all Critical and High priority vulnerabilities**

    1. Restrict Access to Cloud Metadata Endpoints
        * Action: Configure network-level firewalls or access control lists (ACLs) to prevent unauthorized access to cloud metadata endpoints like 169.254.169.254 (commonly used for AWS metadata).
        
        * Implementation:
            * Block public network traffic to metadata services.
            * Restrict access to metadata endpoints to trusted internal instances only.

    2. Enhance Role-Based Access Control
        * Action: Implement strict role-based access controls (RBAC) to ensure that only authorized users and services can access sensitive cloud metadata.
    
        * Implementation:
            * Assign least privilege to services requiring metadata access.
            * Regularly audit and update IAM (Identity and Access Management) roles.

    3. Secure Cloud Instance Metadata Service (IMDS)
        * Action: In AWS, upgrade to Instance Metadata Service v2 (IMDSv2), which requires session-based tokens and is less vulnerable to SSRF (Server-Side Request Forgery) attacks.

        * Implementation:
            * Enable IMDSv2 by configuring your cloud instance.
            * Disable IMDSv1 to prevent fallback.

    4. Code-Level Preventive Measures
        * Action: Modify application code to avoid direct interactions with metadata endpoints.

        * Implementation:
            * Refactor the code to use environment variables or secured vaults for configurations instead of directly accessing metadata.

    5. Monitor and Audit Access
        * Action: Implement logging and monitoring for any access attempts to cloud metadata endpoints.

        * Implementation:
            * Use tools like AWS CloudWatch or Azure Monitor to track metadata access.
            * Set up alerts for unauthorized or unusual access attempts.

    We handle the critical priority vulnerabilities by almost access to AWS to restrict access to metadata. Also we did setup the environment variables in our back end directory for configuration by this commit

[Handle .env file commit](https://github.com/WilliamOdumah/RoomHub/commit/e0c91e698e01a7572f2ef825f9df7b7be4d2b9d9)


## Continuous Integration and deployment (CI/CD)
1. CI/CD Environment Description
  * We use GitHub Actions for both Continuous Integration (CI) and Continuous Deployment (CD). 

    CI - Linting with ESLint
    Purpose: Ensure code quality by automatically running ESLint scans on every push or pull request affecting the backend.
    1. Workflow steps:
        * Trigger: Automatically starts when a commit is pushed to the `Backend` directory or a pull request is made from the main branch.
        * Execution:
            * Checks out the code.
            * Set up Node.js (v22.x)
            * Installs dependencies
            * Runs the ESLint linting command (`npm run lint`) within the `./Backend` directory.
    
    2. [Worflow link](https://github.com/WilliamOdumah/RoomHub/actions/runs/12146573400/job/33870809861)

    CD - Automatic Deploymeny to AWS Lambda
    Purpose: Automatically build and deploy the backend code to AWS Lambda.
    1. Workflow steps:
        * Trigger: Activated on push or pull request to the `main` branch.
        * Execution:
            * Checks out the code.
            * Sets up Node.js (v22.x)
            * Installs dependencies.
            * Configures AWS credentials using GitHub Secrets (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`).
            * Deploys the zipped backend code (`testings2.zip`) to the AWS Lambda function named `Roomhub`.
    
    2. [Workflow link](https://github.com/WilliamOdumah/RoomHub/actions/runs/12134264023/job/33831174241)


## Throughts
Given what we know now, we would have made significant changes to the design of our project, particularly in how we structured the integration with AWS Lambda. While AWS Lambda provided a scalable and efficient solution for handling backend logic, we underestimated the complexity of managing multiple functions for distinct tasks, which sometimes led to confusion and redundancy. Moving forward, we would have designed a more centralized architecture with better modularization of the Lambda functions, ensuring each function handles a specific purpose without overlap. Additionally, implementing robust monitoring and logging systems earlier in the process would have allowed us to identify and address bottlenecks or errors more effectively. These changes would not only streamline the development process but also enhance the overall performance and maintainability of our project.


## Other thoughts
Regarding the project setup, adding clearer and more specific requirements early on would have streamlined our development process. There were moments when ambiguity in requirements led to wasted time on unnecessary revisions. Also, periodic check-ins were valuable but could be reduced in frequency. While they kept the project on track, fewer but more comprehensive check-ins might have allowed for deeper focus on development between meetings. Lastly, while rotating roles each sprint provided valuable learning opportunities for every group member, it also slowed down the production and quality of our development process due to learning curves. Each member having a strict role would allow them to focus completely it throughout the duration of the project, thus leading to faster and more quality output.
