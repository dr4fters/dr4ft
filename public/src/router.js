import Lobby from './components/lobby'
import Game  from './components/game'
let App

export default function(_App) {
  App = _App
  route()
  window.addEventListener('hashchange', route)
}

function route() {
  let path = location.hash.slice(1)
  let [route, id] = path.split('/')
  let component

  switch(route) {
    case 'g':
      component = Game({ id })
      break
    case '':
      component = Lobby()
      break
    default:
      return App.error(`not found: ${path}`)
  }

  App.component = component
  App.update()
}
