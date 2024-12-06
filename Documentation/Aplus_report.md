# A+ Feature Report: Backend Optimization through AWS Lambda Microservices Architecture

## Introduction

The purpose of this feature was to explore and evaluate the impact of splitting backend functionalities into dedicated AWS Lambda functions, each tied to specific API endpoints. Our hypothesis was that this architecture could improve performance, scalability, and reduce downtime by isolating services, leveraging Lambda's on-demand scaling, and dynamically linking APIs to dedicated tasks.

## Implementation Approach

1. Existing Setup:
 * Our initial backend leveraged a monolithic Lambda function interfacing with DynamoDB as the primary datastore.
 * DynamoDB was configured with default provisioned throughput settings, optimized for a consistent, moderate load.

2. Proposed Optimization:
 * Refactor backend services into smaller, independently deployed Lambda functions.
 * Define distinct API Gateway paths mapped to respective Lambda functions.
 * Use DynamoDB for shared backend operations.

3. Goal:
 * Achieve better performance and resiliency.
 * Distribute the load dynamically among services, ensuring minimal downtime and faster response times.

## Observations and Results

After implementation, we conducted a series of load tests to measure the architecture's performance under varying conditions. Here are the key observations:

1. Performance Gains:
 * Initial Results: Faster responses and reduced latency under moderate loads, attributed to dedicated Lambda functions handling specific tasks independently.
 * Concurrency Handling: Each Lambda instance scaled independently, allowing the system to handle higher simultaneous API requests.

2. Challenges Identified:
 * ProvisionedThroughputExceededException:
   * Under high concurrency, multiple Lambda functions established concurrent connections to DynamoDB, quickly exceeding the provisioned throughput limit.
   * This led to higher failure rates (45%) during load tests compared to 2% in the original monolithic setup.

3. Root Cause:
 * DynamoDB provisioned throughput limits were being exceeded due to multiple Lambda functions initiating simultaneous requests.
 * Each new Lambda invocation creates a separate connection to DynamoDB, amplifying traffic during load spikes.

## Analysis

The microservices approach demonstrated significant scalability and modularity benefits. However, the bottleneck surfaced as the increased concurrency exposed the following system limitations:

 * DynamoDB Throughput Configuration:
   * The free tier limits for DynamoDB (25 RCU/WCU) were inadequate to sustain the increased traffic from multiple Lambda invocations.
   * The system could not dynamically scale beyond these limits during peak loads without additional provisioning.
 * Lambda-DynamoDB Connection Multiplexing:
   * Unlike a monolithic function reusing existing connections, splitting the backend created independent clients for each Lambda function, leading to resource contention.

## Conclusion
The architectural change showcased both strengths and limitations:
 * Strengths:
   * Improved modularity and scalability.
   * Faster response times under moderate loads.
   * Average Speed For Successful requests with Microservices architecture: 1027.126316
   * Average Speed For Successful requests with Microservices architecture: 1517.259

 * Limitations:
   * Unforeseen bottlenecks in DynamoDB due to increased concurrency.
   * Higher resource utilization led to exceeding free-tier limits.

Please See APlusLoadTest for Loadtesting results with microservices architecture.

