import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import PlaceholderInputEditing from './editing';
import AbbreviationUI from './ui';

export default class PlaceholderInput extends Plugin {
  static get requires() {
    return [PlaceholderInputEditing, AbbreviationUI];
  }
}
