import { useDispatch, useSelector } from "react-redux";
import { enable2FAAsync } from "../store/feature/authSlice";
import { useLanguage } from "../context/LanguageContext";

const Enable2FA = () => {
  const dispatch = useDispatch();
  const { twofaData, twofaLoading, twofaError } = useSelector((state) => state.auth);
  const { t } = useLanguage();
  const handleEnable = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.token) return;
    dispatch(enable2FAAsync({ token: auth.token }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{t("settings.abilita2FA")}</h2>
      <button
        onClick={handleEnable}
        disabled={twofaLoading}
        className="btn-login"
      >
        {twofaLoading ? t("settings.attivazioneInCorso") : t("settings.abilita2FA")}
      </button>

      {twofaError && <p className="text-red-500 mt-2">{twofaError}</p>}

      {twofaData && (
        <div className="mt-6">
          <p>{t("settings.scansionaQR")}</p>
          <img src={twofaData.qr} alt="QR Code 2FA" className="mt-4" />
        
        </div>
      )}
    </div>
  );
};

export default Enable2FA;