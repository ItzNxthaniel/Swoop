import Wick from "./wick"

(async() => {
  const wick = new Wick()
    await wick.setupCommands()
    await wick.setupHandlers()
    await wick.login()
})()
