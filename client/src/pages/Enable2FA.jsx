import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { enable2FAAsync } from "../store/feature/authSlice";

const Enable2FA = () => {
  const dispatch = useDispatch();
  const { twofaData, twofaLoading, twofaError } = useSelector(
    (state) => state.auth
  );

  // Popup di conferma
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // Quando clicchi "Abilita 2FA" → apre popup
  const handleEnable = () => {
    setShowConfirmPopup(true);
  };

  // Conferma: chiama l’API
  const confirmEnable = () => {
    setShowConfirmPopup(false);

    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.token) return;

    dispatch(enable2FAAsync({ token: auth.token }));
  };

  // Annulla popup
  const cancelEnable = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="p-6 relative">

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

      {/* POPUP CONFERMA */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-[300px] text-center">

            <h2 className="text-lg font-bold text-[#090c64] mb-4">
              Sei sicuro di voler attivare il 2FA?
            </h2>

           <div className="flex justify-around mt-4">
  <button
    onClick={cancelEnable}
    className="px-4 py-2 bg-gray-400 text-white rounded-xl 
               transition-transform duration-200 hover:scale-110"
  >
    No
  </button>

  <button
    onClick={confirmEnable}
    className="px-4 py-2 bg-[#090c64] text-white rounded-xl 
               transition-transform duration-200 hover:scale-110"
  >
    Sì
  </button>
</div>


          </div>
        </div>
      )}
    </div>
  );
};

export default Enable2FA;