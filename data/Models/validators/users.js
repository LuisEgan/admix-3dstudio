const yup = require('yup');

// validationSchema: Yup.object({
//   password: Yup.string().required('Password is required'),
//   passwordConfirmation: Yup.string()
//     .oneOf([Yup.ref('password'), null], 'Passwords must match')
// });

const emailSchema = yup
  .string()
  .email()
  .lowercase()
  .trim();

const passwordSchema = yup
  .string()
  .min(8, 'at least 8 chars')
  .matches(/^(?=.*\d)(?=.*\D)(?=.*[a-zA-Z]).{8,}$/g, 'at least 1 letter and at least 1 number');

// const passwordConfirmSchema = yup.string()
//   .equalTo(yup.ref(passwordSchema), 'passwords dont match');

module.exports = {
  email: {
    validator: password => emailSchema.isValid(password),
    message: props => `${props.value} is not a valid email address!`,
  },
  password: {
    validator: password => passwordSchema.isValid(password),
    // message: props => `${props.value} is not a valid password!`,
    message: props => `Invalid password!`,
  },
};
