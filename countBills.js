'use strict'

const bills = [
  { value: 1000, type: 'bill' },
  { value: 500, type: 'bill' },
  { value: 200, type: 'bill' },
  { value: 100, type: 'bill' },
  { value: 50, type: 'bill' },
  { value: 20, type: 'coin', size: 3 },
  { value: 10, type: 'coin', size: 2 },
  { value: 5, type: 'coin', size: 5 },
  { value: 2, type: 'coin', size: 8 },
  { value: 1, type: 'coin', size: 1 }
];

function countBill(amount) {
  let result = [];

  bills.forEach(bill => {
    if (amount >= bill.value) {
      result.push(
        Object.assign({ quantity: Math.floor(amount / bill.value) }, bill)
      );
      amount = amount % bill.value;
    }
  });
  return result;
}

module.exports = countBill;
