import { autobind } from '../decorators/autobind';
import { Draggable } from '../models/drag-drop';
import Project from '../models/project';
import Component from './base-component';

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get people() {
    return this.project.people === 1
      ? '1 person'
      : `${this.project.people} people`;
  }

  constructor(destinationElId: string, project: Project) {
    super('single-project', destinationElId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  @autobind
  handleDragStart(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @autobind
  handleDragEnd(_event: DragEvent) {}

  configure() {
    this.element.addEventListener('dragstart', this.handleDragStart);
    this.element.addEventListener('dragend', this.handleDragEnd);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.people + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

export default ProjectItem;
