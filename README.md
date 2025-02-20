# k6-load-test-playground

## Prerequisites
- Install [k6](https://k6.io/docs/getting-started/installation/)

💡 The devcontainer included in this repository has K6 installed.

## How to Run
1. Clone the repository:
    ```sh
    git clone https://github.com/julioalex-rezende/k6-load-test-playground.git
    ```
2. Navigate to the project directory:
    ```sh
    cd k6-load-test-playground
    ```
3. Run the tests:
    ```sh
    k6 run load-testing/loadTests.js
    ```

## Explanation of Tests

The `load-testing/loadTests.js` file contains multiple test scenarios to evaluate the performance of the API under different conditions. Below is a detailed explanation of each test scenario:

### Load Test
- **Scenario Name**: `load_test`
- **Description**: Simulates a steady load on the API to measure its performance under normal conditions.
- **Stages**:
  - Ramp up to 20 requests per second over 15 seconds.
  - Maintain 20 requests per second for 4 minutes.
  - Ramp down to 0 requests per second over 15 seconds.
- **Thresholds**:
  - 90% of requests should complete within 500ms.
  - 95% of requests should complete within 600ms.
  - 99% of requests should complete within 1 second.
  - Less than 1% of requests should fail.

### Stress Test
- **Scenario Name**: `stress_test`
- **Description**: Gradually increases the load to find the breaking point of the API.
- **Stages**:
  - Ramp up to 5 requests per second over 30 seconds.
  - Maintain 5 requests per second for 1 minute.
  - Ramp up to 20 requests per second over 30 seconds.
  - Maintain 20 requests per second for 1 minute.
  - Ramp up to 40 requests per second over 30 seconds.
  - Maintain 40 requests per second for 1 minute.
  - Ramp down to 0 requests per second over 30 seconds.
- **Thresholds**:
  - 90% of requests should complete within 500ms.
  - 95% of requests should complete within 600ms.
  - 99% of requests should complete within 1 second.
  - Less than 1% of requests should fail.

### Spike Test
- **Scenario Name**: `spike_test`
- **Description**: Tests the API's ability to handle sudden spikes in traffic.
- **Stages**:
  - Quickly ramp up to 40 requests per second over 5 seconds.
  - Maintain 40 requests per second for 1 minute.
  - Quickly ramp down to 0 requests per second over 5 seconds.
- **Thresholds**:
  - 90% of requests should complete within 500ms.
  - 95% of requests should complete within 600ms.
  - 99% of requests should complete within 1 second.
  - Less than 1% of requests should fail.

### Stress Test with VUs
- **Scenario Name**: `stress_test_vus`
- **Description**: Gradually increases the number of virtual users to find the breaking point of the API.
- **Stages**:
  - Ramp up to 5 virtual users over 30 seconds.
  - Maintain 5 virtual users for 1 minute.
  - Ramp up to 20 virtual users over 30 seconds.
  - Maintain 20 virtual users for 1 minute.
  - Ramp up to 40 virtual users over 30 seconds.
  - Maintain 40 virtual users for 1 minute.
  - Ramp down to 0 virtual users over 30 seconds.
- **Thresholds**:
  - 90% of requests should complete within 500ms.
  - 95% of requests should complete within 600ms.
  - 99% of requests should complete within 1 second.
  - Less than 1% of requests should fail.

## Additional Resources
- [k6 Documentation](https://k6.io/docs/)
- [k6 Scripting API](https://k6.io/docs/javascript-api/)
- [k6 Examples](https://k6.io/docs/examples/)

## Contributing
Feel free to open issues or submit pull requests for improvements or bug fixes.

## License
This project is licensed under the MIT License.