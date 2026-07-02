// n8n Code: bypass L2 khi segment general — giữ draft từ L0

const item = $input.first().json;
return [{
  json: {
    ...item,
    l2_skipped: true,
    l2_qa: null,
  },
}];
