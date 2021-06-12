import { autobind } from '../decorators/autobind.js';
import projectState from '../state/project-state.js';
import { Validatable, validate } from '../utils/validation.js';
import Component from './base-component.js';

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputEl = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.handleSubmit);
  }

  renderContent() {}

  private getUserInput(): [string, string, number] | void {
    const title = this.titleInputEl.value.trim();
    const description = this.descriptionInputEl.value.trim();
    const people = +this.peopleInputEl.value;

    const titleValidatable = {
      value: title,
      isRequired: true,
    };
    const descriptionValidatable = {
      value: description,
      isRequired: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: people,
      isRequired: true,
      min: 1,
      max: 10,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      return alert('Ivalid input!');
    }

    return [title, description, people];
  }

  private clearUserInput() {
    this.titleInputEl.value = '';
    this.descriptionInputEl.value = '';
    this.peopleInputEl.value = '';
  }

  @autobind
  private handleSubmit(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearUserInput();
    }
  }
}

export default ProjectInput;
