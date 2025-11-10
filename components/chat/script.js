// import { check, sleep } from "k6";
// import http from "k6/http";

// export const options = {
//   stages: [
//     { duration: "1m", target: 1 }, // Ramp-up to 1 users over 1 minute.
//     { duration: "2m", target: 1 }, // Stay at 1 users for 5 minutes.
//     { duration: "1m", target: 0 }, // Ramp-down to 0 users.
//   ],
// };

// export default function () {
//   const url = "https://model-wallaby-ruling.ngrok-free.app/api/chat";
//   const payload = JSON.stringify({
//     id: "cfa10ade-fb35-4018-a468-3e2f78988514",
//     messages: [
//       {
//         role: "user",
//         content: "I want to generate report and lets start",
//       },
//     ],
//   });

//   const params = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   const res = http.post(url, payload, params);

//   // Check if the response is OK
//   check(res, {
//     "is status 200": (r) => r.status === 200,
//     "response time < 500ms": (r) => r.timings.duration < 500,
//   });

//   sleep(1); // Simulate user think time
// }

import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "1m", target: 10 }, // Ramp-up to 10 users over 1 minute
    { duration: "3m", target: 10 }, // Stay at 10 users for 3 minutes
    { duration: "1m", target: 0 }, // Ramp-down to 0 users over 1 minute
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% of requests must complete below 2 seconds
    http_req_failed: ["rate<0.01"], // Error rate should be less than 1%
  },
};

export default function () {
  const url = "https://api-inference.huggingface.co/models/openai/whisper-tiny";
  const headers = {
    Authorization: "",
  };

  const filePath =
    "https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3"; // Replace with the actual file path
  const file = http.file(filePath, "audio/mpeg"); // Use the http.file() method for k6-specific file handling

  const formData = {
    file, // Add the file directly to the formData object
  };

  const response = http.post(url, formData, { headers });

  // Check for successful responses
  check(response, {
    "is status 200": (r) => r.status === 200,
    "response time < 2000ms": (r) => r.timings.duration < 2000,
  });

  sleep(1); // Pause between iterations
}
