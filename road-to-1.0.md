Things that I want to do pre-1.0:

question of the day:
How do dimensions work? Are "tests" themselves the most discrete piece, or should dimensions of tests be allowed as well?

- [ ] Adapter module
  - [ ] HTTP server interface
  - [ ] Callback url configuration
  - [ ] Endpoint confirmation
  - [ ] Request standard
  - [ ] Timeout handling? (w/ timeout reset endpoint or something to allow extension)
- [ ] Testing and evaluation module
  - [ ] Session creation and management
  - [ ] Support for multi-agent instances for concurrency and efficiency
    - Note: since each test can be run independantly, they'll only need to aggregate at the end, and we can round-robin tests to instances or something
  - [ ] Module Configuration
    - [ ] Test Inclusion Configuration
  - [ ] Test Configuration and Running
    - [ ] Test's module is tracked
    - [ ] Test has "prompt agent" | -> sends outgoing messages
    - [ ] Test has "recieve prompt" | <- recieves incoming messages
    - [ ] Output record recording
    - [ ] Evaluator function running (either pass/fail or 0-1)
    - [ ] Evaluation recorded
- [ ] Report generator module
  - [ ] Aggregate output and evaluation records by module
  - [ ] Session Report format
    - [ ] Session id recorded
    - [ ] Each module's score
    - [ ] Aggregate score
    - [ ] Chart breaking down score by module, as well as other fancy displays
    - [ ] Card for each module along with link to module view
    - [ ] Module page ->
      - [ ] Each test is a card
      - [ ] Test cards show score and widgets by default
      - [ ] Expansion of a test says more
  - [ ] Test display configuration for html report
    - [ ] Tests can display as a simple score, or other widgets can be added like charts.
    - [ ] "Details" including why did this test fail or pass, what was it testing anyway, etc.
  - [ ] Export as csv option, each test (or dimensions) is a row?
- [ ] Third party tests
  - [ ] Good documentation and standardization of test and module specification
  - [ ] Simplicity of content management
