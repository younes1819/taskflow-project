// prblm 1
function sumOfDigits(num) {
    let sum = 0;  
    while (num > 0) {
      sum += num % 10;  
      num = Math.floor(num / 10);  
    }
    return sum;
  }

// prblm 2
function minOfDigits(num) {
    let min = num % 10;
    num = Math.floor(num / 10);
    while (num > 0) {
      const digit = num % 10;
      if (digit < min) {
        min = digit;
      }
      num = Math.floor(num / 10);
    }
    return min;
  }

// prblm 3
function countDigits(num) {
    let count = 0;
    while (num > 0) {
      count++;
      num = Math.floor(num / 10);
    }
    return count;
  }