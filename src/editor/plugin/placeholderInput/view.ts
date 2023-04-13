import { icons } from '@ckeditor/ckeditor5-core';
import { ButtonView, createLabeledInputText, LabeledFieldView, submitHandler, View } from '@ckeditor/ckeditor5-ui';
import './style.css';

export default class FormView extends View {
  placeholderInputView: any;
  saveButtonView: any;
  cancelButtonView: any;
  childViews: any;

  constructor(locale: any) {
    super(locale);

    this.placeholderInputView = this._createInput('Add placeholder');

    this.saveButtonView = this._createButton('Save', icons.check, 'ck-button-save');
    // Submit type of the button will trigger the submit event on entire form when clicked
    // (see submitHandler() in render() below).
    this.saveButtonView.type = 'submit';

    this.cancelButtonView = this._createButton('Cancel', icons.cancel, 'ck-button-cancel');

    // Delegate ButtonView#execute to FormView#cancel
    this.cancelButtonView.delegate('execute').to(this, 'cancel');

    this.childViews = this.createCollection([this.placeholderInputView, this.saveButtonView, this.cancelButtonView]);

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-placeholder-form'],
        tabindex: '-1',
      },
      children: this.childViews,
    });
  }

  render() {
    super.render();

    // Submit the form when the user clicked the save button or pressed enter in the input.
    submitHandler({
      view: this,
    });
  }

  focus() {
    this.childViews.first.focus();
  }

  _createInput(label: string) {
    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);

    labeledInput.label = label;

    return labeledInput;
  }

  _createButton(label: string, icon: string, className: string) {
    const button = new ButtonView();

    button.set({
      label,
      icon,
      tooltip: true,
      class: className,
    });

    return button;
  }
}
