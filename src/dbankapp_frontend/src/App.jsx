import { useState, useEffect } from 'react';
import { dbankapp_backend } from 'declarations/dbankapp_backend';

function App() {
  const [currentValue, setCurrentValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    topUpAmount: '',
    withdrawalAmount: '',
  });

  const currentBalance = () => {
    return dbankapp_backend.compound()
      .then(() => {
        dbankapp_backend.checkBalance()
      .then((res) => {
        setCurrentValue(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err)
      })
    })
  };

  useEffect(() => {
    currentBalance();
  }, []);

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
    dbankapp_backend.topUp(Number(formData.topUpAmount));
    dbankapp_backend.withdraw(Number(formData.withdrawalAmount));
    currentBalance(); 
    setFormData({
      topUpAmount: '',
      withdrawalAmount: '',
    });
  }

  return (
    <div className="container">
      {isLoading && <h5>Loading ...</h5>}
      {currentValue &&
      <h1>Current Balance: <span id="value"></span>{currentValue.toFixed(2)}</h1>}
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
