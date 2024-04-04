import { useState, useEffect } from "react";
import { dbankapp_backend } from "declarations/dbankapp_backend";

function App() {
  const [currentValue, setCurrentValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    topUpAmount: "",
    withdrawalAmount: "",
  });

  const buttonStyle = {
    disabledButton: {
      border: "2px rgba(255, 255, 255, 0.1) solid",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    enabledButton: {
      display: "block",
      textDecoration: "none",
      borderRadius: "7px",
      marginBottom: "10px",
      cursor: "pointer",
      fontSize: "20px",
      fontWeight: "600",
      border: isHovered ? "2px #8095FF solid" : "2px #617BFF solid",
      color: "#1E1C29",
      backgroundColor: isHovered ? "#8095FF" : "#bdc6f1",
      padding: "15px",
      transition: "all 0.2s",
    },
  };

  useEffect(() => {
    getCurrentBalance().catch(console.error);
  }, []);

  useEffect(() => {
    topUpAmount().catch(console.error);
  }, []);

  useEffect(() => {
    withdrawAmount().catch(console.error);
  }, []);

  async function getCurrentBalance() {
    // canester calls run in serial
    await dbankapp_backend.compound();
    const response = await dbankapp_backend.checkBalance();
    setCurrentValue(response);
    setIsLoading(false);
    setIsButtonDisabled(false);
    setFormData({
      topUpAmount: "",
      withdrawalAmount: "",
    });
  }

  async function topUpAmount() {
    await dbankapp_backend.topUp(Number(formData.topUpAmount));
  }

  async function withdrawAmount() {
    await dbankapp_backend.withdraw(Number(formData.withdrawalAmount));
  }

  function handleChange(e) {
    const { value, name } = e.target;
    setFormData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function handleClick(e) {
    e.preventDefault();
    if (formData.topUpAmount) {
      topUpAmount();
      getCurrentBalance();
      setIsButtonDisabled(true);
    }
    if (formData.withdrawalAmount) {
      if (currentValue - formData.withdrawalAmount < 0) {
        window.alert("Withdrawal amount is too large");
      }
      withdrawAmount();
      getCurrentBalance();
      setIsButtonDisabled(true);
    }
  }

  function onMouseEnter() {
    setIsHovered(true);
  }

  function onMouseLeave() {
    setIsHovered(false);
  }

  return (
    <div className="container">
      {isLoading && <h5>Loading ...</h5>}
      {currentValue && <h1>Current Balance: €{currentValue.toFixed(2)}</h1>}
      <div className="divider"></div>
      <form typeof="submit">
        <h2>Amount to Top Up</h2>
        <input
          className="input-amount"
          type="number"
          min="0"
          step="0.01"
          name="topUpAmount"
          value={formData.topUpAmount}
          onChange={handleChange}
        />
        <h2>Amount to Withdraw</h2>
        <input
          className="withdrawal-amount"
          type="number"
          min="0"
          step="0.01"
          name="withdrawalAmount"
          value={formData.withdrawalAmount}
          onChange={handleChange}
        />
        <input
          style={
            isButtonDisabled ? buttonStyle.disabledButton : buttonStyle.enabledButton
          }
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          placeholder="Finalise Transaction"
        />
      </form>
    </div>
  );
}

export default App;
