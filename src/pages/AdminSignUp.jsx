// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import hero from "../assets/images/register.png";
// import googlelogo from "../assets/images/googlelogo.svg";
// import axios from "axios";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const AdminSignUp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({
//       ...formData,
//       [id]: value,
//     });

//     if (errors[id]) {
//       setErrors({
//         ...errors,
//         [id]: "",
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Full name is required";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setApiError("");

//     try {
//       const response = await axios.post(
//         "https://agropulse.onrender.com/sign-up",
//         {
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//         }
//       );

//       console.log("Signup response:", response.data);

//       if (response.data && response.data.token) {
//         localStorage.setItem("token", response.data.token);

//         if (response.data.user) {
//           localStorage.setItem("user", JSON.stringify(response.data.user));
//         }

//         navigate("/admin-login", {
//           state: { message: "Account created successfully! Please log in." },
//         });
//       } else {
//         setApiError(
//           "Registration completed but authentication token not received. Please try logging in."
//         );
//       }
//     } catch (error) {
//       console.error("Registration error:", error);

//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         "Failed to register. Please try again.";

//       setApiError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-5 bg-gray-50">
//       {/* Left Section (Hero) */}
//       <div
//         className="lg:col-span-2 flex flex-col justify-center items-center bg-cover bg-center p-6 sm:p-8 lg:p-10 text-white relative"
//         style={{ backgroundImage: `url(${hero})` }}
//       >
//         <div className="absolute inset-0 bg-black/40"></div>
//         <h2 className="relative text-3xl sm:text-4xl font-bold mb-4 text-center pt-10">
//           Hello, Friend!
//         </h2>
//         <p className="relative text-sm sm:text-base mb-6 text-center max-w-xs">
//           To keep connected with us, provide us with your information
//         </p>
//         <Link
//           to="/admin-login"
//           className="relative text-white bg-gray-500 hover:bg-gray-700 px-6 py-4 rounded-lg"
//         >
//           Sign In
//         </Link>
//       </div>

//       {/* Right Section (Form) */}
//       <div className="lg:col-span-3 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 bg-white sm:bg-[#F8F8FA]">
//         <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
//           Deep <span className="text-blue-600">Dive</span>
//         </h1>
//         <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
//           Sign Up to Deep Dive
//         </h2>

//         {apiError && (
//           <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 shadow-sm">
//             {apiError}
//           </div>
//         )}

//         <form
//           className="w-full max-w-md flex flex-col gap-5"
//           onSubmit={handleSubmit}
//         >
//           <div className="mb-2">
//             <label
//               className="block text-gray-700 text-sm font-semibold mb-2"
//               htmlFor="name"
//             >
//               Full Name
//             </label>
//             <input
//               className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all ${
//                 errors.name ? "border-red-400" : ""
//               }`}
//               id="name"
//               type="text"
//               placeholder="Enter your full name"
//               value={formData.name}
//               onChange={handleChange}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
//             )}
//           </div>

//           <div className="mb-2">
//             <label
//               className="block text-gray-700 text-sm font-semibold mb-2"
//               htmlFor="email"
//             >
//               Email
//             </label>
//             <input
//               className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all ${
//                 errors.email ? "border-red-400" : ""
//               }`}
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
//             )}
//           </div>

//           <div className="mb-2 relative">
//             <label
//               className="block text-gray-700 text-sm font-semibold mb-2"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <input
//               className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all ${
//                 errors.password ? "border-red-400" : ""
//               }`}
//               id="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//             </button>
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
//             )}
//           </div>

//           <div className="mb-2 relative">
//             <label
//               className="block text-gray-700 text-sm font-semibold mb-2"
//               htmlFor="confirmPassword"
//             >
//               Confirm Password
//             </label>
//             <input
//               className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all ${
//                 errors.confirmPassword ? "border-red-400" : ""
//               }`}
//               id="confirmPassword"
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="Confirm your password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             >
//               {showConfirmPassword ? (
//                 <FaEyeSlash size={20} />
//               ) : (
//                 <FaEye size={20} />
//               )}
//             </button>
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1.5">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center justify-center mb-4 w-1/2 mx-auto">
//             <button
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
//               type="submit"
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing up..." : "Sign Up"}
//             </button>
//           </div>

//           <div className="text-center text-gray-500 my-4">OR</div>

//           <button
//             className="w-full flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all"
//             type="button"
//             onClick={() =>
//               (window.location.href =
//                 "https://agropulse.onrender.com/api/v1/auth/google")
//             }
//           >
//             <img src={googlelogo} alt="Google logo" className="w-5 h-5" />
//             Sign Up with Google
//           </button>

//           <div className="text-center text-sm mt-4 text-gray-600">
//             Already have an account?{" "}
//             <Link
//               to="/admin-login"
//               className="text-blue-500 font-semibold hover:underline"
//             >
//               Sign In
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminSignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import hero from "../assets/images/register.png";
import googlelogo from "../assets/images/googlelogo.svg";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError("");
    setErrors({}); // Clear previous server errors

    try {
      const response = await axios.post(
        "https://agropulse.onrender.com/sign-up",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Signup response:", response.data);

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        console.log("Token stored:", response.data.accessToken);

        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          console.log("User stored:", response.data.user);
        }

        navigate("/admin-login", {
          state: { message: "Account created successfully! Please log in." },
        });
      } else {
        setApiError(
          <span>
            Authentication token missing in server response. Please try logging
            in or{" "}
            <a href="mailto:support@agropulse.com" className="underline">
              contact support
            </a>
            .
          </span>
        );
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Handle server-side validation errors
      let errorMessage =
        "Failed to register. Please try again or contact support.";
      let fieldErrors = {};

      if (error.response?.status === 422 && error.response?.data) {
        const {
          message,
          error: errorData,
          errors: errorArray,
        } = error.response.data;

        if (typeof message === "string") {
          errorMessage = message;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (typeof message === "object" && message.message) {
          errorMessage = message.message;
        } else if (Array.isArray(errorArray)) {
          // Map server errors to form fields
          errorMessage = "Please correct the following errors:";
          errorArray.forEach((err) => {
            if (err.path && err.message) {
              fieldErrors[err.path] = err.message; // e.g., { email: "Email already exists" }
            }
          });
          if (Object.keys(fieldErrors).length === 0) {
            errorMessage = errorArray.map((err) => err.message).join(", ");
          }
        }
      }

      // Set general error or field-specific errors
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors); // Display errors under specific fields
      } else {
        setApiError(errorMessage); // Display general error
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-5 bg-gray-50">
      {/* Left Section (Hero) */}
      <div
        className="lg:col-span-2 flex flex-col justify-center items-center bg-cover bg-center p-6 sm:p-8 lg:p-10 text-white relative"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <h2 className="relative text-3xl sm:text-4xl font-bold mb-4 text-center pt-10">
          Hello, Friend!
        </h2>
        <p className="relative text-sm sm:text-base mb-6 text-center max-w-xs">
          To keep connected with us, provide us with your information
        </p>
        <Link
          to="/admin-login"
          className="relative text-white bg-gray-500 hover:bg-gray-700 px-6 py-4 rounded-lg"
        >
          Sign In
        </Link>
      </div>

      {/* Right Section (Form) */}
      <div className="lg:col-span-3 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 bg-white sm:bg-[#F8F8FA]">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
          Deep <span className="text-blue-600">Dive</span>
        </h1>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
          Sign Up to Deep Dive
        </h2>

        {apiError && (
          <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 shadow-sm">
            {apiError}
          </div>
        )}

        <form
          className="w-full max-w-md flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all ${
                errors.name ? "border-red-400" : ""
              }`}
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
            )}
          </div>

          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all ${
                errors.email ? "border-red-400" : ""
              }`}
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          <div className="mb-2 relative">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all ${
                errors.password ? "border-red-400" : ""
              }`}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          <div className="mb-2 relative">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all ${
                errors.confirmPassword ? "border-red-400" : ""
              }`}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={20} />
              ) : (
                <FaEye size={20} />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center mb-4 w-1/2 mx-auto">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>

          <div className="text-center text-gray-500 my-4">OR</div>

          <button
            className="w-full flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all"
            type="button"
            onClick={() =>
              (window.location.href =
                "https://agropulse.onrender.com/api/v1/auth/google")
            }
          >
            <img src={googlelogo} alt="Google logo" className="w-5 h-5" />
            Sign Up with Google
          </button>

          <div className="text-center text-sm mt-4 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/admin-login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignUp;
