function FarmerRegister() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>👨‍🌾 Farmer Registration</h2>

      <input placeholder="Farmer Name" /><br /><br />
      <input placeholder="Phone Number" /><br /><br />
      <input placeholder="Crop Type" /><br /><br />
      <input placeholder="Price per Kg" /><br /><br />

      <button>Submit</button>
    </div>
  );
}

export default FarmerRegister;