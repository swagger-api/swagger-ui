/**
 * @prettier
 */
import TopBar from "./components/TopBar"
import Logo from "./components/Logo"
import DarkModeToggle from "./components/DarkModeToggle"

const TopBarPlugin = () => ({
  components: { Topbar: TopBar, Logo, DarkModeToggle },
})

export default TopBarPlugin
