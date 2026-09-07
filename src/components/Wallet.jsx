function Wallet({ yBucks }) {
  return (
    <div className="wallet">
      <span>🪙</span>
      <strong>{yBucks}</strong>
      <span>Y</span>
    </div>
  );
}

export default Wallet;
