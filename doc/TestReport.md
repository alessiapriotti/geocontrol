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

  ## Sensors
  Bottom-up

  - Step1: SensorRepository
  - Step2: SensorRepository + SensorController + checkService
  - Step3: SensorRepository + SensorController + checkService + mapperService + SensorRoutes

# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |

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

# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FRx                 |         |
|                FRy                 |         |
|                ...                 |         |

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage
