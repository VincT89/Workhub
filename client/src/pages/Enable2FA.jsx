import { useDispatch, useSelector } from "react-redux";
import { enable2FAAsync } from "../store/feature/authSlice";

const Enable2FA = () => {
  const dispatch = useDispatch();
  const { twofaData, twofaLoading, twofaError } = useSelector((state) => state.auth);

  const handleEnable = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.token) return;
    dispatch(enable2FAAsync({ token: auth.token }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Abilita 2FA</h2>
      <button
        onClick={handleEnable}
        disabled={twofaLoading}
        className="btn-login"
      >
        {twofaLoading ? "Attivazione in corso..." : "Abilita 2FA"}
      </button>

      {twofaError && <p className="text-red-500 mt-2">{twofaError}</p>}

      {twofaData && (
        <div className="mt-6">
          <p>Scansiona questo QR con Google Authenticator</p>
          <img src={twofaData.qr} alt="QR Code 2FA" className="mt-4" />
        
        </div>
      )}
    </div>
  );
};

export default Enable2FA;