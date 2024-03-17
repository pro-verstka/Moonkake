/*
 Package Name: Moonkake
 Package URI: https://github.com/detectiveshelby/moonkake
 Version: 10.0.0
 Author: DevBrains
 Author URI: https://devbrains.io/
 */

// Config
import './config'

// Components
import { Modal, ScrollAnimation } from './components'

/* SETUP
-------------------------------------------------- */

const modal = new Modal()
const animation = new ScrollAnimation()

MK.addPlugins({ modal, animation })
