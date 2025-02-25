/**
 * @prettier
 */
import TopBar from "./components/TopBar"
import Logo from "./components/Logo"
import DarkMode from "./components/DarkMode"

const TopBarPlugin = () => ({
  components: { Topbar: TopBar, Logo, DarkMode },
})

export default TopBarPlugin
