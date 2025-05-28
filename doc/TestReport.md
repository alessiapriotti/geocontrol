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

  ## Sensors
  Bottom-up

  - Step1: SensorRepository
  - Step2: SensorRepository + SensorController + checkService
  - Step3: SensorRepository + SensorController + checkService + mapperService + SensorRoutes

# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

Sono stati esclusi dalle tabelle i test non scritti da noi.

Tra parentesi vicino ad ogni tecnica è segnato il numero di test case che usano tale tecnica.

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |

## Auth
| Test case name | Object(s) tested | Test level | Technique used |
| :------------ | :--------------: | :--------: | :------------: |
| TS1: authenticateUser() | **authMiddleware** | Unit | WB/ coverage (4) |
| TS1: getToken() | **authController** | Integration | WB/ coverage (3) |
| TS1: GET /auth | **AuthRoutes** | e2e | WB/ coverage (3) |

## Users
| Test case name | Object(s) tested | Test level | Technique used |
| :------------ | :--------------: | :--------: | :------------: |
| TS1: createUser() | **userController** | Integration | WB/ coverage (2) |
| TS2: deleteUser() | **userController** | Integration | WB/ coverage (2) |
| TS1: GET /users | **UserRoutes** | e2e | WB/ coverage (5) |
| TS2: POST /users | **UserRoutes** | e2e | WB/ coverage (2) |
| TS3: GET /users/:userName | **UserRoutes** | e2e | WB/ coverage (2) |
| TS4: DELETE /users/:userName | **UserRoutes** | e2e | WB/ coverage (2) |

## Sensors
| Test case name | Object(s) tested | Test level | Technique used |
| :------------ | :--------------: | :--------: | :------------: |
| TS1: createSensor() | **SensorRepository** | Unit | |
| T1.1: All valid params | | | BB/ Eq Partitioning |
| T1.2: Error if sensor with same MAC exists | | | BB/ Eq Partitioning |
| TS2: getAllSensors() | **SensorRepository** | Unit | |
| T2.1: All valid params | | | BB/ Eq Partitioning |
| T2.2: Gateway not found | | | BB/ Eq Partitioning |
| T2.3: Gateway not bound to passed network | | | BB/ Eq Partitioning |
| T2.4: Network not found | | | BB/ Eq Partitioning |
| T2.5: Invalid Gateway MAC (empty string) | | | BB/ Boundary |
| T2.6: Invalid Network Code (empty string) | | | BB/ Boundary |
| TS3: getSensorByMacAddress() | **SensorRepository** | Unit | |
| T3.1: All valid params | | | BB/ Eq Partitioning |
| T3.2: Invalid Sensor MAC | | | BB/ Eq Partitioning |
| T3.3: Sensor MAC not bound to passed gateway | | | BB/ Eq Partitioning |
| T3.4: Invalid Sensor MAC (empty string) | | | BB/ Boundary |
| T3.5: Invalid Gateway MAC | | | BB/ Eq Partitioning |
| T3.6: Gateway not bound to passed network | | | BB/ Eq Partitioning |
| T3.7: Invalid Gateway MAC (empty string) | | | BB/ Boundary |
| T3.8: Invalid Network Code | | | BB/ Eq Partitioning |
| T3.9: Invalid Network Code (empty string) | | | BB/ Boundary |
| TS4: updateSensor() | **SensorRepository** | Unit | |
| T4.1: All valid params | | | BB/ Eq Partitioning |
| T4.2: No MAC address change (undefined) | | | BB/ Eq Partitioning |
| T4.3: No MAC address change (NEW_MAC == MAC) | | | BB/ Eq Partitioning |
| T4.4: MAC address change to create conflict | | | BB/ Eq Partitioning |
| TS5: deleteSensor() | **SensorRepository** | Unit | |
| T5.1: All valid params | | | BB/ Eq Partitioning |
| T5.2: Invalid Sensor MAC | | | BB/ Eq Partitioning |
| T5.3: Sensor MAC not bound to passed gateway | | | BB/ Eq Partitioning |
| T5.4: Invalid Sensor MAC (empty string) | | | BB/ Boundary |
| T5.5: Invalid Gateway MAC | | | BB/ Eq Partitioning |
| T5.6: Gateway not bound to passed network | | | BB/ Eq Partitioning |
| T5.7: Invalid Gateway MAC (empty string) | | | BB/ Boundary |
| T5.8: Invalid Network Code | | | BB/ Eq Partitioning |
| T5.9: Invalid Network Code (empty string) | | | BB/ Boundary |
| TS6: testSensorExistance() | **SensorRepository** | Unit | |
| T6.1: Sensor MAC already used | | | BB/ Eq Partitioning |
| T6.2: Sensor MAC unused | | | BB/ Eq Partitioning |
| T6.3: Invalid MAC (empty string) | | | BB/ Boundary |
| T6.4: Invalid MAC (null) | | | BB/ Boundary |
| ------------------------ | - | - | - |
| TS1: createSensor() | **sensorController** | Integration | |
| T1.1: All valid params | | | BB/ Eq Partitioning |
| T1.2: Error if sensor with same MAC exists | | | BB/ Eq Partitioning |
| T1.3: Invalid MAC (null) | | | BB/ Boundary |
| TS2: getAllSensors() | **sensorController** | Integration | |
| T2.1: All valid params | | | BB/ Eq Partitioning |
| T2.2: Gateway not found | | | BB/ Eq Partitioning |
| T2.3: Gateway not bound to passed network | | | BB/ Eq Partitioning |
| T2.4: Network not found | | | BB/ Eq Partitioning |
| T2.5: Invalid Gateway MAC (empty string) | | | BB/ Boundary |
| T2.6: Invalid Network Code (empty string) | | | BB/ Boundary |
| T2.7: Null Gateway MAC | | | BB/ Boundary |
| T2.8: Null Network Code | | | BB/ Boundary |
| TS3: getSensorByMacAddress() | **sensorController** | Integration | |
| T3.1: All valid params | | | BB/ Eq Partitioning |
| T3.2: Invalid Sensor MAC | | | BB/ Eq Partitioning |
| T3.3: Sensor MAC not bound to passed gateway | | | BB/ Eq Partitioning |
| T3.4: Invalid Sensor MAC (empty string) | | | BB/ Boundary |
| T3.6: Invalid Gateway MAC | | | BB/ Eq Partitioning |
| T3.7: Gateway not bound to passed network | | | BB/ Eq Partitioning |
| T3.8: Invalid Gateway MAC (empty string) | | | BB/ Boundary |
| T3.10: Invalid Network Code | | | BB/ Eq Partitioning |
| T3.11: Invalid Network Code (empty string) | | | BB/ Boundary |
| TS4: updateSensor() | **sensorController** | Integration | |
| T4.1: All valid params | | | BB/ Eq Partitioning |
| T4.3: No MAC address change (undefined) | | | BB/ Eq Partitioning |
| T4.4: No MAC address change (NEW_MAC == MAC) | | | BB/ Eq Partitioning |
| T4.5: MAC address change to create conflict | | | BB/ Eq Partitioning |
| T4.9: Invalid Sensor MAC | | | BB/ Eq Partitioning |
| T4.10: Invalid Sensor MAC (empty string) | | | BB/ Boundary |
| TS5: deleteSensor() | **sensorController** | Integration | |
| T5.1: All valid params | | | BB/ Eq Partitioning |
| T5.2: Invalid Sensor MAC | | | BB/ Eq Partitioning |
| T5.3: Sensor MAC not bound to passed gateway | | | BB/ Eq Partitioning |
| T5.4: Invalid Sensor MAC (empty string) | | | BB/ Boundary |
| T5.6: Invalid Gateway MAC | | | BB/ Eq Partitioning |
| T5.7: Gateway not bound to passed network | | | BB/ Eq Partitioning |
| T5.8: Invalid Gateway MAC (empty string) | | | BB/ Boundary |
| T5.10: Invalid Network Code | | | BB/ Eq Partitioning |
| T5.11: Invalid Network Code (empty string) | | | BB/ Boundary |
| ------------------------ | - | - | - |
| TS1: GET /networks/:networkCode/gateways/:gatewayMac/sensors | **sensorRoutes** | API (e2e) | |
| T1.1: All valid params | | | BB/ Eq Partitioning |
| T1.2: Gateway not found | | | BB/ Eq Partitioning |
| T1.3: Gateway not bound to passed network | | | BB/ Eq Partitioning |
| T1.4: Network not found | | | BB/ Eq Partitioning |
| T1.5: Null Gateway MAC | | | BB/ Boundary |
| T1.6: Null Network Code | | | BB/ Boundary |
| TS2: POST /networks/:networkCode/gateways/:gatewayMac/sensors | **sensorRoutes** | API (e2e) | |
| T2.1: All valid params | | | BB/ Eq Partitioning |
| T2.2: Error if sensor with same MAC exists | | | BB/ Eq Partitioning |
| T2.3: Invalid MAC (empty string) | | | BB/ Boundary |
| T2.4: Invalid MAC (spaces only) | | | BB/ Boundary |
| T2.5: Invalid MAC (null) | | | BB/ Boundary |
| T2.6: Valid MAC, name with spaces | | | BB/ Eq Partitioning |
| T2.7: Invalid Network Code | | | BB/ Eq Partitioning |
| T2.8: Invalid Gateway MAC | | | BB/ Eq Partitioning |
| T2.9: Invalid token | | | BB/ Security |
| T2.10: Insufficient permissions | | | BB/ Security |
| TS3: GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac | **sensorRoutes** | API (e2e) | |
| T3.1: All valid params | | | BB/ Eq Partitioning |
| T3.2: Invalid Sensor MAC | | | BB/ Eq Partitioning |
| T3.3: Sensor MAC not bound to passed gateway | | | BB/ Eq Partitioning |
| T3.4: Null Sensor MAC | | | BB/ Boundary |
| T3.5: Invalid Gateway MAC | | | BB/ Eq Partitioning |
| T3.6: Gateway not bound to passed network | | | BB/ Eq Partitioning |
| T3.7: Invalid Gateway MAC (empty string) | | | BB/ Boundary |
| T3.8: Null Gateway MAC | | | BB/ Boundary |
| T3.9: Invalid Network Code | | | BB/ Eq Partitioning |
| T3.10: Invalid Network Code (empty string) | | | BB/ Boundary |
| T3.11: Null Network Code | | | BB/ Boundary |
| TS4: PATCH /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac | **sensorRoutes** | API (e2e) | |
| T4.1: All valid params | | | BB/ Eq Partitioning |
| T4.2: Optional params with spaces | | | BB/ Eq Partitioning |
| T4.3: No MAC address change (undefined) | | | BB/ Eq Partitioning |
| T4.4: No MAC address change (NEW_MAC == MAC) | | | BB/ Eq Partitioning |
| T4.5: MAC address change to create conflict | | | BB/ Eq Partitioning |
| T4.6: MAC address change to empty string | | | BB/ Boundary |
| T4.7: MAC address change to only spaces | | | BB/ Boundary |
| T4.8: MAC address change to null | | | BB/ Boundary |
| T4.9: Invalid Sensor MAC | | | BB/ Eq Partitioning |
| T4.10: Invalid Sensor MAC (null) | | | BB/ Boundary |
| T4.11: Invalid Gateway MAC | | | BB/ Eq Partitioning |
| T4.12: Invalid Network Code | | | BB/ Eq Partitioning |
| T2.9: Invalid token | | | BB/ Security |
| T2.10: Insufficient permissions | | | BB/ Security |
| TS5: DELETE /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac | **sensorRoutes** | API (e2e) | |
| T5.1: All valid params | | | BB/ Eq Partitioning |
| T5.2: Invalid Sensor MAC | | | BB/ Eq Partitioning |
| T5.3: Sensor MAC not bound to passed gateway | | | BB/ Eq Partitioning |
| T5.4: Invalid Sensor MAC (null) | | | BB/ Boundary |
| T5.5: Invalid Gateway MAC | | | BB/ Eq Partitioning |
| T5.6: Gateway not bound to passed network | | | BB/ Eq Partitioning |
| T5.7: Invalid Gateway MAC (null) | | | BB/ Boundary |
| T5.8: Invalid Network Code | | | BB/ Eq Partitioning |
| T5.9: Invalid Network Code (null) | | | BB/ Boundary |
| T5.10: Invalid token | | | BB/ Security |
| T5.11: Insufficient permissions | | | BB/ Security |


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

| Functional Requirement or scenario | Test(s) |
|------------------------------------|---------|
| *FR1 Authentication* |         |
| FR1.1 Authenticate user | AuthController.integration.test → TS1: AuthController big-bang integration |  
| *FR2 Manage users* |  |
| FR2.1 Retrieve all users | UserRepository.db.test → TS1: getAllUsers <br> UserRepository.mock.test → TS1: getAllUsers <br> UserRoutes.integration.test → TS1: get all users <br> Users.e2e.test → T1: GET all users |  
| FR2.2 Create a new user | UserRepository.db.test → TS2: createUser <br> UserRepository.mock.test → TS2: createUser <br> UserController2.integration.test → TS1: createUser() <br> Users.e2e.test → T2: POST create a user |  
| FR2.3 Retrieve a specific user | UserRepository.db.test → TS3: getUserByUsername <br> UserRepository.mock.test → TS3: getUserByUsername <br> UserController.integration.test → TS1: getUser <br> Users.e2e.test → T3: GET a user |  
| FR2.4 Delete a specific user | UserRepository.db.test → TS4: deleteUser <br> UserRepository.mock.test → TS4: deleteUser <br> UserController2.integration.test → TS2: deleteUser() <br> Users.e2e.test → T4: DELETE a user|  
| *FR3 Manage networks* |  |
| FR3.1 Retrieve all networks | NetworkRepository.db.test → TNR3: GetAllNetworks <br> NetworkController.integration.test → TNC3: get All Networks <br> NetworkRoutes.integration.test → get all networks <br> Network.e2e.test → TNE3: GET all networks |  
| FR3.2 Create a new network | NetworkRepository.db.test → TNR1: Create Network <br> NetworkController.integration.test → TNC1: Create Network <br> NetworkRoutes.integration.test → create network <br> Network.e2e.test → TNE1: POST create a network |  
| FR3.3 Retrieve a specific network | NetworkRepository.db.test → TNR2: Get Network by Code <br> NetworkController.integration.test → TNC2: get Network <br> NetworkRoutes.integration.test → get network by code <br> Network.e2e.test → TNE2: GET a network |  
| FR3.4 Update a network | NetworkRepository.db.test → TNR4: Update Network <br> NetworkController.integration.test → TNC4: Update Network <br> NetworkRoutes.integration.test → update network <br> Network.e2e.test → TNE4: PATCH update a network |  
| FR3.5 Delete a specific network | NetworkRepository.db.test → TNR5: Delete Network <br> NetworkController.integration.test → TNC5: Delete Network <br> NetworkRoutes.integration.test → delete network <br> Network.e2e.test → TNE5: DELETE a network |  
| *FR4 Manage gateways* |  |
| FR4.1 Retrieve all gateways of a network | GatewayRepository.db.test → TS2: getAllGateway() <br> GatewayController.integration.repo.test.ts → TS1: getAllGateway() <br> GatewayController.integration.mapper.test → TS1: getAllGateway() <br> GatewayController.integration.check.test → TS1: getAllGateway() <br> GatewayRoutes.integration.test → TS1: getAllGateway() <br> Gateways.e2e.test → TS1: GET all gateways |  
| FR4.2 Create a new gateway for a network | GatewayRepository.db.test → TS1: createGateway() <br> GatewayRepository.db.test → TS6: testGatewayExistance() <br> GatewayController.integration.repo.test.ts → TS2: createGateway() <br> GatewayController.integration.mapper.test → TS2: createGateway() <br> GatewayController.integration.check.test → TS2: createGateway() <br> GatewayRoutes.integration.test → TS2: createGateway() <br> Gateways.e2e.test → TS2: POST create a gateway |  
| FR4.3 Retrieve a specific gateway | GatewayRepository.db.test → TS3: getGatewayByMacAddress() <br> GatewayController.integration.repo.test.ts → TS3: getGatewayByMacAddress() <br> GatewayController.integration.mapper.test → TS3: getGatewayByMacAddress() <br> GatewayController.integration.check.test → TS3: getGatewayByMacAddress() <br> GatewayRoutes.integration.test → TS3: getGatewayByMacAddress() <br> Gateways.e2e.test → TS3: GET a gateway |  
| FR4.4 Update a gateway | GatewayRepository.db.test → TS4: updateGateway() <br> GatewayRepository.db.test → TS6: testGatewayExistance() <br> GatewayController.integration.repo.test.ts → TS5: updateGateway() <br> GatewayController.integration.mapper.test → TS4: updateGateway() <br> GatewayController.integration.check.test → TS4: updateGateway() <br> GatewayRoutes.integration.test → TS4: updateGateway() <br> Gateways.e2e.test → TS4: PATCH a gateway |  
| FR4.5 Delete a specific gateway | GatewayRepository.db.test → TS5: deleteGateway() <br> GatewayController.integration.repo.test.ts → TS4: deleteGateway() <br> GatewayController.integration.mapper.test → TS5: deleteGateway() <br> GatewayController.integration.check.test → TS5: deleteGateway() <br> GatewayRoutes.integration.test → TS5: deleteGateway() <br> Gateways.e2e.test → TS5: DELETE a gateway |  
| *FR5 Manage sensors* |  |
| FR5.1 Retrieve all sensors of a gateway | SensorRepository.db.test → TS2: getAllSensors() <br> SensorController.integration.test → TS2: getAllSensors() <br> Sensors.e2e.test → TS1: GET all sensors |  
| FR5.2 Create a new sensor for a gateway | SensorRepository.db.test → TS1: createSensor() <br> SensorRepository.db.test → TS6: testSensorExistance() <br> SensorController.integration.test → TS1: createSensor() <br> Sensors.e2e.test → TS2: POST create a sensor |  
| FR5.3 Retrieve a specific sensor | SensorRepository.db.test → TS3: getSensorByMacAddress() <br> SensorController.integration.test → TS3: getSensorByMacAddress() <br> Sensors.e2e.test → TS3: GET a sensor |  
| FR5.4 Update a sensor | SensorRepository.db.test → TS4: updateSensor() <br> SensorRepository.db.test → TS6: testSensorExistance() <br> SensorController.integration.test → TS4: updateSensor() <br> Sensors.e2e.test → TS4: PATCH a sensor |  
| FR5.5 Delete a specific sensor | SensorRepository.db.test → TS5: deleteSensor() <br> SensorController.integration.test → TS5: deleteSensor() <br> Sensors.e2e.test → TS5: DELETE a sensor |  
| *FR6 Manage measurements* |         |
| FR6.1 Retrieve measurements for a set of sensors of a specific network |         |
| FR6.2 Retrieve statistics for a set of sensors of a specific network |         |
| FR6.3 Retrieve outliers for a set of sensors of a specific network |         |
| FR6.4 Store measurements for a specific sensor |         |
| FR6.5 Retrieve measurements for a specific sensor |         |
| FR6.6 Retrieve statistics for a specific sensor |         |
| FR6.7 Retrieve outliers for a specific sensor |         |


## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage
