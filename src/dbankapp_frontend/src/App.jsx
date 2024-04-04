import { useState, useEffect } from 'react';
import { dbankapp_backend } from 'declarations/dbankapp_backend';

function App() {
  const [currentValue, setCurrentValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    topUpAmount: '',
    withdrawalAmount: '',
  });

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
    await dbankapp_backend.compound();
    const response = await dbankapp_backend.checkBalance();
    setCurrentValue(response);
    setIsLoading(false);
  }

  async function topUpAmount() {
    await dbankapp_backend.topUp(Number(formData.topUpAmount));
  }

  async function withdrawAmount() {
    await dbankapp_backend.withdraw(Number(formData.withdrawalAmount));
  }

  function handleChange(e) {
    const {value, name} = e.target;
    setFormData(prevValue => {
      return {
        ...prevValue,
        [name]: value,
      }
    });
  }

  function handleClick(e) {
    e.preventDefault();
    if (formData.topUpAmount) {
      topUpAmount();
      getCurrentBalance(); 
    }
    if (formData.withdrawalAmount) {
      if (currentValue - formData.withdrawalAmount < 0) {
        window.alert("Withdrawal amount is too large");
      }
      withdrawAmount();
      getCurrentBalance(); 
    }
    
    setFormData({
      topUpAmount: '',
      withdrawalAmount: '',
    });
  }

  return (
    <div className="container">
      {isLoading && <h5>Loading ...</h5>}
      {currentValue && <h1>Current Balance: <span id="value"></span>{currentValue.toFixed(2)}</h1>}
      <div className="divider"></div>
      <form typeof="submit">
        <h2>Amount to Top Up</h2>
        <input className="input-amount" type="number" min="0" name="topUpAmount" value={formData.topUpAmount} onChange={handleChange} />
        <h2>Amount to Withdraw</h2>
        <input className="withdrawal-amount" type="number" min="0" name="withdrawalAmount" value={formData.withdrawalAmount} onChange={handleChange} />
        <input className="submit-btn" onClick={handleClick} placeholder="Finalise Transaction" />
      </form>
    </div>
  );
}

export default App;
