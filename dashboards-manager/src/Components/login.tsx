"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode, JwtPayload } from "jwt-decode";
import spinner from "../../public/animations/spinner.json";
import Lottie from "lottie-react";

export default function LoginPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [token, setToken] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  interface MyToken extends JwtPayload {
    role: string;
    name?: string;
    email?: string;
  }


  // ✅ Check if token already exists and redirect
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      try {
        const decode = jwtDecode<MyToken>(storedToken);

        if (decode?.role === "MANAGER") {
          router.push("/manager/Dashboard");
        } else if (decode?.role === "ADMIN") {
          router.push("/admin/Dashboard");
        }
      } catch (err) {
        console.error("Invalid token in localStorage", err);
        localStorage.removeItem("access_token"); // cleanup
      }
    }
  }, [router]);

  const toggleAgree = () => {
    setAgree((prev) => !prev);
  };

  // form validation -- like phone number
  const validateForm = () => {
    const isPhone = /^[0-9]{10}$/.test(phone);
    if (!phone) {
      console.log('this is from if loop')
      toast.error("Invalid Number, Enter a valid 10-digit phone number 🚫", {
        duration: 3000,
      });
      return false;
    }
    if (!isPhone) {
      console.log('this is from else loop')
      toast.error("Invalid Number, Enter a valid 10-digit phone number 🚫", {
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  //login logic here -- like sending otp 
  const handleLogin = async () => {
    setLoading(true);
    if (!validateForm()) return setLoading(false);
    try {
      setLoading(true)
      const response = await axios.post(`${apiUrl}/auth/create`, { phone: phone });
      const { access_token } = response.data;

      console.log(access_token, 'from login screen')

      localStorage.setItem("access_token", access_token);
      setToken(access_token);
      console.log(token, 'from token..')
      const decode = jwtDecode<MyToken>(access_token);

      if (decode?.role === "MANAGER" && otp === "000000") {
        router.push("/manager/Dashboard");

      } else if (decode?.role === "ADMIN" && otp === "000000") {
        router.push("/admin/Dashboard");
      } else {
        alert("Invalid phone number or OTP");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
      toast.error(err.response?.data.message, {
        duration: 3000,
      });
      return;
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/btslogo.png"
            alt="Bus Tracking Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-orange-500">YatraQ</h1>
        <p className="text-sm text-gray-500 mb-6">YatraQ Portal</p>

        {/* Login Section */}
        <div className="text-left mb-4">
          <h2 className="flex justify-center items-center font-bold text-xl text-gray-700 mb-2 gap-2">
            <span role="img" aria-label="lock">🔒</span> Login
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Enter your credentials to access the YatraQ dashboard
          </p>
        </div>

        {/* Inputs */}
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
        />

        {/* Sign In Button */}
        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center bg-gray-400 text-white p-3 rounded-lg font-semibold hover:bg-gray-300 transition mb-6 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <Lottie
              animationData={spinner}
              loop
              style={{ width: 40, height: 30 }}
            />
          ) : (
            "Sign In"
          )}
        </button>

        {/* Terms & Conditions Checkbox */}
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            id="terms"
            checked={agree}
            onChange={toggleAgree}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label
            htmlFor="terms"
            className="ml-2 text-sm text-gray-600 cursor-pointer select-none"
          >
            I agree to the{" "}
            <span
              className="text-blue-600 underline"
              onClick={() => setShowTerms(true)} // open modal
            >
              terms and conditions
            </span>
          </label>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
            <div className="text-sm text-gray-700 max-h-60 overflow-y-auto mb-4">
              <p>Welcome to YatraQ! By using this app, you agree to the following terms...</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et ligula...</p>
              <p>Additional terms and conditions can go here.</p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
