const callRPC = (body, callback) => {
  fetch("http://localhost:7076", {
      method: "POST",
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(result => callback(null, result))
    .catch(error => callback(error, null))
}

const updateCharityAmount = (id, address) => {
  callRPC({
    action: "account_balance",
    account: address
  }, (err, res) => {
    if (err)
      return err;
    callRPC({
      action: "krai_from_raw",
      amount: res.balance
    }, (err, res) => {
      if (err) {
        console.log(err);
        return err;
      }
      document.querySelector("#xrb_" + id).innerHTML = res.amount / 1000 + " XRB";
      if (usdValue)
        document.querySelector("#usd_" + id).innerHTML = "$" + Math.round(res.amount / 1000 * usdValue);
      else
        document.querySelector("#usd_" + id).innerHTML = "Failed to load price from CmC";
    })
  })
}

const updateCharities = () => {
  updateCharityAmount("olpc", "xrb_3atqm4jgmax43pf8qhjg7cr4q9wgr1w46qtgbqz5j6kipa5ax4oa4sxmzurg");
  updateCharityAmount("rasp", "xrb_138aipaesau8yeugby4ongnn7kb8ef1ak4mbpdtxacfazpcuktruspkdcsf7");
  updateCharityAmount("learning", "xrb_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkztrfjy5k7z4imsrata9est");
}

let usdValue = 0;
fetch("https://api.coinmarketcap.com/v1/ticker/raiblocks/")
  .then(res => res.json())
  .then(res => {
    usdValue = res[0].price_usd;
    updateCharities();
  })
  .catch(err => {
    usdValue = 0;
    console.error(err);
    updateCharities();
  })
