import { Task, TaskStatus, TaskPriority } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';

describe('Task', () => {
  it('should be able to create a new task', () => {
    const authorId = UniqueId.create();
    const task = Task.create({
      authorId,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
    });

    expect(task).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('Test Description');
    expect(task.priority).toBe(TaskPriority.MEDIUM);
    expect(task.status).toBe(TaskStatus.TODO);
  });

  it('should be able to create task with custom id', () => {
    const customId = UniqueId.create();
    const authorId = UniqueId.create();
    const task = Task.create(
      {
        authorId,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: null,
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        assignedUserIds: [],
      },
      customId,
    );

    expect(task.id.value).toBe(customId.value);
  });

  it('should be able to assign user to task', () => {
    const authorId = UniqueId.create();
    const userId = UniqueId.create();
    const task = Task.create({
      authorId,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
    });

    task.assignUser(userId);

    expect(task.assignedUserIds).toHaveLength(1);
    expect(task.assignedUserIds[0].value).toBe(userId.value);
  });

  it('should be able to unassign user from task', () => {
    const authorId = UniqueId.create();
    const userId = UniqueId.create();
    const task = Task.create({
      authorId,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [userId],
    });

    task.unassignUser(userId);

    expect(task.assignedUserIds).toHaveLength(0);
  });

  it('should be able to update task status', () => {
    const authorId = UniqueId.create();
    const task = Task.create({
      authorId,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
    });

    task.markAs(TaskStatus.IN_PROGRESS);

    expect(task.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should be able to update task title', () => {
    const authorId = UniqueId.create();
    const task = Task.create({
      authorId,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
    });

    task.setTitle('New Title');

    expect(task.title).toBe('New Title');
  });

  it('should not be able to create task with empty title', () => {
    const authorId = UniqueId.create();

    expect(() =>
      Task.create({
        authorId,
        title: '',
        description: 'Test Description',
        dueDate: null,
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        assignedUserIds: [],
      }),
    ).toThrow();
  });

  it('should not be able to create task with empty description', () => {
    const authorId = UniqueId.create();

    expect(() =>
      Task.create({
        authorId,
        title: 'Test Task',
        description: '',
        dueDate: null,
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        assignedUserIds: [],
      }),
    ).toThrow();
  });

  it('should not be able to set due date in the past', () => {
    const authorId = UniqueId.create();
    const task = Task.create({
      authorId,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
    });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    expect(() => task.setDueDate(yesterday)).toThrow();
  });

  it('should be able to set due date to today or future', () => {
    const authorId = UniqueId.create();
    const task = Task.create({
      authorId,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    task.setDueDate(tomorrow);

    expect(task.dueDate).toBeDefined();
  });
});
