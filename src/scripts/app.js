/*
 Package Name: Moonkake
 Package URI: https://github.com/detectiveshelby/moonkake
 Version: 10.1.0
 Author: DevBrains
 Author URI: https://devbrains.io/
 */

// Config
import './config'

// Components
import * as Components from './components'

/* SETUP
-------------------------------------------------- */

MK.addPlugins({ ...Components }, true)
