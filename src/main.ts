import { Game } from './game/game';
import { mountUI } from './ui/ui';

const root = document.getElementById('app');
if (!root) {
  throw new Error('App root element not found');
}

const game = new Game();
const api = mountUI(root, game);

export { game, api };
