import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 500,
  duration: '30s',
}

export default function () {
  let params = {
    product_id: 63609
  }
  http.get('http://localhost:3000/reviews/', params);
  http.get('http://localhost:3000/reviews/meta', params);
  sleep(1);
}