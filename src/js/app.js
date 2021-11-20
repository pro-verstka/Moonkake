/*
 Package Name: Moonkake
 Package URI: https://github.com/detectiveshelby/moonkake
 Version: 8.5.61
 Author: DevBrains
 Author URI: https://devbrains.io/
 */

// Vendors
import './vendor/polyfills'

// Config
import './config'

// Libs
import * as Libs from './libs'

// Components
import './components'

/* SETUP
-------------------------------------------------- */

MK.addPlugins({ ...Libs })
