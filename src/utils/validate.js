export const checkValidatedata = (email, password) => {
    // Email validation
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    
    if (!isEmailValid) {
        return "Please enter a valid email address (e.g., user@example.com)";
    }
    
    // Password validation with detailed feedback
    if (!password) {
        return "Password is required";
    }
    
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }
    
    if (password.length > 32) {
        return "Password must be no more than 32 characters long";
    }
    
    if (!/(?=.*[0-9])/.test(password)) {
        return "Password must contain at least one number (0-9)";
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
        return "Password must contain at least one lowercase letter (a-z)";
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
        return "Password must contain at least one uppercase letter (A-Z)";
    }
    
    // Optional: Check for special characters (uncomment if needed)
    // if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    //     return "Password must contain at least one special character (!@#$%^&*...)";
    // }
    
    return null;
};
