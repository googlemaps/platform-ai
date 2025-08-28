# MCP Streamable HTTP Compliance Implementation Plan

## Executive Summary
Complete implementation of all 7 missing MCP Streamable HTTP specification features with phased delivery, comprehensive testing, and proper version control.

## Implementation Strategy
- **Phase 1:** Features 1-3 (Core functionality) → Check-in with client
- **Phase 2:** Features 4-7 (Advanced functionality)  
- **Git Strategy:** Commit after each completed feature
- **Testing Strategy:** Update unit tests and verify coverage after each feature
- **Quality Gates:** All tests must pass before proceeding to next feature

---

## Phase 1: Core MCP Compliance Features

### Feature 1: Accept Header Validation
**Git Commit:** `feat: add Accept header validation for MCP spec compliance`

#### Implementation Details
**File:** `packages/code-assist/index.ts`
**Location:** Line 279 (within `app.all('/mcp', ...)` handler)

#### Changes Required:
1. **Add Accept Header Validation Function:**
   ```typescript
   // Add at top of file around line 27
   function validateAcceptHeader(req: Request): boolean {
     const acceptHeader = req.headers.accept;
     if (!acceptHeader) return false;
     
     const acceptedTypes = acceptHeader.split(',').map(type => type.trim().split(';')[0]);
     return acceptedTypes.includes('application/json') && acceptedTypes.includes('text/event-stream');
   }
   ```

2. **Add Validation to Request Handler:**
   ```typescript
   // At beginning of app.all('/mcp', ...) handler around line 281
   if (!validateAcceptHeader(req)) {
     return res.status(400).json({
       jsonrpc: '2.0',
       error: { 
         code: -32000, 
         message: 'Bad Request: Accept header must include both application/json and text/event-stream' 
       },
       id: null,
     });
   }
   ```

#### Unit Tests to Add:
**File:** `packages/code-assist/tests/unit.test.ts`
```typescript
describe("Accept Header Validation", () => {
  test("accepts request with valid Accept header", () => {
    const req = createMockRequest({
      headers: { 'accept': 'application/json, text/event-stream' }
    });
    expect(validateAcceptHeader(req)).toBe(true);
  });

  test("rejects request without Accept header", () => {
    const req = createMockRequest({ headers: {} });
    expect(validateAcceptHeader(req)).toBe(false);
  });

  test("rejects request missing application/json", () => {
    const req = createMockRequest({
      headers: { 'accept': 'text/event-stream' }
    });
    expect(validateAcceptHeader(req)).toBe(false);
  });

  test("rejects request missing text/event-stream", () => {
    const req = createMockRequest({
      headers: { 'accept': 'application/json' }
    });
    expect(validateAcceptHeader(req)).toBe(false);
  });
});
```

---

### Feature 2: GET Endpoint for SSE Streams
**Git Commit:** `feat: implement GET endpoint for server-initiated SSE streams`

#### Implementation Details
**File:** `packages/code-assist/index.ts`
**Location:** Replace `app.all('/mcp', ...)` with separate handlers

#### Changes Required:
1. **Replace app.all() with Specific HTTP Method Handlers:**
   ```typescript
   // Replace the current app.all('/mcp', ...) with:
   
   // GET handler for SSE streams
   app.get('/mcp', async (req: Request, res: Response) => {
     if (!validateAcceptHeader(req)) {
       return res.status(400).json({
         jsonrpc: '2.0',
         error: { code: -32000, message: 'Bad Request: Accept header must include text/event-stream for GET requests' },
         id: null,
       });
     }

     const sessionId = req.headers['mcp-session-id'] as string | undefined;
     if (!sessionId || !transports[sessionId]) {
       return res.status(400).json({
         jsonrpc: '2.0',
         error: { code: -32000, message: 'Bad Request: Valid session ID required for GET requests' },
         id: null,
       });
     }

     try {
       const transport = transports[sessionId];
       await transport.handleRequest(req, res);
     } catch (error) {
       console.error('Error handling GET SSE request:', error);
       if (!res.headersSent) {
         res.status(500).json({
           jsonrpc: '2.0',
           error: { code: -32603, message: 'Internal server error' },
           id: null,
         });
       }
     }
   });

   // POST handler (existing logic)
   app.post('/mcp', async (req: Request, res: Response) => {
     // Move existing app.all logic here with POST-specific validation
   });
   ```

#### Unit Tests to Add:
```typescript
describe("GET Endpoint SSE Streams", () => {
  test("handles GET request with valid session ID", async () => {
    const mockReq = createMockRequest({
      method: 'GET',
      headers: { 
        'accept': 'text/event-stream',
        'mcp-session-id': 'valid-session-123' 
      }
    });
    // Test SSE stream establishment
  });

  test("rejects GET request without session ID", async () => {
    const mockReq = createMockRequest({
      method: 'GET',
      headers: { 'accept': 'text/event-stream' }
    });
    // Test 400 response
  });

  test("rejects GET request with invalid session ID", async () => {
    const mockReq = createMockRequest({
      method: 'GET',
      headers: { 
        'accept': 'text/event-stream',
        'mcp-session-id': 'invalid-session' 
      }
    });
    // Test 400 response
  });
});
```

---

### Feature 3: DELETE Endpoint for Session Termination
**Git Commit:** `feat: add DELETE endpoint for graceful session termination`

#### Implementation Details
**File:** `packages/code-assist/index.ts`

#### Changes Required:
1. **Add DELETE Handler:**
   ```typescript
   // DELETE handler for session termination
   app.delete('/mcp', async (req: Request, res: Response) => {
     const sessionId = req.headers['mcp-session-id'] as string | undefined;
     if (!sessionId || !transports[sessionId]) {
       return res.status(400).json({
         jsonrpc: '2.0',
         error: { code: -32000, message: 'Bad Request: Valid session ID required for DELETE requests' },
         id: null,
       });
     }

     try {
       const transport = transports[sessionId];
       await transport.handleRequest(req, res);
       
       // Clean up transport after successful termination
       try {
         await transport.close();
       } catch (closeError) {
         console.error(`Error closing transport for session ${sessionId}:`, closeError);
       }
       delete transports[sessionId];
       
       console.log(`Session ${sessionId} terminated via DELETE request`);
     } catch (error) {
       console.error('Error handling DELETE session termination:', error);
       if (!res.headersSent) {
         res.status(500).json({
           jsonrpc: '2.0',
           error: { code: -32603, message: 'Internal server error during session termination' },
           id: null,
         });
       }
     }
   });
   ```

#### Unit Tests to Add:
```typescript
describe("DELETE Endpoint Session Termination", () => {
  test("terminates session with valid session ID", async () => {
    const sessionId = 'test-session-delete';
    const mockTransport = { close: mock(), sessionId };
    const mockTransportMap = { [sessionId]: mockTransport };
    
    // Test successful termination and cleanup
  });

  test("rejects DELETE request without session ID", async () => {
    const mockReq = createMockRequest({
      method: 'DELETE',
      headers: {}
    });
    // Test 400 response
  });

  test("rejects DELETE request with invalid session ID", async () => {
    const mockReq = createMockRequest({
      method: 'DELETE',
      headers: { 'mcp-session-id': 'invalid-session' }
    });
    // Test 400 response
  });

  test("handles transport close errors gracefully", async () => {
    const sessionId = 'error-session';
    const mockTransport = { 
      close: mock().mockRejectedValue(new Error('Close failed')),
      sessionId 
    };
    // Test error handling and cleanup
  });
});
```

---

## Quality Gates for Phase 1

### After Each Feature Implementation:
1. **Run Unit Tests:** `bun test`
2. **Check Test Coverage:** Verify new tests cover added functionality
3. **Verify All Tests Pass:** Zero failing tests before commit
4. **Git Commit:** Using specified commit message format
5. **Integration Test:** Manually verify feature works with simple client

### Phase 1 Completion Criteria:
- ✅ All 3 features implemented
- ✅ All unit tests passing
- ✅ Test coverage maintained/improved
- ✅ 3 clean git commits made
- ✅ Ready for client check-in

---

## Phase 2: Advanced MCP Compliance Features

### Feature 4: Origin Header Validation (Security)
**Git Commit:** `feat: add Origin header validation for DNS rebinding protection`

#### Implementation Details
**File:** `packages/code-assist/index.ts`

#### Changes Required:
1. **Add Origin Validation Function:**
   ```typescript
   function validateOriginHeader(req: Request): boolean {
     const origin = req.headers.origin;
     
     // Allow requests without Origin header (server-to-server)
     if (!origin) return true;
     
     // For development, allow localhost origins
     if (process.env.NODE_ENV !== 'production') {
       return origin.startsWith('http://localhost') || origin.startsWith('https://localhost');
     }
     
     // In production, validate against allowed origins
     const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
     return allowedOrigins.includes(origin);
   }
   ```

2. **Add to All HTTP Handlers:**
   ```typescript
   // Add to GET, POST, DELETE handlers
   if (!validateOriginHeader(req)) {
     return res.status(403).json({
       jsonrpc: '2.0',
       error: { code: -32000, message: 'Forbidden: Invalid origin' },
       id: null,
     });
   }
   ```

---

### Feature 5: Proper HTTP Status Codes
**Git Commit:** `feat: implement MCP-compliant HTTP status codes`

#### Implementation Details
Update all error responses to use proper MCP status codes:
- `202 Accepted` for notifications/responses only
- `405 Method Not Allowed` for unsupported methods
- Proper JSON-RPC error codes

---

### Feature 6: Resumability Support (Last-Event-ID)
**Git Commit:** `feat: add Last-Event-ID support for connection resumability`

#### Implementation Details
1. **Handle Last-Event-ID Header in GET requests**
2. **Integrate with StreamableHTTPServerTransport resumability features**
3. **Add event ID tracking and replay logic**

---

### Feature 7: Enhanced Transport Integration
**Git Commit:** `feat: enhance transport integration for full MCP spec support`

#### Implementation Details
1. **Leverage all StreamableHTTPServerTransport capabilities**
2. **Improve error handling and edge cases**
3. **Optimize session management**

---

## Testing Strategy

### Unit Test Requirements for Each Feature:
1. **Happy Path Tests:** Normal operation scenarios
2. **Error Handling Tests:** Invalid inputs, edge cases
3. **Security Tests:** Malformed headers, injection attempts
4. **Integration Tests:** Cross-feature compatibility

### Test Coverage Goals:
- **Minimum:** 80% line coverage for new code
- **Target:** 90% line coverage for new code
- **Maintain:** Existing coverage levels

### Test Execution Process:
1. Run tests after each code change: `bun test`
2. Generate coverage report: `bun test --coverage`
3. Review coverage gaps and add tests as needed
4. Verify all tests pass before git commit

---

## Git Commit Strategy

### Commit Message Format:
```
feat: <brief description of feature>

- Implements MCP Streamable HTTP spec requirement for <feature>
- Adds comprehensive unit tests with <X>% coverage
- Includes error handling for <edge cases>
- Maintains backward compatibility

Fixes: <issue number if applicable>
```

### Branch Strategy:
- Work on feature branch: `feature/mcp-streamable-http-compliance`
- Make individual commits for each feature
- Create PR after Phase 1 completion for review

---

## Success Criteria

### Phase 1 Success:
- ✅ Features 1-3 fully implemented and tested
- ✅ All unit tests passing
- ✅ Test coverage maintained
- ✅ Clean git history with 3 commits
- ✅ Client approval to proceed to Phase 2

### Phase 2 Success:
- ✅ All 7 features fully implemented
- ✅ 100% MCP Streamable HTTP spec compliance
- ✅ Comprehensive test suite
- ✅ Clean, maintainable code
- ✅ Production-ready implementation

### Overall Success:
- ✅ Full MCP Streamable HTTP specification compliance
- ✅ Robust error handling and security
- ✅ Comprehensive test coverage
- ✅ Maintainable, well-documented code
- ✅ Backward compatibility preserved