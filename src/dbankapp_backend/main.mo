import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

actor DBankApp {
  stable var currentValue: Float = 400;
  stable var startTime = Time.now();
  
  public func topUp(amount: Float) {
    currentValue += amount;
  };

  public func withdraw(amount: Float) {
    let temp: Float = currentValue - amount;
    if (temp >= 0) {
      currentValue -= amount;
    } else {
      Debug.print("Amount too large");
    }
  };

  public query func checkBalance(): async Float {
    return currentValue;
  };

  public func compound() {
    let currentTime = Time.now();
    let timeElapsedSeconds = (currentTime - startTime) / 1000000000;
    currentValue := currentValue * (1.00000000001 ** Float.fromInt(timeElapsedSeconds));
    // reset startTime for each compound
    startTime := currentTime;
    Debug.print(debug_show(currentValue));
  };
};
