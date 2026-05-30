# Requirements Document

## Introduction

This feature introduces centralized, structured logging and observability to the existing .NET 6 microservices system using the ELK stack (Elasticsearch + Kibana). Today there is no centralized logging: services only write unstructured text to stdout, which makes cross-service troubleshooting, correlation of a single user request across services, and operational visibility effectively impossible.

The goal is to make logs from every microservice (Identity.Api, ECommerce.Api, the YARP api-gateway, Notification.Service, and the planned Chat service) structured, enriched, aggregated into Elasticsearch, and queryable/visualizable in Kibana. Delivery starts with the local development environment (docker-compose + Tilt) and is explicitly designed to extend to production later.

The system being modified is an existing one and MUST NOT be redesigned. This feature adds a cross-cutting logging capability around the current Clean Architecture / CQRS + MediatR / EF Core / PostgreSQL / Redis / RabbitMQ / YARP topology. Two known constraints shape this work: (1) the codebase has had hardcoded-secret issues, so the Elasticsearch endpoint and any credentials MUST be configuration-driven and never hardcoded; and (2) sensitive data (passwords, JWT/refresh tokens, Stripe keys, PII) MUST never reach the logs.

Production hardening (TLS, Elasticsearch authentication, Filebeat-based shipping, and Index Lifecycle Management policies) is in scope as requirements but is explicitly marked as deliverable in a later phase. The development security posture (X-Pack security disabled, local-only binding) is scoped to development only and MUST NOT be used in production.

## Glossary

- **ELK Stack**: The combination of Elasticsearch and Kibana (and optionally Beats/Logstash) used for log aggregation, search, and visualization. In this feature, "ELK" refers to the Elasticsearch + Kibana pair.
- **Elasticsearch**: The search and analytics engine that stores and indexes log documents. Referred to in requirements as the **Log_Store**.
- **Kibana**: The web UI for searching, visualizing, and dashboarding data stored in Elasticsearch. Referred to in requirements as the **Log_UI**.
- **Serilog**: The structured logging library for .NET used by each service to produce structured log events and ship them to Elasticsearch. Referred to collectively as the per-service **Logging_Component**.
- **Structured Logging**: Logging where each event is a set of named fields (key/value pairs) rather than a flat string, enabling field-based search and aggregation.
- **Correlation Id**: A unique identifier attached to all log events produced while handling a single inbound request, propagated across service boundaries (including through the YARP gateway) so a request can be traced end-to-end. Referred to as **Correlation_Id**.
- **Trace Id**: A distributed-tracing identifier (W3C `traceparent`) that, when present, is recorded alongside the Correlation_Id. Where a Trace Id is available it MAY serve as the Correlation_Id.
- **Enrichment**: The act of adding contextual fields (service name, environment, log level, timestamp, Correlation_Id) to every log event.
- **Index**: A named collection of log documents in Elasticsearch.
- **Index Naming Scheme**: The convention used to name daily per-service indices, of the form `logs-{service}-{date}` (for example `logs-identity-2025-05-30`).
- **Data View**: A Kibana definition (formerly "index pattern") that selects one or more Elasticsearch indices (for example `logs-*`) so they can be queried in Kibana.
- **ILM (Index Lifecycle Management)**: An Elasticsearch mechanism that automatically rolls over, ages, and deletes indices according to a retention policy.
- **Filebeat**: A lightweight log shipper (a Beat) that can forward log files/streams to Elasticsearch; reserved for the later production-hardening phase.
- **X-Pack Security**: The Elasticsearch security feature set (authentication, role-based access, TLS). Disabled in development, required in production.
- **Sensitive Data**: Passwords, JWT access tokens, refresh tokens, Stripe API keys and payment secrets, and personally identifiable information (PII) such as email addresses and full names where not required.
- **Development Environment**: The local environment orchestrated via docker-compose and Tilt where `ASPNETCORE_ENVIRONMENT=Development`.
- **Production Environment**: Any deployed environment where `ASPNETCORE_ENVIRONMENT=Production`.
- **Service**: Any of the in-scope .NET 6 applications: Identity.Api, ECommerce.Api, api-gateway (YARP), Notification.Service, and the planned Chat service.

## Requirements

### Requirement 1: Run Elasticsearch and Kibana locally via docker-compose

**User Story:** As a developer, I want Elasticsearch and Kibana running locally through docker-compose, so that I have a local log store and UI without provisioning external infrastructure.

#### Acceptance Criteria

1. THE docker-compose configuration SHALL define an Elasticsearch service running as a single-node cluster in the Development Environment.
2. THE docker-compose configuration SHALL define a Kibana service exposed on host port 5601.
3. WHERE the Development Environment is active, THE Elasticsearch service SHALL run with X-Pack security disabled.
4. THE Elasticsearch service SHALL be configured with a bounded JVM heap size of 512 megabytes minimum and 512 megabytes maximum via the `ES_JAVA_OPTS` environment variable.
5. THE Elasticsearch service SHALL persist index data to a named docker volume so that log data is retained across container restart and container recreation.
6. THE Elasticsearch service SHALL define a container healthcheck that queries the cluster HTTP endpoint at an interval of 10 seconds, with a per-attempt timeout of 10 seconds, allowing up to 12 consecutive failed attempts before being marked unhealthy, and that reports healthy WHEN the endpoint returns a cluster status of `yellow` or `green`.
7. THE Kibana service SHALL define a container healthcheck that queries its status API at an interval of 10 seconds, with a per-attempt timeout of 10 seconds, allowing up to 12 consecutive failed attempts before being marked unhealthy, and that reports healthy WHEN the status API returns an available state.
8. WHILE the Elasticsearch service has not reported a healthy state, THE Kibana service SHALL NOT start and SHALL wait for the Elasticsearch healthcheck to report healthy.
9. WHERE the Development Environment is active, THE Elasticsearch service and THE Kibana service SHALL bind their published ports to the local loopback interface only.
10. IF the Elasticsearch service does not reach a healthy state within its healthcheck retry budget, THEN THE Kibana service SHALL remain not started and THE docker-compose configuration SHALL report the Elasticsearch dependency as unhealthy.

### Requirement 2: Emit structured, enriched logs from .NET services

**User Story:** As an operator, I want every microservice to emit structured logs with consistent context, so that I can filter and aggregate logs by service, environment, severity, and request.

#### Acceptance Criteria

1. THE Logging_Component SHALL produce each log event as a structured record composed of discrete named fields, with no log event emitted as a single unstructured text string.
2. THE Logging_Component SHALL enrich every log event with a named field containing the originating service name.
3. THE Logging_Component SHALL enrich every log event with a named field containing the environment name derived from the `ASPNETCORE_ENVIRONMENT` variable.
4. THE Logging_Component SHALL enrich every log event with a named field containing a timestamp recorded in UTC and formatted as ISO 8601.
5. THE Logging_Component SHALL enrich every log event with a named field containing the log level.
6. THE Logging_Component SHALL enrich every log event with a named field containing the Correlation_Id of the request being handled.
7. THE Logging_Component SHALL replace the default .NET stdout logging provider as the application logging mechanism across all environments.
8. WHERE the Development Environment is active, THE Logging_Component SHALL emit log events with a minimum log level of Information.
9. WHERE the Development Environment is active, THE Logging_Component SHALL write log output to the console.
10. WHERE the Development Environment is active, THE Logging_Component SHALL emit log events originating from the `Microsoft.AspNetCore` namespace with a minimum log level of Warning.
11. IF the Correlation_Id for the request being handled cannot be determined, THEN THE Logging_Component SHALL enrich the log event with a Correlation_Id field set to a reserved value indicating that no correlation identifier is available.

### Requirement 3: Propagate a correlation id across services and the gateway

**User Story:** As a developer debugging an issue, I want a single correlation id to follow a request across every service it touches, so that I can reconstruct the full path of one user action.

#### Acceptance Criteria

1. WHEN an inbound HTTP request arrives without a Correlation_Id header, or with a Correlation_Id header whose value is empty, THE api-gateway SHALL generate a new Correlation_Id that is a non-empty string of 1 to 128 printable ASCII characters and that is unique across all Correlation_Ids it has generated.
2. WHEN an inbound HTTP request arrives with a Correlation_Id header whose value is a non-empty string of 1 to 128 printable ASCII characters, THE api-gateway SHALL reuse the supplied Correlation_Id unchanged for the request.
3. IF an inbound HTTP request arrives with a Correlation_Id header whose value exceeds 128 characters or contains characters outside the printable ASCII set, THEN THE api-gateway SHALL generate a new Correlation_Id for the request and SHALL NOT forward the supplied value.
4. WHEN the api-gateway forwards a request to a downstream Service, THE api-gateway SHALL include the Correlation_Id as an HTTP header on the forwarded request.
5. WHEN a Service receives a request containing a non-empty Correlation_Id header, THE Service SHALL adopt that Correlation_Id for all log events produced while handling the request.
6. WHEN a Service receives a request that does not contain a Correlation_Id header, or contains one whose value is empty, THE Service SHALL generate a new Correlation_Id that is a non-empty string of 1 to 128 printable ASCII characters and that is unique across all Correlation_Ids it has generated.
7. WHEN a Service publishes a message to RabbitMQ as part of handling a request, THE Service SHALL include the Correlation_Id in the message metadata.
8. WHEN a Service consumes a RabbitMQ message that carries a Correlation_Id, THE Service SHALL adopt that Correlation_Id for all log events produced while processing the message.
9. WHEN a Service returns any HTTP response for a request, including success and error responses, THE Service SHALL include the Correlation_Id used for that request as an HTTP response header.
10. WHERE an inbound request carries a W3C `traceparent` header, THE receiving Service SHALL record the associated Trace Id on every log event produced for that request.

### Requirement 4: Ship logs to Elasticsearch using a configurable endpoint and index scheme

**User Story:** As an operator, I want logs delivered to Elasticsearch under a predictable index naming scheme using a configurable endpoint, so that logs are centrally queryable and the deployment is portable across environments.

#### Acceptance Criteria

1. WHEN a log event is generated, THE Logging_Component SHALL transmit the log event to the Log_Store identified by the configured Elasticsearch endpoint value within 5 seconds of generation.
2. THE Logging_Component SHALL read the Elasticsearch endpoint value from a named environment variable at startup.
3. THE Logging_Component SHALL NOT contain a hardcoded Elasticsearch endpoint value in source code or in version-controlled configuration files.
4. WHERE Elasticsearch credentials are required, THE Logging_Component SHALL read those credentials from environment variables or an injected secret store.
5. THE Logging_Component SHALL write log events to a daily, per-service index named according to the pattern `logs-{service}-{date}`, where `{service}` is the lowercase service name and `{date}` is the UTC calendar date formatted as `YYYY-MM-DD`.
6. THE Logging_Component SHALL serialize each log event so that each enrichment field defined in Requirement 2 is stored as a distinct, searchable field in the Log_Store.
7. IF the configured Elasticsearch endpoint value is absent at startup, THEN THE Logging_Component SHALL log a startup warning to the console and continue running using console logging only.
8. IF the configured Elasticsearch endpoint value is present but is not a valid URL at startup, THEN THE Logging_Component SHALL log a startup warning to the console, continue running using console logging only, and SHALL NOT terminate.
9. IF transmission of a log event to the Log_Store fails or the endpoint is unreachable, THEN THE Logging_Component SHALL retry the transmission up to 3 times using a connection timeout of 10 seconds per attempt and, if all attempts fail, SHALL write the log event to the console and continue running without terminating.

### Requirement 5: Provide Kibana data view, saved searches, and dashboards

**User Story:** As an operator, I want a ready-made Kibana data view and baseline dashboards, so that I can immediately search logs and monitor service health without manual setup.

#### Acceptance Criteria

1. THE Log_UI SHALL provide a Data View whose index pattern matches all indices whose names begin with the prefix `logs-` (`logs-*`).
2. WHEN an operator supplies a Correlation_Id value as the saved search filter input, THE Log_UI SHALL provide a saved search that returns only the log events whose Correlation_Id field equals the supplied value, ordered by the log timestamp field in descending order.
3. THE Log_UI SHALL provide a dashboard visualization that displays the count of error-level log events (log events whose severity level equals "Error") grouped by service name, over a configurable time range that defaults to the most recent 24 hours.
4. THE Log_UI SHALL provide a saved search that lists Identity.Api authentication events of the types registration, login, token refresh, and logout, ordered by the log timestamp field in descending order.
5. THE Log_UI SHALL configure the Data View to use the UTC log timestamp field as the primary time field.
6. THE Kibana data view, saved searches, and dashboards SHALL be defined as version-controlled, importable artifacts that can be imported into a Kibana instance without manual modification and that produce the same baseline observability assets on each import.
7. IF the supplied Correlation_Id matches no log events, THEN THE Log_UI SHALL display an empty result set and SHALL NOT raise an error.

### Requirement 6: Redact sensitive data from logs

**User Story:** As a security-conscious engineer, I want sensitive data kept out of all logs, so that the central log store never becomes a source of credential or PII leakage.

#### Acceptance Criteria

1. THE Logging_Component SHALL exclude user passwords from every log event.
2. THE Logging_Component SHALL exclude JWT access tokens and refresh tokens from every log event.
3. THE Logging_Component SHALL exclude Stripe API keys and payment secrets from every log event.
4. WHEN a log event would otherwise include a field classified as Sensitive Data, THE Logging_Component SHALL replace the entire field value with a fixed redaction placeholder that contains no character of the original value and whose length is independent of the original value, before the event reaches the Log_Store.
5. THE Logging_Component SHALL exclude the request and response bodies of Identity.Api authentication endpoints from log events, retaining only two non-sensitive metadata fields, the authentication outcome (success or failure) and the subject identifier (username or email), and excluding all other body fields.
6. IF a Sensitive Data value is detected within an exception message or stack trace, THEN THE Logging_Component SHALL replace every occurrence of the detected value with the redaction placeholder before the event reaches the Log_Store.
7. IF the Logging_Component cannot determine whether a field value contains Sensitive Data, THEN THE Logging_Component SHALL replace that field value with the redaction placeholder before the event reaches the Log_Store.
8. THE Logging_Component SHALL apply the exclusion and redaction rules to every log event at all severity levels before the event reaches the Log_Store.

### Requirement 7: Continue operating when Elasticsearch is unavailable

**User Story:** As a service owner, I want my service to keep working when the log store is down, so that a logging outage never degrades or blocks the request path.

#### Acceptance Criteria

1. IF the Log_Store is unreachable when a log event is produced, THEN THE Logging_Component SHALL allow the request being handled to complete successfully without raising an error or exception to the caller.
2. WHILE the Log_Store is unreachable, THE Logging_Component SHALL write every produced log event to the console.
3. WHILE the Log_Store is unreachable, THE Logging_Component SHALL buffer pending log events in a queue bounded to a maximum of 10,000 events.
4. IF the buffer of pending log events reaches its maximum of 10,000 events while the Log_Store is unreachable, THEN THE Logging_Component SHALL discard the oldest buffered events so that newly produced events can be retained.
5. WHEN the Log_Store becomes reachable again after an outage, THE Logging_Component SHALL resume shipping newly produced log events to the Log_Store within 30 seconds of reachability being restored.
6. WHEN the Log_Store becomes reachable again after an outage, THE Logging_Component SHALL ship the buffered pending log events to the Log_Store in the order they were produced.
7. IF shipping a log event to the Log_Store fails, THEN THE Logging_Component SHALL retain the affected log event in the bounded buffer and continue operating without terminating the host process.
8. THE Logging_Component SHALL apply a send timeout of at most 2 seconds to each attempt to ship a log event to the Log_Store.
9. IF a send attempt to the Log_Store does not complete within the 2-second send timeout, THEN THE Logging_Component SHALL abandon that attempt and treat it as a shipping failure without blocking the request path.

### Requirement 8: Non-functional constraints for the development ELK deployment

**User Story:** As a developer running the stack on a laptop, I want bounded resource usage, defined retention, and aligned versions, so that local observability is stable and predictable.

#### Acceptance Criteria

1. THE Elasticsearch service and THE Kibana service SHALL each declare an explicit finite container memory limit in the docker-compose configuration, with THE Elasticsearch service limited to a maximum of 2 GB and THE Kibana service limited to a maximum of 1 GB.
2. THE Elasticsearch image version and THE Kibana image version SHALL be pinned to the same major version and the same minor version.
3. WHERE the Development Environment is active, THE retention expectation for log indices SHALL be documented as a fixed maximum age of 7 days.
4. THE docker-compose configuration SHALL pin the Elasticsearch image and the Kibana image to explicit version tags and SHALL NOT use a floating `latest` tag.
5. IF a log index has an age greater than the documented maximum age of 7 days, THEN THE System SHALL mark that index as eligible for deletion.

### Requirement 9: Production hardening (later-phase deliverable)

**User Story:** As an operator preparing for production, I want the production security and lifecycle posture defined, so that the development-only configuration is never used in production and production rollout has clear targets.

#### Acceptance Criteria

1. WHERE the Production Environment is active, THE Elasticsearch service SHALL require X-Pack security to be enabled before processing any read or write request.
2. WHERE the Production Environment is active, THE Logging_Component SHALL transmit all log events to the Log_Store over TLS and SHALL NOT transmit log events over an unencrypted channel.
3. WHERE the Production Environment is active, THE Log_Store SHALL require authenticated access for all read and write operations.
4. WHERE the Production Environment is active, THE log indices SHALL be governed by an ILM policy that performs index rollover when an index reaches its configured age or size threshold and deletes indices once they exceed the retention period defined in the documented retention policy.
5. WHERE the Production Environment is active, THE log shipping mechanism SHALL support a Filebeat-based pipeline as an alternative to direct application-to-Elasticsearch shipping.
6. WHERE the Production Environment is active, IF a configuration is detected in which X-Pack security is disabled or the service is bound only to the loopback interface, THEN THE Elasticsearch service SHALL refuse to start and SHALL produce an error indication identifying the development-only setting.
7. WHERE the Production Environment is active, IF a TLS connection to the Log_Store cannot be established, THEN THE Logging_Component SHALL retain unsent log events for retry, SHALL NOT transmit them over an unencrypted channel, and SHALL produce an error indication.
8. WHERE the Production Environment is active, IF a read or write request to the Log_Store lacks valid authentication credentials, THEN THE Log_Store SHALL reject the request and SHALL NOT return or persist log data.

> Note: Requirement 9 (TLS, Elasticsearch authentication, Filebeat shipping, and ILM policies) is in scope but is planned for a later delivery phase after the development-environment capability in Requirements 1–8 is complete.
