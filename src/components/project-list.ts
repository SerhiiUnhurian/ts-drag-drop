import { autobind } from '../decorators/autobind';
import { DragTarget } from '../models/drag-drop';
import Project, { Status } from '../models/project';
import projectState from '../state/project-state';
import Component from './base-component';
import ProjectItem from './project-item';

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  projectList: Project[] = [];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.configure();
    this.renderContent();
  }

  @autobind
  handleDragOver(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  handleDragLeave(_: Event) {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.classList.remove('droppable');
  }

  @autobind
  handleDrop(event: DragEvent) {
    event.preventDefault();
    const projectId = event.dataTransfer!.getData('text/plain');
    const newStatus = this.type === 'active' ? Status.Active : Status.Finished;
    projectState.moveProject(projectId, newStatus);
    // To turn Drag Target to its initial state
    this.handleDragLeave(event);
  }

  configure() {
    this.element.addEventListener('dragover', this.handleDragOver);
    this.element.addEventListener('dragleave', this.handleDragLeave);
    this.element.addEventListener('drop', this.handleDrop);

    projectState.addListener((projects: Project[]) => {
      const filteredProjectList = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === Status.Active;
        }
        return prj.status === Status.Finished;
      });

      this.projectList = filteredProjectList;
      this.renderProjects();
    });
  }

  renderContent() {
    this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
    this.element.querySelector('h2')!.textContent =
      this.type.toLocaleUpperCase() + 'PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.textContent = '';

    for (const project of this.projectList) {
      new ProjectItem(listEl.id, project);
    }
  }
}

export default ProjectList;
