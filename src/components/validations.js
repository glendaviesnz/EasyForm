function validateRequired(value) {
    if (!value || value.trim() === '') {
        return false;
    }
    return true;
}
function validateEmail(value) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(value);
}

export const validationTypes = {
    required: { validate: validateRequired, message: 'Field is required' },
    email: { validate: validateEmail, message: 'Valid email address required' }
}