Aidan - How the heck will this work?
---
So this is the first time I've actually done something like this, and so we'll see how things go. Still, I've done some brainstorming [over on my Substack](https://softwareandsynapses.substack.com/p/all-about-agents-profiling-non-deterministic?r=1pwwk7&utm_campaign=post&utm_medium=web&triedRedirect=true), and so I think we have a lot to go on.

A couple of points to start out. The interface of the system will be an HTTP REST API, which will allow adapters to be built by other projects using HTTP requests. An adopter of the benchmark will create an adapter, in the form of an HTTP server (perhaps other adapter formats will be available in the future), and will use that to communicate with the benchmark. Bi-directional communication will occur through pre-defined benchmark endpoints and callback URLs.

There are several key architectural points to highlight:

**Sessions**
A session is a specific runthrough of the benchmark applied to a specific instance of an agent. The session is the high-level component. When a session is dispatched, a subprocess called a test runner will run tests from each *module*.

**Library**
The library is the collection of modules and tests which compose the comprehensive benchmark. The library will be modular and dynamic, favoring content management.

**Modules**
Modules are collections of tests of a specific criteria of meaning. The idea is, if we want to test the agent's performance in a particular area, say speed, this module will handle that.

**Tests**
A test is a discrete unit of measurement of a specific criteria. If we're testing the speed of the agent, then each test within that module will contribute towards that criteria. The tests will initially be designed as pass/fail, with the hope of increasing the simplicity to start out. However, as mentioned [here](https://softwareandsynapses.substack.com/i/148691710/standardized-testing), there will be plans to increase the granularity of the tests' measurements.
