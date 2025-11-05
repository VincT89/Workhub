import { useState, useEffect } from "react";
import bgImage from "../assets/bg/bg.jpg";
import iconLogo from "../assets/logo/iconaLogo.png";
import eyes from "../assets/icons/closedEye.png";
import eyes2 from "../assets/icons/Eye.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../store/feature/authSlice"; 

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, loading, error } = useSelector((state) => state.auth);

  // Effettua login quando si preme "Accedi"
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAsync({ username, password }));
  };

  //  Reindirizza alla dashboard quando login riuscito
  useEffect(() => {
    if (token && user) {
      navigate("/dashboard");
    }
  }, [token, user, navigate]);

  return (
    <main className="w-full min-h-screen relative overflow-hidden flex justify-center items-center ">
      {/* Background */}
      <img
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        alt="Background"
        src={bgImage}
      />

      {/* Liquid Glass Overlay */}
      <div className="absolute w-[822px] h-[659px] bg-[#fafafa20] backdrop-blur-sm rounded-[56px] border border-neutral-50/30 z-10" />

      {/* Content */}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center z-20 w-full max-w-[822px] px-6 py-10"
      >
        {/* Logo + Titolo */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <img className="w-[120px] h-[114px]" alt="Logo" src={iconLogo} />
          <div className="text-center">
            <span className="text-4xl font-bold font-nunito uppercase">
              Entra nel gestionale
            </span>
            <br />
            <span className=" font-bold font-nunito text-sm">
              Credenziali demo: <br />
              admin/admin123 - supervisor/supervisor123 - user/user123
            </span>
          </div>
				</div>
				
				 {/* Messaggio di errore */}
        {error && (
          <p className="text-red-600 font-bold mt-3 animate-pulse">
            {error}
          </p>
        )}

        {/* Username */}
        <div className="m-4">
          <label
            htmlFor="username"
            className="block  text-[18px] font-bold font-nunito mb-2"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full sm:w-[486px] h-[35px] bg-[#D9D9D9]/30 shadow-md border border-neutral-50/30 rounded-2xl px-4  outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative m-2">
          <label
            htmlFor="password"
            className="block  text-[18px] font-bold font-nunito mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full sm:w-[486px] h-[35px] bg-[#D9D9D9]/30 shadow-md border border-neutral-50/30 rounded-2xl px-4 pr-12 outline-none"
          />
          {/* Toggle Password */}
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute top-[75%] right-4 transform -translate-y-1/2 w-[30px] h-[30px] z-20 cursor-pointer"
          >
            <img
              className="w-[25px] h-[25px] select-none pointer-events-none"
              alt="Toggle password visibility"
              src={showPassword ? eyes2 : eyes}
            />
          </button>
        </div>

        {/* Password dimenticata */}
        <div className="w-[63%] flex justify-end">
          <Link
            to="/settings"
            className=" text-[14px] font-bold font-nunito"
          >
            Dimenticato la password?
          </Link>
				</div>
				

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full sm:w-[225px] h-[50px] bg-[#1C62A0] shadow-md border border-neutral-50/20 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-[#155293] transition-colors duration-300 mt-8 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="text-[#FBFBFB] text-[18px] font-bold font-nunito animate-pulse">
              Accesso in corso...
            </span>
          ) : (
            <span className="text-[#FBFBFB] text-[20px] font-bold font-nunito">
              Accedi
            </span>
          )}
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
