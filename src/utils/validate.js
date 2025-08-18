export const  checkValidatedata = (email , password) => {

   const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email); 
    const isPasswordValid = password && password.length >= 6; // Simple validation - just minimum 6 characters
    if(!isEmailValid) return "Please enter a valid email address";
    if(!isPasswordValid) return "Password must be at least 6 characters long";

    return null;
    
};
