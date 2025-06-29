// pages/login.js
"use client";
import axios from "axios";

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      email: e.target.email.value,
      password: e.target.password.value,
    });
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    axios
      .post("http://localhost:3000/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("user", response.data.userId);
        localStorage.setItem("token", response.data.token);
        // Handle successful response
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };

  return (
    <div className="bg-img w-full h-[50rem] border-[#ffffff]">
      <div className="mx-auto w-fit pt-[1rem]">
        <form onSubmit={handleSubmit}>
          <div className="py-[1rem]">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="px-[1rem] py-[.5rem] rounded-full"
            />
          </div>
          <div className="py-[1rem]">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="px-[1rem] py-[.5rem] rounded-full"
            />
          </div>
          <div className="w-full py-[1rem]">
            <button className="mx-auto login-btn" type="submit">
              Login<span className="login-btn-border"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
