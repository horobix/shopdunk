let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
let isEmail = (email) => pattern.test(email);

export default isEmail;
