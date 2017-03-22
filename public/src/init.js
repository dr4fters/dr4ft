//traceur cannot into circular dependencies
import App from './app'
import router from './router'

App.init(router)
