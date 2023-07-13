const validator = require('validator');

const validate = {
    validateString(str) {
        return str !== '' || 'Response invalid! Try again!';
    },
    validateSalary(num) {
        if (validator.isDecimal(num)) return true;
        return 'Response invalid! Try again!';
    },
    isSame(str1, str2) {
        if (str1 === str2) return true;
    }
};
    
module.exports = validate;