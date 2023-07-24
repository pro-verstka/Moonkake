/*
 Package Name: Moonkake
 Package URI: https://github.com/detectiveshelby/moonkake
 Version: 8.9.0
 Author: DevBrains
 Author URI: https://devbrains.io/
 */

// Config
import './config'

// Components
import { Modal } from './components'

/* SETUP
-------------------------------------------------- */

const modal = new Modal()

MK.addPlugins({ modal }, true)
