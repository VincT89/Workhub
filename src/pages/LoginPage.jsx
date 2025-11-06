import { useState } from "react";
import bgImage from "../assets/bg/bg.jpg";
import iconLogo from "../assets/logo/iconaLogo.png";
import eyes from "../assets/icons/closedEye.png";
import eyes2 from "../assets/icons/Eye.png";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Effettua login quando si preme "Accedi"
  const handleSubmit = (e) => {
    e.preventDefault();
    // logica login
  };

  return (
    <main className="main-container bg-white">
      {/* Background */}
      <img className="overlay-full z-0" alt="Background" src={bgImage} />

      {/* Liquid Glass Overlay */}
      <div className="absolute w-[822px] h-[659px] glass-card z-10" />

      {/* Content */}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center z-20 w-full max-w-[822px] px-6 py-10"
      >
        {/* Logo + Titolo */}
        <div className="flex items-center justify-center gap-8 mb-8 text-center">
          <img className="w-[120px] h-[114px]" alt="Logo" src={iconLogo} />
          <div>
            <span className="text-title">
              Entra nel gestionale
            </span>
            <br />
            <span className="font-bold font-nunito text-sm text-primary">
              Credenziali demo: <br />
              admin/admin123 - supervisor/supervisor123 - user/user123
            </span>
          </div>
        </div>

        {/* Username */}
        <div className="m-4">
          <label htmlFor="username" className="label-base">
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
            className="input-base"
          />
        </div>

        {/* Password */}
        <div className="relative m-2">
          <label htmlFor="password" className="label-base">
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
            className="input-base pr-12"
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
          <Link to="/settings" className="text-link">
            Dimenticato la password?
          </Link>
        </div>

        {/* Login Button */}
        <button type="submit" className="btn-primary w-full sm:w-[225px] h-[50px] mt-8">
          <span className="text-[20px] font-bold font-nunito">
            Accedi
          </span>
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
