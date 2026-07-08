/**
 * @prettier
 */
import TopBar from "./components/TopBar"
import Logo from "./components/Logo"
import DarkModeToggle from "./components/DarkModeToggle"
import ChangeHistoryToggle from "./components/ChangeHistoryToggle"

const TopBarPlugin = () => ({
  components: { Topbar: TopBar, Logo, DarkModeToggle, ChangeHistoryToggle },
})

export default TopBarPlugin
