**Blurb about overall project structure**

Essentially it will mimic a communication between a user and an agent for each test in a module in a session.
The benchmark will submit messages to an agent, and then upon the "prompt" event, would respond with a given response, and upon the "submit_test" event, the agent would claim completion, and an output record would be generated.
The evaluator would then run and create an evaluation record.
The records would be associated with the uuid session id.
So once the session is complete, a report can be generated based on the evaluations, and deeper analysis performed via a dedicated report viewer.
I'm kinda inspired by goaccess
