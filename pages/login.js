import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { toast, Toaster } from "react-hot-toast";
import './Login.css'; // Import the custom CSS file

export default function Login() {
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username: e.target.username.value,
      password: e.target.password.value,
    });

    if (result?.error) {
      toast.error(`Login failed: ${result.error}`, {
        duration: 3000,
      });
    } else {
      toast.success("Logged in successfully!", {
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/Customers");
      }, 2000);
    }
  };

  return (
    <>
      <Toaster />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-heading">Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <label className="login-label">Username</label>
            <input
              name="username"
              type="text"
              required
              className="login-input"
            />
            <label className="login-label">Password</label>
            <input
              name="password"
              type="password"
              required
              className="login-input"
            />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
