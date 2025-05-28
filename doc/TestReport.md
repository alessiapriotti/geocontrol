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

## Network
  Bottom-up
  - Step1: NetworkRepository
  - Step2: NetworkRepository + NetworkController + mapperService
  - Step3: NetworkRepository + NetworkController + mapperService + NetworkRoutes
  - Step3: NetworkRepository + NetworkController + mapperService + NetworkRoutes + Network (E2E)

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

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |


## Networks
| TN1: createNetwork() | **NetworkRepository** | Unit | BB/ Eq Partitioning (2) |
| TN2: getNetworkByCode() | **NetworkRepository** | Unit | BB/ Eq Partitioning (2) - BB/ Boundary (1) |
| TN3: getAllNetwork() | **NetworkRepository** | Unit | BB/ Eq Partitioning (2) |
| TN4: updateNetwork() | **NetworkRepository** | Unit | BB/ Eq Partitioning (4) - BB/ Boundary (1) |
| TN5: deleteNetwork() | **NetworkRepository** | Unit | BB/ Eq Partitioning (2) - BB/ Boundary (1) |
| TNC1: createNetwork() | **NetworkController** | Integration | BB/ Eq Partitioning (2) - BB/ Boundary (1) |
| TNC2: getNetwork() | **NetworkController** | Integration | BB/ Eq Partitioning (2) - BB/ Boundary (1) |
| TNC3: getAllNetworks() | **NetworkController** | Integration | BB/ Eq Partitioning (2) |
| TNC4: updateNetwork() | **NetworkController** | Integration | BB/ Eq Partitioning (4) - BB/ Boundary (1) |
| TNC5: deleteNetwork() | **NetworkController** | Integration | BB/ Eq Partitioning (2) - BB/ Boundary (1) |
| TNR1: POST /networks | **NetworkRoutes** | Integration | BB/ Eq Partitioning (4) |
| TNR2: GET /networks/:code | **NetworkRoutes** | Integration | BB/ Eq Partitioning (3) |
| TNR3: GET /networks | **NetworkRoutes** | Integration | BB/ Eq Partitioning (2) |
| TNR4: PATCH /networks/:code | **NetworkRoutes** | Integration | BB/ Eq Partitioning (2) |
| TNR5: DELETE /networks/:code | **NetworkRoutes** | Integration | BB/ Eq Partitioning (2) |
| TNE1: POST /networks | **Network (E2E)** | E2E | BB/ Eq Partitioning (4) |
| TNE2: GET /networks/:code | **Network (E2E)** | E2E | BB/ Eq Partitioning (3) |
| TNE3: GET /networks | **Network (E2E)** | E2E | BB/ Eq Partitioning (2) |
| TNE4: PATCH /networks/:code | **Network (E2E)** | E2E | BB/ Eq Partitioning (4) |
| TNE5: DELETE /networks/:code | **Network (E2E)** | E2E | BB/ Eq Partitioning (4) |

## Gateways
| Test case name | Object(s) tested | Test level | Technique used |
| :------------ | :--------------: | :--------: | :------------: |
| TS1: createGateway() | **GatewayRepository** | Unit | BB/ Eq Partitioning |
| TS2: getAllGateway() | **GatewayRepository** | Unit |BB/ Eq Partitioning |
| TS3: getGatewayByMacAddress() | **GatewayRepository** | Unit | BB/ Eq Partitioning (4), <br>BB/ Boundary (1) |
| TS4: updateGateway() | **GatewayRepository** | Unit | BB/ Eq Partitioning|
| TS5: deleteGateway() | **GatewayRepository** | Unit |BB/ Eq Partitioning (3), <br>BB/ Boundary (1)  |
| TS6: testGatewayExistance() | **GatewayRepository** | Unit |BB/ Eq Partitioning (2), <br>BB/ Boundary (2)  |
| TS1: getAllGateway() | **GatewayController** | Integration |BB/ Eq Partitioning |
| TS2: createGateway() | **GatewayController** | Integration |BB/ Eq Partitioning|
| TS3: getGatewayByMacAddress() | **GatewayController** | Integration | BB/ Eq Partitioning |
| TS4: deleteGateway() | **GatewayController** | Integration |BB/ Eq Partitioning   |
| TS5: updateGateway() | **GatewayController** | Integration |BB/ Eq Partitioning  |
| TS1: getAllGateway() | **GatewayRoutes** | Integration | BB/ Eq Partitioning |
| TS2: createGateway() | **GatewayRoutes** | Integration | BB/ Eq Partitioning  |
| TS3: getGatewayByMacAddress() | **GatewayRoutes** | Integration |BB/ Eq Partitioning  |
| TS4: updateGateway() | **GatewayRoutes** | Integration | BB/ Eq Partitioning |
| TS5: deleteGateway() | **GatewayRoutes** | Integration | BB/ Eq Partitioning |
| TS1: GET /networks/:networkCode/gateways | **Gateway (E2E)** | E2E | BB/ Eq Partitioning (2), <br>BB/ Boundary (1) |
| TS2: POST /networks/:networkCode/gateways | **Gateway (E2E)** | E2E |BB/ Eq Partitioning (6), <br>BB/ Boundary (3)  |
| TS3: GET /networks/:networkCode/gateways/:gatewayMac | **Gateway (E2E)** | E2E | BB/ Eq Partitioning (4), <br>BB/ Boundary (2) |
| TS4: PATCH /networks/:networkCode/gateways/:gatewayMac | **Gateway (E2E)** | E2E | BB/ Eq Partitioning (9), <br>BB/ Boundary (4) |
| TS5: DELETE /networks/:networkCode/gateways/:gatewayMac | **Gateway (E2E)** | E2E |BB/ Eq Partitioning (6), <br>BB/ Boundary (2)  |

## Sensors
| Test case name | Object(s) tested | Test level | Technique used |
| :------------ | :--------------: | :--------: | :------------: |
| TS1: createSensor() | **SensorRepository** | Unit | BB/ Eq Partitioning|
| TS2: getAllSensors() | **SensorRepository** | Unit | BB/ Eq Partitioning (4),<br>BB/ Boundary(2)|
| TS3: getSensorByMacAddress() | **SensorRepository** | Unit |BB/ Eq Partitioning (6), <br> BB/ Boundary (3)|
| TS4: updateSensor() | **SensorRepository** | Unit |BB/ Eq Partitioning |
| TS5: deleteSensor() | **SensorRepository** | Unit |BB/ Eq Partitioning (6), <br>BB/ Boundary (3) |
| TS6: testSensorExistance() | **SensorRepository** | Unit | BB/ Eq Partitioning (2), <br>BB/ Boundary (2) |
| ------------------------ | - | - | - |
| TS1: createSensor() | **sensorController** | Integration | BB/ Eq Partitioning (2), <br>BB/ Boundary (1) |
| TS2: getAllSensors() | **sensorController** | Integration |BB/ Eq Partitioning (4), <br>BB/ Boundary (4)  |
| TS3: getSensorByMacAddress() | **sensorController** | Integration | BB/ Eq Partitioning (6), <br>BB/ Boundary (3) |
| TS4: updateSensor() | **sensorController** | Integration |BB/ Eq Partitioning (5), <br>BB/ Boundary (1)  |
| TS5: deleteSensor() | **sensorController** | Integration | BB/ Eq Partitioning (6), <br>BB/ Boundary (3) |
| ------------------------ | - | - | - |
| TS1: GET /networks/:networkCode/gateways/:gatewayMac/sensors | **sensorRoutes** | API (e2e) |BB/ Eq Partitioning (4), <br>BB/ Boundary (2)  |
| TS2: POST /networks/:networkCode/gateways/:gatewayMac/sensors | **sensorRoutes** | API (e2e) |BB/ Eq Partitioning (5), <br>BB/ Boundary (5)  |
| TS3: GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac | **sensorRoutes** | API (e2e) |BB/ Eq Partitioning (6), <br>BB/ Boundary (5)  |
| TS4: PATCH /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac | **sensorRoutes** | API (e2e) |BB/ Eq Partitioning (8), <br>BB/ Boundary (5)  |
| TS5: DELETE /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac | **sensorRoutes** | API (e2e) |BB/ Eq Partitioning (6), <br>BB/ Boundary (5)  |




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
| FR3.1 Retrieve all networks | NetworkRepository.db.test → TN3: GetAllNetworks <br> NetworkController.integration.test → TNC3: get All Networks <br> NetworkRoutes.integration.test → TNR3: get all networks <br> Network.e2e.test → TNE3: GET all networks |  
| FR3.2 Create a new network | NetworkRepository.db.test → TN1: Create Network <br> NetworkController.integration.test → TNC1: Create Network <br> NetworkRoutes.integration.test → TNR1: create network <br> Network.e2e.test → TNE1: POST create a network |  
| FR3.3 Retrieve a specific network | NetworkRepository.db.test → TN2: Get Network by Code <br> NetworkController.integration.test → TNC2: get Network <br> NetworkRoutes.integration.test → TNR2: get network by code <br> Network.e2e.test → TNE2: GET a network |  
| FR3.4 Update a network | NetworkRepository.db.test → TN4: Update Network <br> NetworkController.integration.test → TNC4: Update Network <br> NetworkRoutes.integration.test → TNR4: update network <br> Network.e2e.test → TNE4: PATCH update a network |  
| FR3.5 Delete a specific network | NetworkRepository.db.test → TN5: Delete Network <br> NetworkController.integration.test → TNC5: Delete Network <br> NetworkRoutes.integration.test → TNR5: delete network <br> Network.e2e.test → TNE5: DELETE a network |  
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
