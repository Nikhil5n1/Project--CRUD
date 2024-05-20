// import { useState } from 'react';

// const Form = ({ onSubmit }) => {
//   const [formData, setFormData] = useState({});

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//     setFormData({});
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" name="name" placeholder="Name" onChange={handleChange} />
//       <input type="text" name="email" placeholder="Email" onChange={handleChange} />
//       <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} />
//       <input type="text" name="dateOfBirth" placeholder="Date of Birth" onChange={handleChange} />
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default Form;