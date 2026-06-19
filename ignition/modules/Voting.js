const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VotingModule", (m) => {
  // Durasi default voting adalah 20 menit
  const durationInMinutes = m.getParameter("durationInMinutes", 50);

  const voting = m.contract("Voting", [durationInMinutes]);

  return { voting };
});
