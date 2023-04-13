import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import PlaceholderEditing from './editing';
import PlaceholderUI from './placeholder-ui';

export default class Placeholder extends Plugin {
  static get requires() {
    return [PlaceholderEditing, PlaceholderUI];
  }
}
