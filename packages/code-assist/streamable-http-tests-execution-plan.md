# Execution Plan: Basic StreamableHTTP Unit Tests

## 1. High-Level Objective
Create focused unit tests that validate core StreamableHTTP functionality including session creation/reuse, request routing, error handling, and transport lifecycle management.

## 2. Context & Key Standards
- **Testing Framework:** Bun test following existing patterns in `tests/unit.test.ts`
- **Coding Standards:** Google licensing, TypeScript strict mode, minimal strategic comments
- **File Structure:** Add new describe block to existing `tests/unit.test.ts`
- **Mocking Strategy:** Mock StreamableHTTPServerTransport and Express objects, spy on logging

## 3. Proposed Approach
Add a comprehensive describe block for "StreamableHTTP Transport" that systematically tests each component using the established mocking and assertion patterns.

## 4. Pre-computation Checklist
- [x] Existing test patterns analyzed
- [x] StreamableHTTP implementation reviewed
- [x] Dependencies identified: express, @modelcontextprotocol/sdk
- [x] Test data patterns established
- [x] Error scenarios mapped

## 5. Step-by-Step Implementation

### **File: `tests/unit.test.ts`**

**Action:** Extend existing file with new describe block

**Step 5.1: Add StreamableHTTP Mocks and Imports**
- Import required types: `Request`, `Response` from express
- Add mock for `StreamableHTTPServerTransport` class
- Create helper functions for mock request/response objects

**Step 5.2: Create Session Management Test Suite**
- **Test:** "creates new session for initialize request without session ID"
  - Mock POST request with `method: 'initialize'`
  - Verify new transport created and stored in `transports` object
  - Assert session ID generated and returned

- **Test:** "reuses existing session when valid session ID provided"
  - Pre-populate `transports` with existing session
  - Mock request with valid `mcp-session-id` header
  - Verify existing transport reused, no new transport created

- **Test:** "cleans up session when transport closes"
  - Create session, trigger `transport.onclose` callback
  - Verify session removed from `transports` object

**Step 5.3: Create Request Routing Test Suite**
- **Test:** "handles valid MCP initialize request"
  - Mock valid initialize request body
  - Verify transport creation and server connection
  - Assert `handleRequest` called on transport

- **Test:** "returns 400 for invalid request without session ID"
  - Mock non-initialize request without session header
  - Verify 400 status with appropriate JSON-RPC error response

- **Test:** "handles SDK 1.17.4 compatibility fallback"
  - Mock scenario where `isInitializeRequest` throws
  - Verify fallback logic detects initialize method manually
  - Assert transport still created successfully

**Step 5.4: Create Error Handling Test Suite**  
- **Test:** "returns 500 for transport connection errors"
  - Mock `server.connect()` to throw error
  - Verify 500 status with internal server error response
  - Assert error logged to console

- **Test:** "handles malformed request bodies gracefully"
  - Mock request with invalid JSON
  - Verify appropriate error response
  - Assert no session created for invalid requests

**Step 5.5: Create Health Endpoint Test Suite**
- **Test:** "returns correct session count in health endpoint"
  - Pre-populate `transports` with known sessions
  - Mock GET request to `/health`
  - Verify response includes correct `activeSessions` count

**Step 5.6: Create Graceful Shutdown Test Suite**  
- **Test:** "cleans up all sessions during SIGINT shutdown"
  - Pre-populate `transports` with multiple sessions
  - Mock `transport.close()` method
  - Trigger SIGINT event handler
  - Verify all sessions closed and removed

**Details for Implementation:**
- Use `mock()` and `spyOn()` following existing patterns
- Create reusable mock factories for Request/Response objects
- Mock `StreamableHTTPServerTransport` constructor and methods
- Use `beforeEach`/`afterEach` for test isolation
- Assert on both successful paths and error conditions

## 6. Commenting & Code Style Guide
- Comments should explain *why* specific mocking strategies are used, not *what* the test does
- Focus comments on non-obvious testing scenarios (e.g., SDK compatibility fallback)
- Follow existing test file patterns for minimal but meaningful comments
- Use descriptive test names that serve as documentation

## 7. Testing Strategy
- **Mock External Dependencies:** StreamableHTTPServerTransport, Express objects
- **Test Data:** Create minimal valid MCP request objects, session IDs
- **Assertions:** Verify state changes in `transports` object, function calls, response status/content
- **Coverage Focus:** Core functionality paths, not exhaustive edge cases (per user requirements)

## 8. Implementation Notes
- Add new describe block titled "StreamableHTTP Transport" to existing `tests/unit.test.ts`
- Follow existing test patterns for consistency
- Ensure all mocks are properly reset between tests
- Test the actual exported functions and behavior, not internal implementation details
- Focus on verifying the public API contract and error handling

## 9. Success Criteria
- All tests pass with existing test runner (`bun test tests/unit.test.ts`)
- Comprehensive coverage of StreamableHTTP session management
- Error scenarios properly handled and tested
- Transport lifecycle correctly validated
- Health endpoint functionality verified
- Graceful shutdown behavior confirmed

## 10. Dependencies
- Existing Bun test framework
- Mock implementations for Express Request/Response
- StreamableHTTPServerTransport mock
- Integration with existing test patterns and imports