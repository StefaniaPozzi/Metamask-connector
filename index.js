async function connect() {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("connectBtn").innerHTML = "Connected to metamask";
    console.log("Connected!");
  } else {
    console.log("No metamask present");
    document.getElementById("connectBtn").innerHTML = "Please install metamask";
  }
}
