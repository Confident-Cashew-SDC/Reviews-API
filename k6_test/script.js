import http from 'k6/http';
import { check, sleep } from 'k6';


export const options = {
  vus: 150,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(85)<50'], // 85% of requests should be below 200ms
  },
};


// export default function () {
//   let randomID = Math.floor(Math.random() * (300000));
//   let requestParam = {
//    product_id: randomID
//   }
//   let res = http.get('http://localhost:3000/reviews', requestParam);
//   console.log(res.status)
//   sleep(1);
//   check(res, {
//     'is status 200': r => r.status === 200,
//     'Return time < 75ms': r => r.timings.duration < 75,
//     'Return time < 100ms': r => r.timings.duration < 100,
//     'Return time < 125ms': r => r.timings.duration < 125,
//     'Return time < 150ms': r => r.timings.duration < 150,
//     'Return time < 1275ms': r => r.timings.duration < 175,
//     'Return time < 200ms': r => r.timings.duration < 200,
//     'Return time < 250ms': r => r.timings.duration < 250,
//     'Return time < 300ms': r => r.timings.duration < 300,
//     'Return time < 350ms': r => r.timings.duration < 350,
//     'Return time < 500ms': r => r.timings.duration < 500,
//     'Return time < 600ms': r => r.timings.duration < 600
//   })
// }

export default function () {
  let sort = ['helpful', 'newest', 'relevant']
  let randomSort = sort[Math.floor(Math.random() * sort.length)]
  let randomID = Math.floor(Math.random() * (300000));
  let params = {
    product_id: randomID,
    sort: randomSort
  }
  // http.get(`http://localhost:3000/reviews?product_id=${params.product_id}&sort=${params.sort}`);
  // sleep(1);
  http.get(`http://localhost:3000/reviews/meta?product_id=${params.product_id}`);
  sleep(1);
}

// export default function () {
//   let randomID = Math.floor(Math.random() * (300000));
//   const params = {
//     product_id: randomID,
//     rating: 1,
//     summary: "SUGOI",
//     body: "SUGOI",
//     recommend: true,
//     name: "MrSugoi",
//     email: "SUGOI@gmail.com",
//     photos: [
//       {
//           url: "https://images.unsplash.com/photo-1560829675-11dec1d78930?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80"
//       }
//     ],
//     characteristics: {
//         Fit: {
//             value: 4
//         },
//         Length: {
//             value: 3
//         }
//     }
//   }
//   const res = http.post('http://localhost:3000/reviews', JSON.stringify(params), {headers: { 'Content-Type': 'application/json'}});
//   sleep(1);
// }
