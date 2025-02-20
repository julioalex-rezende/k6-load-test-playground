import { check, sleep } from 'k6';
import http from 'k6/http';

const SMALL_LOAD = 5;
const AVERAGE_LOAD = 20;
const HIGH_LOAD = 40; 

/* Options
Global options for your script
  - stages - Ramping pattern
  - thresholds - pass/fail criteria for the test
*/
export let options = {
    scenarios: {
        load_test: {
            tags: { test_type: 'load_test' },
            executor: 'ramping-arrival-rate',
            exec: 'runPerformanceTests',
            preAllocatedVUs: AVERAGE_LOAD,
            startRate: 2, // starts with 2 requests per minute 
            timeUnit: '1s',
            stages: [
                { target: AVERAGE_LOAD, duration: '15s' }, // ramp up to AVERAGE_LOAD requests
                { target: AVERAGE_LOAD, duration: '4m' },  // stay at AVERAGE_LOAD requests for some time
                { target: 0, duration: '15s' },            // ramp down to 0 requests
            ],
        },
        stress_test: {
            tags: { test_type: 'stress_test' },
            executor: 'ramping-arrival-rate',
            exec: 'runPerformanceTests',
            preAllocatedVUs: HIGH_LOAD,
            startRate: 2,
            timeUnit: '1s',
            stages: [
                { target: SMALL_LOAD, duration: '30s' },   // ramp up to SMALL_LOAD requests
                { target: SMALL_LOAD, duration: '1m' },   // stay at SMALL_LOAD requests for some time
                { target: AVERAGE_LOAD, duration: '30s' }, // ramp up to AVERAGE_LOAD requests
                { target: AVERAGE_LOAD, duration: '1m' },  // stay at AVERAGE_LOAD requests for some time
                { target: HIGH_LOAD, duration: '30s' },    // rump up to HIGH_LOAD requests
                { target: HIGH_LOAD, duration: '1m' },     // stay at HIGH_LOAD requests for some time
                { target: 0, duration: '30s' },            // ramp down to 0 users
            ],
        },
        spike_test: {
            tags: { test_type: 'spike_test' },
            executor: 'ramping-arrival-rate',
            exec: 'runPerformanceTests',
            preAllocatedVUs: HIGH_LOAD,
            startRate: 2,
            timeUnit: '1s',
            stages: [
                { target: HIGH_LOAD, duration: '5s' }, // quickly ramp up to HIGH_LOAD requests
                { target: HIGH_LOAD, duration: '1m' }, // stay at HIGH_LOAD requests for some time
                { target: 0, duration: '5s' },         // quickly ramp down to 0 users
            ],
        },
        stress_test_vus: {
            tags: { test_type: 'stress_test_vus' },
            executor: 'ramping-vus',
            exec: 'runPerformanceTests',
            startVUs: 1,
            stages: [
                { target: SMALL_LOAD, duration: '30s' },   // ramp up to SMALL_LOAD of users
                { target: SMALL_LOAD, duration: '1m' },   // stay at SMALL_LOAD of users for some time
                { target: AVERAGE_LOAD, duration: '30s' }, // ramp up to AVERAGE_LOAD of users
                { target: AVERAGE_LOAD, duration: '1m' },  // stay at AVERAGE_LOAD of users for some time
                { target: HIGH_LOAD, duration: '30s' },    // rump up to HIGH_LOAD of users
                { target: HIGH_LOAD, duration: '1m' },     // stay at HIGH_LOAD of users for some time
                { target: 0, duration: '30s' },            // ramp down to 0 users
            ],
        },
    },
    thresholds: {
        // load_test scenario
        "http_req_duration{test_type:load_test}": [
            "p(90) < 500",  // 90% under 500ms,
            "p(95) < 600",  // 95% under 600ms,
            "p(99) < 1000"], // 99% under 1s
        "http_req_failed{test_type:load_test}": ["rate<0.01"], // http errors should be less than 1%

        // stress_test scenario
        "http_req_duration{test_type:stress_test}": [
            "p(90) < 500",  // 90% under 500ms,
            "p(95) < 600",  // 95% under 600ms,
            "p(99) < 1000"], // 99% under 1s
        "http_req_failed{test_type:stress_test}": ["rate<0.01"], // http errors should be less than 1%

        // spike_test scenario
        "http_req_duration{test_type:spike_test}": [
            "p(90) < 500",  // 90% under 500ms,
            "p(95) < 600",  // 95% under 600ms,
            "p(99) < 1000"], // 99% under 1s
        "http_req_failed{test_type:spike_test}": ["rate<0.01"], // http errors should be less than 1%

        // stress_test_vus scenario
        "http_req_duration{test_type:stress_test_vus}": [
            "p(90) < 50",  // 90% under 500ms,
            "p(95) < 600",  // 95% under 600ms,
            "p(99) < 1000"], // 99% under 1s
        "http_req_failed{test_type:stress_test_vus}": ["rate<0.01"], // http errors should be less than 1%
    },
};

/**
* Setup function: Called before the test starts
* Prepares the test environment (e.g. logging in, setting up data, etc.)
*/
export function setup() {
    console.log('Setting up payloads...');
    const payload = {};

    console.log('Setting up URL...');
    const url = 'https://test-api.k6.io';

    return {
        url: url,
        payload: payload,
    };
}

export function runPerformanceTests(data) {

    // var response = http.get(data.url, JSON.stringify(payload));
    var response = http.get(data.url);
    
    check(response, {
        'status is 200': (r) => r.status === 200,
    });

    // each VU sleeps for 10 seconds after performing a request
    sleep(10);
}