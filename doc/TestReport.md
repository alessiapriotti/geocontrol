# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph

  ![dependency-graph](diagrams/dependency_graph.svg)

# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence

    (ex: step1: unit A, step 2: unit A+B, step 3: unit A+B+C, etc)>

    <Some steps may  correspond to unit testing (ex step1 in ex above)>

    <One step will  correspond to API testing, or testing unit route.js>



  ## Gateways
  Bottom-up

  - Step1: GatewayRepository (unit testing)
  - Step2: GatewayRepository + GatewayController
  - Step3: GatewayRepository + GatewayController + mapperService
  - Step4: GatewayRepository + GatewayController + mapperService + checkService
  - Step5: GatewayRepository + GatewayController + mapperService + checkService + GatewayRoutes


# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|                |                  |            |                |


## Gateways
| Test case name | Object(s) tested | Test level | Technique used |
| :------------ | :--------------: | :--------: | :------------: |
| TS1: createGateway() | **GatewayRepository** | Unit | |
| T1.1: All valid params | | | BB/ Eq Partitioning |
| T1.2: Error if gateway with same MAC exists | | | BB/ Eq Partitioning |
| TS2: getAllGateway() | **GatewayRepository** | Unit | |
| T2.1: All valid params, right length of output | | | BB/ Eq Partitioning |
| TS3: getGatewayByMacAddress() | **GatewayRepository** | Unit | |
| T3.1: All valid params, find gateway by macAddress | | | BB/ Eq Partitioning |
| T3.2: Find gateway by macAddress: no gateways for that network | | | BB/ Eq Partitioning |
| T3.3: Find gateway by macAddress: invalid gateway mac | | | BB/ Eq Partitioning |
| T3.4: Find gateway by macAddress: gateway mac not bound to passed network | | | BB/ Eq Partitioning |
| T3.5: Find gateway by macAddress: invalid gateway mac (empty string) | | | BB/ Boundary |
| TS4: updateGateway() | **GatewayRepository** | Unit | |
| T4.1: Update gateway when valid MAC is provided | | | BB/ Eq Partitioning |
| T4.2: Update only provided fields and keep others unchanged | | | BB/ Eq Partitioning |
| TS5: deleteGateway() | **GatewayRepository** | Unit | |
| T5.1: Delete gateway with mac provided | | | BB/ Eq Partitioning |
| T5.2: Delete gateway with mac provided: not found | | | BB/ Eq Partitioning |
| T5.3: Delete gateway: gateway mac not bound to passed network | | | BB/ Eq Partitioning |
| T5.4: Delete gateway: invalid gateway mac (empty string) | | | BB/ Boundary |
| TS6: testGatewayExistance() | **GatewayRepository** | Unit | |
| T6.1: MacAddress Gateway: conflict | | | BB/ Eq Partitioning |
| T6.2: MacAddress Gateway: not in use | | | BB/ Eq Partitioning |
| T6.3: MacAddress Gateway: Invalid MAC (empty string) | | | BB/ Boundary |
| T6.4: MacAddress Gateway: Invalid MAC (null) | | | BB/ Boundary |
| TS1: getAllGateway() | **GatewayController** | Integration | |
| T1.1: Return all gateways mapped to DTO | | | BB/ Eq Partitioning |
| T1.2: Throw NotFoundError if network does not exist | | | BB/ Eq Partitioning |
| TS2: createGateway() | **GatewayController** | Integration | |
| T2.1: ConflictError if MAC already in use | | | BB/ Eq Partitioning |
| T2.2: Throw NotFoundError if network does not exist | | | BB/ Eq Partitioning |
| T2.3: Create a gateway successfully | | | BB/ Eq Partitioning |
| TS3: getGatewayByMacAddress() | **GatewayController** | Integration | |
| T3.1: Return the correct gateway mapped to DTO | | | BB/ Eq Partitioning |
| T3.2: NotFoundError if gateway does not exist | | | BB/ Eq Partitioning |
| T3.3: NotFoundError if network does not exist | | | BB/ Eq Partitioning |
| TS4: deleteGateway() | **GatewayController** | Integration | |
| T4.1: Gateway deleted correctly | | | BB/ Eq Partitioning |
| T4.2: NotFoundError if gateway does not exist | | | BB/ Eq Partitioning |
| T4.3: NotFoundError if network does not exist | | | BB/ Eq Partitioning |
| TS5: updateGateway() | **GatewayController** | Integration | |
| T5.1: ConflictError if new MAC already in use | | | BB/ Eq Partitioning |
| T5.2: NotFoundError if network does not exist | | | BB/ Eq Partitioning |
| T5.3: Update a gateway successfully | | | BB/ Eq Partitioning |
| T5.4: Update a gateway with partial information successfully | | | BB/ Eq Partitioning |
| T5.5: Update a gateway with same MAC as before | | | BB/ Eq Partitioning |
| TS1: getAllGateway() | **GatewayRoutes** | Integration | |
| T1.1: Get all gateways | | | BB/ Eq Partitioning |
| T1.2: Get all gateways - 401 UnauthorizedError | | | BB/ Eq Partitioning |
| T1.3: Get all gateways - 404 Network not found | | | BB/ Eq Partitioning |
| TS2: createGateway() | **GatewayRoutes** | Integration | |
| T2.1: Create a gateway successfully | | | BB/ Eq Partitioning |
| T2.2: Create a gateway - 401 UnauthorizedError | | | BB/ Eq Partitioning |
| T2.3: Create a gateway - 404 Network not found | | | BB/ Eq Partitioning |
| T2.4: Create a gateway - 403 InsufficientRightsError | | | BB/ Eq Partitioning |
| T2.5: Create a gateway - 409 Gateway mac address already in use | | | BB/ Eq Partitioning |
| TS3: getGatewayByMacAddress() | **GatewayRoutes** | Integration | |
| T3.1: Get a specific gateway | | | BB/ Eq Partitioning |
| T3.2: Get a specific gateway - 401 UnauthorizedError | | | BB/ Eq Partitioning |
| T3.3: Get a specific gateway - 404 Network/Gateway not found | | | BB/ Eq Partitioning |
| TS4: updateGateway() | **GatewayRoutes** | Integration | |
| T4.1: Update a gateway successfully | | | BB/ Eq Partitioning |
| T4.2: Update a gateway - 401 UnauthorizedError | | | BB/ Eq Partitioning |
| T4.3: Update a gateway - 404 Network/Gateway not found | | | BB/ Eq Partitioning |
| T4.4: Update a gateway - 403 InsufficientRightsError | | | BB/ Eq Partitioning |
| T4.5: Update a gateway - 409 ConflictError, Mac address already in use | | | BB/ Eq Partitioning |
| TS5: deleteGateway() | **GatewayRoutes** | Integration | |
| T5.1: Delete a gateway successfully | | | BB/ Eq Partitioning |
| T5.2: Delete a gateway - 401 UnauthorizedError | | | BB/ Eq Partitioning |
| T5.3: Delete a gateway - 404 Network/Gateway not found | | | BB/ Eq Partitioning |
| T5.4: Delete a gateway - 403 InsufficientRightsError | | | BB/ Eq Partitioning |
| TS1: GET /networks/:networkCode/gateways | **Gateway (E2E)** | E2E | |
| T1.1: All valid params | | | BB/ Eq Partitioning |
| T1.2: Network not found | | | BB/ Eq Partitioning |
| T1.3: Null Networkcode | | | BB/ Boundary |
| TS2: POST /networks/:networkCode/gateways | **Gateway (E2E)** | E2E | |
| T2.1: All valid params | | | BB/ Eq Partitioning |
| T2.2: Error if gateway with same GAT exists | | | BB/ Eq Partitioning |
| T2.3: Invalid GAT (empty string) | | | BB/ Boundary |
| T2.4: Invalid GAT (spaces only) | | | BB/ Boundary |
| T2.5: Invalid GAT (null) | | | BB/ Boundary |
| T2.6: Valid GAT, name with spaces | | | BB/ Eq Partitioning |
| T2.7: Invalid Network Code | | | BB/ Eq Partitioning |
| T2.8: Invalid token | | | BB/ Eq Partitioning |
| T2.9: Insufficient permissions | | | BB/ Eq Partitioning |
| TS3: GET /networks/:networkCode/gateways/:gatewayMac | **Gateway (E2E)** | E2E | |
| T3.1: All valid params | | | BB/ Eq Partitioning |
| T3.2: Invalid Gateway mac | | | BB/ Eq Partitioning |
| T3.3: Gateway mac not bound to passed network | | | BB/ Eq Partitioning |
| T3.4: Null Gateway mac | | | BB/ Boundary |
| T3.5: Invalid Network Code | | | BB/ Eq Partitioning |
| T3.6: Null Network Code | | | BB/ Boundary |
| TS4: PATCH /networks/:networkCode/gateways/:gatewayMac | **Gateway (E2E)** | E2E | |
| T4.1: All valid params | | | BB/ Eq Partitioning |
| T4.2: Optional params with spaces | | | BB/ Eq Partitioning |
| T4.3: No mac address change (undefined) | | | BB/ Eq Partitioning |
| T4.4: No mac address change (NEW_MAC == GAT) | | | BB/ Eq Partitioning |
| T4.5: mac address change to create conflict | | | BB/ Eq Partitioning |
| T4.6: mac address change to empty string | | | BB/ Boundary |
| T4.7: mac address change to only spaces | | | BB/ Boundary |
| T4.8: mac address change to null | | | BB/ Boundary |
| T4.9: Invalid Gateway mac | | | BB/ Eq Partitioning |
| T4.10: Invalid Gateway mac (null) | | | BB/ Boundary |
| T4.11: Invalid Network Code | | | BB/ Eq Partitioning |
| T4.12: Invalid token | | | BB/ Eq Partitioning |
| T4.13: Insufficient permissions | | | BB/ Eq Partitioning |
| TS5: DELETE /networks/:networkCode/gateways/:gatewayMac | **Gateway (E2E)** | E2E | |
| T5.1: All valid params | | | BB/ Eq Partitioning |
| T5.2: Invalid Gateway mac | | | BB/ Eq Partitioning |
| T5.3: Gateway mac not bound to passed network | | | BB/ Eq Partitioning |
| T5.4: Invalid Gateway mac (null) | | | BB/ Boundary |
| T5.5: Invalid Network Code | | | BB/ Eq Partitioning |
| T5.6: Invalid Network Code (null) | | | BB/ Boundary |
| T5.7: Invalid token | | | BB/ Eq Partitioning |
| T5.8: Insufficient permissions | | | BB/ Eq Partitioning |

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FRx                 |         |
|                FRy                 |         |
|                ...                 |         |

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage
