import Project, { Status } from '../models/project';

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private static instance: ProjectState;
  private projects: Project[] = [];

  private constructor() {
    super();
  }

  private notifyListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      Status.Active
    );

    this.projects.push(newProject);
    this.notifyListeners();
  }

  moveProject(projectId: string, newStatus: Status) {
    const project = this.projects.find(prj => prj.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.notifyListeners();
    }
  }
}

export default ProjectState.getInstance();
